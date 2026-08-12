import type { Metadata } from "next";
import "./globals.css";

import { ExperienceProvider } from "@/context/ExperienceContext";

export const metadata: Metadata = {
  title: "یک تجربه خاص",
  description: "یک تجربه شخصی و متفاوت",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <ExperienceProvider>
          {children}
        </ExperienceProvider>
      </body>
    </html>
  );
}