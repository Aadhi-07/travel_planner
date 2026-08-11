import SectionWrapper from "./SectionWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet } from "lucide-react";

type BudgetRangeProps = {
  data: {
    totalEstimatedCost: string;
    essentials: string;
    transport: string;
    accommodation: string;
    food: string;
    insurance: string;
    contingency: string;
  } | undefined;
  isLoading: boolean;
};

const BudgetRange = ({ data, isLoading }: BudgetRangeProps) => {
  if (!data && !isLoading) return null;

  return (
    <SectionWrapper id="budgetrange">
      <h2 className="mb-2 text-lg font-semibold tracking-wide flex items-center">
        <Wallet className="mr-2" /> Budget Range
      </h2>
      {!isLoading && data ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-semibold text-muted-foreground">Total Estimated Cost</span>
            <span className="font-bold text-lg">{data.totalEstimatedCost}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
              <span className="text-muted-foreground">Essentials / Activities</span>
              <span className="font-semibold">{data.essentials}</span>
            </div>
            <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
              <span className="text-muted-foreground">Transport</span>
              <span className="font-semibold">{data.transport}</span>
            </div>
            <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
              <span className="text-muted-foreground">Accommodation</span>
              <span className="font-semibold">{data.accommodation}</span>
            </div>
            <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
              <span className="text-muted-foreground">Food</span>
              <span className="font-semibold">{data.food}</span>
            </div>
            <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
              <span className="text-muted-foreground">Insurance</span>
              <span className="font-semibold">{data.insurance}</span>
            </div>
            <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
              <span className="text-muted-foreground">Contingency</span>
              <span className="font-semibold">{data.contingency}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <Skeleton className="w-full h-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

export default BudgetRange;
