#!/usr/bin/env node
// Measures the deposit-to-fill window on Relay requests for a wallet (or a referrer/app tag).
//
// Usage:
//   node tools/relay-latency/measure.mjs --user 0x7e37990fa2a156bc500aad32b859a65240f9dfa8
//   node tools/relay-latency/measure.mjs --referrer <tag-found-in-first-run> --max 1000
//   node tools/relay-latency/measure.mjs --user 0x... --json out.json
//   node tools/relay-latency/measure.mjs --fixture tools/relay-latency/fixture.json   (offline self-test)
//
// Zero dependencies. Node 18+.
//
// The number that matters is "inTx -> outTx" latency: the time between the origin
// deposit becoming visible on-chain and the solver's destination swap landing. That
// is the only window a front-runner can act in.

const API = "https://api.relay.link/requests/v2";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : "true"]);
    return acc;
  }, []),
);

const user = args.user;
const referrer = args.referrer;
const maxRequests = Number(args.max || 500);
const pageSize = 50;
const jsonOut = args.json;
const fixture = args.fixture; // local JSON file in Relay API shape, for offline testing

if (!user && !referrer && !fixture) {
  console.error("Pass --user <address> or --referrer <tag>");
  process.exit(1);
}

async function fetchPage(continuation) {
  const u = new URL(API);
  if (user) u.searchParams.set("user", user);
  if (referrer) u.searchParams.set("referrer", referrer);
  u.searchParams.set("limit", String(pageSize));
  if (continuation) u.searchParams.set("continuation", continuation);
  const res = await fetch(u, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Relay API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchAll() {
  if (fixture) {
    const fs = await import("node:fs");
    const page = JSON.parse(fs.readFileSync(fixture, "utf8"));
    return (page.requests || []).slice(0, maxRequests);
  }
  const out = [];
  let continuation;
  do {
    const page = await fetchPage(continuation);
    const items = page.requests || [];
    out.push(...items);
    continuation = page.continuation;
    process.stderr.write(`fetched ${out.length}\r`);
    if (!items.length) break;
  } while (continuation && out.length < maxRequests);
  process.stderr.write("\n");
  return out.slice(0, maxRequests);
}

function ts(tx) {
  // Relay returns unix seconds on tx objects; fall back to ISO fields if present.
  if (!tx) return null;
  if (typeof tx.timestamp === "number") return tx.timestamp * (tx.timestamp < 1e12 ? 1000 : 1);
  if (tx.timestamp) return Date.parse(tx.timestamp);
  return null;
}

function summarize(r) {
  const d = r.data || {};
  const meta = d.metadata || {};
  const cin = meta.currencyIn || {};
  const cout = meta.currencyOut || {};
  const inTxs = d.inTxs || [];
  const outTxs = d.outTxs || [];
  const inT = Math.min(...inTxs.map(ts).filter(Boolean));
  const outT = Math.min(...outTxs.map(ts).filter(Boolean));
  const created = Date.parse(r.createdAt);
  return {
    id: r.id,
    status: r.status,
    createdAt: r.createdAt,
    referrer: r.referrer ?? d.referrer ?? d.appFees?.[0]?.recipient ?? null,
    originChainId: r.originChainId ?? cin.currency?.chainId,
    destinationChainId: r.destinationChainId ?? cout.currency?.chainId,
    inSymbol: cin.currency?.symbol,
    outSymbol: cout.currency?.symbol,
    outAddress: cout.currency?.address,
    amountUsd: Number(cin.amountUsd ?? cout.amountUsd ?? NaN),
    inTx: inTxs[0]?.hash,
    outTx: outTxs[0]?.hash,
    createdToInMs: Number.isFinite(inT) ? inT - created : null,
    inToOutMs: Number.isFinite(inT) && Number.isFinite(outT) ? outT - inT : null,
    createdToOutMs: Number.isFinite(outT) ? outT - created : null,
  };
}

function pct(sorted, p) {
  if (!sorted.length) return null;
  const i = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[i];
}

function fmtMs(ms) {
  return ms == null ? "n/a" : `${(ms / 1000).toFixed(1)}s`;
}

function dist(label, values) {
  const s = values.filter((v) => v != null && Number.isFinite(v)).sort((a, b) => a - b);
  console.log(`\n${label} (n=${s.length})`);
  if (!s.length) return;
  console.log(`  p10 ${fmtMs(pct(s, 10))}  p50 ${fmtMs(pct(s, 50))}  p90 ${fmtMs(pct(s, 90))}  max ${fmtMs(s[s.length - 1])}`);
  const buckets = [[0, 1000], [1000, 2000], [2000, 5000], [5000, 10000], [10000, 30000], [30000, Infinity]];
  for (const [lo, hi] of buckets) {
    const n = s.filter((v) => v >= lo && v < hi).length;
    if (n) console.log(`  ${fmtMs(lo).padStart(6)} - ${hi === Infinity ? "   inf" : fmtMs(hi).padStart(6)} : ${"#".repeat(Math.round((n / s.length) * 40)).padEnd(40)} ${n}`);
  }
}

function countBy(rows, key) {
  const m = new Map();
  for (const r of rows) m.set(r[key] ?? "unknown", (m.get(r[key] ?? "unknown") || 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

const raw = await fetchAll();
const rows = raw.map(summarize);
if (jsonOut) {
  const fs = await import("node:fs");
  fs.writeFileSync(jsonOut, JSON.stringify({ raw, rows }, null, 2));
  console.log(`wrote ${jsonOut}`);
}

console.log(`\nRequests analysed: ${rows.length}`);
console.log(`Status:            ${countBy(rows, "status").map(([k, v]) => `${k}=${v}`).join(", ")}`);
console.log(`Referrer tags:     ${countBy(rows, "referrer").map(([k, v]) => `${k}=${v}`).join(", ")}`);
console.log(`Origin chains:     ${countBy(rows, "originChainId").map(([k, v]) => `${k}=${v}`).join(", ")}`);
console.log(`Dest chains:       ${countBy(rows, "destinationChainId").map(([k, v]) => `${k}=${v}`).join(", ")}`);

const usd = rows.map((r) => r.amountUsd).filter(Number.isFinite).sort((a, b) => a - b);
if (usd.length) {
  console.log(`\nTrade size USD (n=${usd.length}): p10 $${pct(usd, 10).toFixed(0)}  p50 $${pct(usd, 50).toFixed(0)}  p90 $${pct(usd, 90).toFixed(0)}  max $${usd[usd.length - 1].toFixed(0)}`);
}

dist("Request created -> origin deposit visible (invisible to a bot, nothing to act on)", rows.map((r) => r.createdToInMs));
dist("ORIGIN DEPOSIT -> DESTINATION FILL  (the exploitable window)", rows.map((r) => r.inToOutMs));
dist("Request created -> destination fill (what the user experiences)", rows.map((r) => r.createdToOutMs));

const big = rows.filter((r) => r.inToOutMs != null && r.amountUsd >= 1000);
dist("Deposit -> fill, trades >= $1000 only", big.map((r) => r.inToOutMs));

console.log("\nSample rows (newest first):");
for (const r of rows.slice(0, 15)) {
  console.log(`  ${r.createdAt}  ${String(r.originChainId).padStart(6)} -> ${String(r.destinationChainId).padEnd(9)} $${String(Math.round(r.amountUsd || 0)).padStart(6)}  ${(r.outSymbol || "?").padEnd(10)} in->out ${fmtMs(r.inToOutMs).padStart(7)}  ${r.status}`);
}

console.log(`
How to read this:
  - If "ORIGIN DEPOSIT -> DESTINATION FILL" p50 is under ~2s, a bot cannot reliably land before the
    solver. The idea is dead on latency regardless of implementation.
  - If p50 is several seconds AND the >= $1000 bucket is non-trivial, there is a window worth
    attacking. Profit per trade is bounded by the victim's price impact, so only the large trades
    matter.
  - Use the most common "Referrer tags" value with --referrer to pull the whole app's flow rather
    than one wallet.
`);
