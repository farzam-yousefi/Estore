import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { Poppins, Roboto_Mono } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["200", "400", "700"],
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  weight: ["300", "600"],
  style: "italic",
});


export const metadata :Metadata= {
  title: "My Store",
  description: "The best e-shop in town",
  icons: {
    icon: "/favicon.ico",   // Favicon
  },
  openGraph: {
    title: "My Store",
    description: "Buy amazing products online",
    url: "https://my-store.com",
    siteName: "My Store",
    images: [
      {
        url: "/og-image.png", // Open Graph image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html lang="en" suppressHydrationWarning >
         {/* <body className={`${poppins.variable} font-sans`}> */}
         <body className={`${poppins.className} min-h-screen antialiased font-sans`}>
        
        {children}
       
      </body>
    </html>
  );
}
