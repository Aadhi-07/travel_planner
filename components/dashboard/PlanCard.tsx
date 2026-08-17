import { Doc } from "@/convex/_generated/dataModel";
import navigationSvg from "@/public/card-navigation.svg";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { CalendarDaysIcon, MapPin } from "lucide-react";
import { TooltipContainer } from "@/components/shared/Toolip";
import { getFormattedDateRange } from "@/lib/utils";

type PlanCardProps = {
  plan: Doc<"plan"> & { isSharedPlan: boolean } & Pick<
      Doc<"planSettings">,
      "fromDate" | "toDate"
    >;
  isPublic?: boolean;
};

const PlanCard = ({ plan, isPublic = false }: PlanCardProps) => {
  return (
    <Link
      role="article"
      href={
        isPublic
          ? `/plans/${plan._id}/community-plan`
          : `/plans/${plan._id}/plan`
      }
      className="flex justify-center items-center group/card focus:outline-none focus:ring-2 focus:ring-[#c86d51]/50 rounded-xl"
    >
      <Card
        className="w-full h-[260px] rounded-xl cursor-pointer overflow-hidden border border-border/50 bg-card hover:border-[#c86d51]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative"
      >
        <CardContent className="p-0 w-full h-full relative overflow-hidden">
          <Image
            role="figure"
            alt={plan.nameoftheplace || "travel destination"}
            src={plan.imageUrl ?? navigationSvg}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-xl w-full group-hover/card:scale-110 transition-transform duration-700 ease-out"
            priority={plan.imageUrl ? false : true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-300 group-hover/card:from-black/90" />

          {plan.isSharedPlan && (
            <TooltipContainer text="This plan has been shared with you">
              <div className="absolute right-3 top-3 bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-2.5 py-0.5 text-xs font-medium shadow-md text-white">
                Shared
              </div>
            </TooltipContainer>
          )}

          <div className="absolute inset-x-0 bottom-0 p-5 text-white flex flex-col justify-end">
            <div className="flex items-center gap-1.5 text-[#c86d51] text-xs font-semibold uppercase tracking-wider mb-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>Destination</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-sm line-clamp-1">
              {plan.nameoftheplace}
            </h3>
            {plan.fromDate && plan.toDate && (
              <div className="flex items-center gap-2 text-xs text-slate-200 mt-2 bg-white/10 backdrop-blur-md border border-white/10 w-fit px-2.5 py-1 rounded-md">
                <CalendarDaysIcon className="h-3.5 w-3.5 text-[#e6a99a]" />
                <span>
                  {getFormattedDateRange(
                    new Date(plan.fromDate),
                    new Date(plan.toDate),
                    "PP"
                  )}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PlanCard;

