import type { Metadata } from "next";
import Header from "./component/Header/Header";
import "./globals.css";
import { Coiny, DM_Sans } from "next/font/google";
import Link from "next/link";
import Footer from "./component/Footer/Footer";
import InactivityGuard from "./component/InactivityGuard";
const coiny = Coiny({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-coiny",
});
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm" }); // DM Sans supports many weights

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${coiny.variable} ${dmSans.variable}`}>
      <body className="bg-black">
        <InactivityGuard />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
