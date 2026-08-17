import type { Metadata } from "next";
import Header from "@/components/Header";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.travelplannerai.site"),
  title: {
    default: "Journo - Your Smart AI Travel Companion",
    template: "%s | Journo - Your Smart AI Travel Companion",
  },
  description:
    "Journo provides intelligent travel suggestions, personalized itineraries, and seamless trip planning. Plan your perfect trip with ease.",
  keywords:
    "Journo, travel planner, AI travel planner, smart travel, travel suggestions, destination insights, personalized itineraries, trip planning",
  openGraph: {
    title: "Journo - Your Smart AI Travel Companion",
    description:
      "Journo provides intelligent travel suggestions, personalized itineraries, and seamless trip planning. Plan your perfect trip with ease.",
    url: "https://www.travelplannerai.site",
    type: "website",
    siteName: "Journo",
    images: [
      {
        url: "opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Journo AI Travel Planner",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center p-0 m-0 overflow-hidden">
        {children}
      </main>
    </>
  );
}
