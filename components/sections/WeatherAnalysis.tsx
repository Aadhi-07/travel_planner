import SectionWrapper from "./SectionWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { CloudSun } from "lucide-react";

type WeatherAnalysisProps = {
  data: { expectedConditions: string; bestTimeToVisit: string } | undefined;
  isLoading: boolean;
};

const WeatherAnalysis = ({ data, isLoading }: WeatherAnalysisProps) => {
  if (!data && !isLoading) return null;

  return (
    <SectionWrapper id="weatheranalysis">
      <h2 className="mb-2 text-lg font-semibold tracking-wide flex items-center">
        <CloudSun className="mr-2" /> Weather Analysis
      </h2>
      {!isLoading && data ? (
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-semibold text-sm mb-1 text-muted-foreground">Expected Conditions</h3>
            <div className="text-sm tracking-wide text-balance leading-7 whitespace-pre-wrap">
              {data.expectedConditions}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1 text-muted-foreground">Best Time To Visit</h3>
            <div className="text-sm tracking-wide text-balance leading-7 whitespace-pre-wrap">
              {data.bestTimeToVisit}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <div>
            <Skeleton className="w-1/4 h-4 mb-2" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4 mt-2" />
          </div>
          <div>
            <Skeleton className="w-1/4 h-4 mb-2" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/4 h-4 mt-2" />
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

export default WeatherAnalysis;
