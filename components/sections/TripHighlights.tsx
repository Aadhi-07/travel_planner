import SectionWrapper from "./SectionWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";

type TripHighlightsProps = {
  content: string | undefined;
  isLoading: boolean;
};

const TripHighlights = ({ content, isLoading }: TripHighlightsProps) => {
  if (!content && !isLoading) return null;

  return (
    <SectionWrapper id="triphighlights">
      <h2 className="mb-2 text-lg font-semibold tracking-wide flex items-center">
        <MapPin className="mr-2" /> Trip Highlights
      </h2>
      {!isLoading ? (
        <div className="text-sm tracking-wide text-balance leading-7 whitespace-pre-wrap">
          {content}
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-3/4 h-4" />
        </div>
      )}
    </SectionWrapper>
  );
};

export default TripHighlights;
