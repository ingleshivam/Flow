import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Flow AI | AI Workflow Builder",
  description: "A clean, modern visual AI workflow builder powered by React Flow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="font-sans antialiased">
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
