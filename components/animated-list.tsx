"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";

interface Item {
  name: string;
  description: string;
  icon: string;
  iconBg?: string;
  isSecondary?: boolean;
}

let notifications: Item[] = [
  {
    name: "Tailored Itineraries",
    description: "Personalized trip plans just for you",
    icon: "🗺️",
    iconBg: "rgba(200, 109, 81, 0.14)", // Terracotta
    isSecondary: false,
  },
  {
    name: "Top Spots Unveiled",
    description: "Discover must-see attractions",
    icon: "📍",
    iconBg: "rgba(217, 119, 36, 0.14)", // Warm Amber
    isSecondary: false,
  },
  {
    name: "Foodie Hotspots",
    description: "Find the best local eats",
    icon: "🍜",
    iconBg: "rgba(180, 120, 60, 0.14)", // Warm Sepia
    isSecondary: false,
  },
  {
    name: "Community Plans",
    description: "Explore trips from fellow travelers",
    icon: "👥",
    iconBg: "rgba(124, 130, 90, 0.16)", // Muted Olive
    isSecondary: true,
  },
  {
    name: "Collaboration via Email Invite",
    description: "Plan together with friends",
    icon: "✉️",
    iconBg: "rgba(200, 109, 81, 0.14)", // Terracotta
    isSecondary: false,
  },
  {
    name: "City & Country Guides",
    description: "Expert tips for every destination",
    icon: "🌍",
    iconBg: "rgba(124, 130, 90, 0.16)", // Sage/Olive
    isSecondary: false,
  },
  {
    name: "Meta-searched Booking Links",
    description: "Flights, Hotels, Activities—all in one place",
    icon: "🔗",
    iconBg: "rgba(195, 140, 75, 0.14)", // Sand/Ochre
    isSecondary: false,
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, iconBg, isSecondary }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4 transition-all duration-200 ease-in-out hover:scale-[102%]"
      )}
      style={{
        backgroundColor: isSecondary ? "rgba(253, 248, 240, 0.85)" : "rgba(255, 252, 247, 0.96)",
        border: "1px solid rgba(140, 109, 88, 0.18)",
        boxShadow: "0 8px 20px rgba(60, 45, 30, 0.06)",
      }}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: iconBg || "rgba(200, 109, 81, 0.14)",
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-base font-semibold text-[#36271c]">
            <span>{name}</span>
          </figcaption>
          <p className="text-sm font-normal text-[#6e5d50]">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function AnimatedListDemo({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden p-2",
        className,
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#f7f1e5]"></div>
    </div>
  );
}

