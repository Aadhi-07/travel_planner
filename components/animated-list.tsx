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
    iconBg: "rgba(59, 130, 246, 0.12)",
    isSecondary: false,
  },
  {
    name: "Top Spots Unveiled",
    description: "Discover must-see attractions",
    icon: "📍",
    iconBg: "rgba(59, 130, 246, 0.12)",
    isSecondary: false,
  },
  {
    name: "Foodie Hotspots",
    description: "Find the best local eats",
    icon: "🍜",
    iconBg: "rgba(59, 130, 246, 0.12)",
    isSecondary: false,
  },
  {
    name: "Community Plans",
    description: "Explore trips from fellow travelers",
    icon: "👥",
    iconBg: "rgba(59, 130, 246, 0.10)",
    isSecondary: true,
  },
  {
    name: "Collaboration via Email Invite",
    description: "Plan together with friends",
    icon: "✉️",
    iconBg: "rgba(59, 130, 246, 0.12)",
    isSecondary: false,
  },
  {
    name: "City & Country Guides",
    description: "Expert tips for every destination",
    icon: "🌍",
    iconBg: "rgba(15, 118, 110, 0.12)",
    isSecondary: false,
  },
  {
    name: "Meta-searched Booking Links",
    description: "Flights, Hotels, Activities—all in one place",
    icon: "🔗",
    iconBg: "rgba(59, 130, 246, 0.12)",
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
        backgroundColor: isSecondary ? "rgba(255, 255, 255, 0.80)" : "rgba(255, 255, 255, 0.94)",
        border: "1px solid rgba(120, 90, 50, 0.12)",
        boxShadow: "0 8px 24px rgba(50, 40, 20, 0.08)",
      }}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: iconBg || "rgba(59, 130, 246, 0.12)",
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-base font-semibold text-[#171717]">
            <span>{name}</span>
          </figcaption>
          <p className="text-sm font-normal text-[#4B5563]">
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

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#F7F1E5]"></div>
    </div>
  );
}
