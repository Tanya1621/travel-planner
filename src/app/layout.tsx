import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TripsProvider } from "@/context/TripsContext";
import { ActivitiesProvider } from "@/context/ActivitiesContext";
import { UndoToast } from "@/components/ui/UndoToast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Planner",
  description: "Plan trips and sketch a daily itinerary.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TripsProvider>
          <ActivitiesProvider>
            {children}
            <UndoToast />
          </ActivitiesProvider>

        </TripsProvider>
      </body>
    </html>
  );
}
