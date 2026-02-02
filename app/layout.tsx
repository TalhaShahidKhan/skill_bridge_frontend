import RootLayoutClient from "@/components/layout/RootLayoutClient";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skill Bridge | Bridging Knowledge & Growth",
  description:
    "Connect with expert tutors and master new skills with Skill Bridge.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
