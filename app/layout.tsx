// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Gupta Studio 4u | Professional Photography & Videography",
    template: "%s | Gupta Studio 4u",
  },
  description:
    "Gupta Studio 4u - Professional photography, videography, decoration, printing & more. Wedding, birthday, corporate events covered.",
  keywords: [
    "photo studio",
    "photography",
    "videography",
    "wedding photography",
    "event photography",
    "decoration",
    "banner printing",
    "t-shirt printing",
    "Gupta Studio 4u",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Gupta Studio 4u",
    title: "Gupta Studio 4u | Professional Photography",
    description: "Your memories, our passion.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Nunito:wght@300;400;500;600;700;800&family=Oswald:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}