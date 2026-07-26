import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { Providers } from "@/app/providers";
import { StationProvider } from "@/components/station-provider";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Source_Serif_4({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const data = IBM_Plex_Mono({
  variable: "--font-data",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "TimoWeather",
  description: "Hong Kong weather from the Observatory — signals, stations, rainfall.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} ${data.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Providers>
            <StationProvider>{children}</StationProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
