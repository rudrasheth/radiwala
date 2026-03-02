import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ScrapUber - Raddiwala App",
    description: "Smart scrap collection, instant payouts.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased font-sans">{children}</body>
        </html>
    );
}
