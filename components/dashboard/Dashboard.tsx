"use client";
import { NoPlans } from "@/components/dashboard/NoPlans";
import PlanCard from "@/components/dashboard/PlanCard";
import { GeneratePlanDrawerWithDialog } from "@/components/shared/DrawerWithDialogGeneric";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { Search, X } from "lucide-react";
import { ChangeEvent, useState } from "react";

export default function Dashboard() {
  const [searchPlanText, setSearchPlanText] = useState("");
  const plans = useQuery(api.plan.getAllPlansForAUser, {});

  const [filteredPlans, setFilteredPlans] = useState<typeof plans>();
  const finalPlans = filteredPlans ?? plans;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchPlanText(value);
    if (!plans || !plans.length) {
      return;
    }

    if (!value) {
      setFilteredPlans(undefined);
      return;
    }

    const filteredResults = plans.filter((plan) => {
      return plan.nameoftheplace.toLowerCase().includes(value.toLowerCase());
    });

    setFilteredPlans(filteredResults);
  };

  const handleClearSearch = () => {
    setSearchPlanText("");
    setFilteredPlans(undefined);
  };

  return (
    <section className="bg-background/95 w-full min-h-[calc(100vh-4rem)] flex-1 flex flex-col">
      <div className="flex justify-between gap-5 bg-card/60 backdrop-blur-sm items-center lg:px-20 px-5 py-4 border-b border-border/40 sticky top-0 z-10">
        <div className="relative ml-auto flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#c86d51]" />
          <Input
            id="searchPlan"
            name="searchPlan"
            onChange={handleSearch}
            value={searchPlanText}
            placeholder="Search Travel Plans by destination..."
            type="text"
            className="w-full rounded-lg bg-background pl-9 pr-9 text-sm transition-all focus-visible:ring-2 focus-visible:ring-[#c86d51]/50"
            disabled={!plans || !plans.length}
          />
          {searchPlanText && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full hover:bg-muted"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <GeneratePlanDrawerWithDialog />
      </div>

      <div className="flex h-full w-full px-4 lg:px-20 flex-1 py-6">
        <div className="mx-auto bg-card/40 border border-border/40 rounded-xl flex-1 w-full min-h-[400px]">
          {!finalPlans || finalPlans.length === 0 ? (
            <NoPlans isLoading={!plans} searchActive={Boolean(searchPlanText.trim())} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 p-6 justify-center">
              {finalPlans?.map((plan) => (
                <PlanCard key={plan._id} plan={plan} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

