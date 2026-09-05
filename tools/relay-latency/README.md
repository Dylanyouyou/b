# Relay deposit-to-fill latency measurement

Answers one question before any bot is built: how long is the gap between a Relay
origin deposit becoming visible on-chain and the solver's destination swap landing?
That gap is the only window a cross-chain front-runner can act in.

```sh
# one wallet
node tools/relay-latency/measure.mjs --user 0x7e37990fa2a156bc500aad32b859a65240f9dfa8

# whole app flow, once the referrer tag is known from the first run
node tools/relay-latency/measure.mjs --referrer <tag> --max 1000 --json relay.json
```

Requires Node 18+ and outbound access to `api.relay.link`. No dependencies.

Output: status split, referrer tags, origin and destination chain split, trade size
percentiles, and three latency distributions. The one labelled
`ORIGIN DEPOSIT -> DESTINATION FILL` is the decision number.

Decision rule:

- p50 under about 2 seconds: no reliable window, stop.
- p50 of several seconds with a real share of trades above $1000: a window exists,
  and only those trades are worth pursuing since profit is bounded by the victim's
  price impact.
