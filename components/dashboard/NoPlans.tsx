import { cn } from "@/lib/utils";
import { GiJourney } from "react-icons/gi";
import { Skeleton } from "@/components/ui/skeleton";

export function NoPlans({
  isLoading,
  searchActive,
}: {
  isLoading: boolean;
  searchActive?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 p-6 w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[250px] rounded-xl border border-border/60 bg-card/80 p-4 flex flex-col justify-between overflow-hidden shadow-sm"
          >
            <div className="space-y-3">
              <Skeleton className="h-32 w-full rounded-lg bg-muted/80" />
              <Skeleton className="h-5 w-3/4 bg-muted/80 rounded" />
              <Skeleton className="h-4 w-1/2 bg-muted/60 rounded" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-4 w-24 bg-muted/50 rounded" />
              <Skeleton className="h-5 w-14 bg-muted/50 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full min-h-[350px] flex flex-col justify-center items-center p-8 text-center">
      <div className="p-4 rounded-full bg-[#c86d51]/10 text-[#c86d51] mb-4 transition-transform hover:scale-105">
        <GiJourney className="text-6xl" />
      </div>
      <h3 className="font-bold text-xl tracking-tight text-foreground">
        {searchActive ? "No matching travel plans found" : "No travel plans created yet!"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-1">
        {searchActive
          ? "Try searching for a different destination or clear your filter."
          : "Start planning your next adventure by creating your first AI itinerary!"}
      </p>
    </div>
  );
}

