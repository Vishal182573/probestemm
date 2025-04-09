// Import necessary dependencies
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalChatProvider } from "@/components/chat/GlobalChatProvider";

// Configure Geist Sans font with variable font support
// This allows for dynamic font weights from 100 to 900
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

// Configure Geist Mono font (monospace) with variable font support
// This allows for dynamic font weights from 100 to 900
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Define metadata for the application
// This information is used for SEO and browser display
export const metadata: Metadata = {
  title: "Probestem",
  description: "Revolutionize STEM Research",
  // Configure various favicon and icon settings for different platforms
  icons:{
    icon:[
      '/favicon.ico?v=2'
    ],
    apple:[
      '/apple-touch-icon.png?v=4'
    ],
    shortcut:[
      '/apple-touch-icon.png'
    ]
  },
  manifest:'/site.webmanifest'
};

// Root layout component that wraps all pages in the application
// This is a Next.js specific component that provides the base HTML structure
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Set the document language to English
    <html lang="en">
      {/* Apply the Geist fonts as CSS variables and enable anti-aliasing */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap children in the GlobalChatProvider */}
        <GlobalChatProvider>
          {/* Render the page content */}
          {children}
        </GlobalChatProvider>
      </body>
    </html>
  );
}
