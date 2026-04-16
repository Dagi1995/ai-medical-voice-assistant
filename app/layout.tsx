import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
//@ts-ignore
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

import { LanguageProvider } from "@/lib/LanguageContext";

// Replacing the legacy fonts with modern counterparts suited for an AI tool.
// Utilizing variable names expected by internal stylesheets but overriding default typography.
const outfit = Outfit({
  variable: "--font-geist-sans", 
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Medical Voice Agent",
  description: "Next Generation AI Healthcare Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${outfit.variable} ${jetbrainsMono.variable} ${outfit.className} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>
              <Provider>
                {children}
                <Toaster />
              </Provider>
            </LanguageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
