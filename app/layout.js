import "./globals.css";
import { Luckiest_Guy } from "next/font/google";

const luckiestGuy = Luckiest_Guy({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-luckiest-guy",
});

export const metadata = {
  title: "Kitty The Mechanic | Solana",
  description: "Kity is forever on Solana",
  icons: {
    icon: "https://cdn.builder.io/api/v1/image/assets%2F87b1db0643374fe69850443dd80506a7%2Fddedf29575b74056b7e5c8595f809930?format=webp&width=800",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${luckiestGuy.variable}`}>{children}</body>
    </html>
  );
}
