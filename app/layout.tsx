import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ 
    subsets: ["latin"],
    variable: "--font-jakarta",
});

const outfit = Outfit({ 
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    title: "ScrapUber | Professional Scrap Solutions",
    description: "The premium way to manage your scrap. Fast, reliable, and eco-friendly collection at your doorstep.",
    manifest: "/manifest.json",
    icons: {
        icon: "/icon.png",
        apple: "/icon.png",
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "ScrapUber",
    },
    formatDetection: {
        telephone: false,
    },
};

export const viewport: Viewport = {
    themeColor: "#1B2E24",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${jakarta.variable} ${outfit.variable}`}>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/icon-192x192.png" />
            </head>
            <body className="antialiased font-jakarta bg-background text-foreground selection:bg-primary/10">
                {children}
            </body>
        </html>
    );
}
