import ItineraryDayHeader from "@/components/ItineraryDayHeader";
import {Doc} from "@/convex/_generated/dataModel";
import {Sun, Sunrise, Sunset, Moon, TrashIcon, RefreshCcw} from "lucide-react";
import {ReactNode, useState} from "react";
import {useAction} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Button} from "@/components/ui/button";

type TimelineProps = {
  itinerary: Doc<"plan">["itinerary"] | undefined;
  planId: string;
  allowEdit: boolean;
};

const Timeline = ({itinerary, planId, allowEdit}: TimelineProps) => {
  const regenerateDayAction = useAction(api.plan.regenerateSingleDay);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);

  const handleRegenerate = async (dayIndex: number) => {
    setRegeneratingIndex(dayIndex);
    try {
      await regenerateDayAction({ planId, dayIndex });
    } catch (e) {
      console.error(e);
    } finally {
      setRegeneratingIndex(null);
    }
  };

  if (itinerary && itinerary.length === 0)
    return (
      <div className="flex justify-center items-center p-4">
        Click + Add a day to plan an itinerary
      </div>
    );
  const filteredItinerary = itinerary?.filter((day) => {
    const isMorningEmpty = day.activities.morning.length === 0;
    const isAfternoonEmpty = day.activities.afternoon.length === 0;
    const isEveningEmpty = day.activities.evening.length === 0;
    const isNightEmpty = !day.activities.night || day.activities.night.length === 0;

    return !(isMorningEmpty && isAfternoonEmpty && isEveningEmpty && isNightEmpty);
  });

  return (
    <ol className="relative border-s border-gray-200 dark:border-foreground/40 ml-10 mt-5">
      {filteredItinerary?.map((day, index) => (
        <li className="mb-10 ms-6" key={day.title}>
          <span className="absolute flex items-center justify-center w-6 h-6 bg-[#c86d51]/20 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-[#c86d51]/30">
            <svg
              className="w-2.5 h-2.5 text-[#c86d51]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
            </svg>
          </span>
          <div className="flex flex-col mb-2">
            <ItineraryDayHeader planId={planId} title={day.title} allowEdit={allowEdit} />
            {allowEdit && (
              <div className="flex justify-end -mt-3 mb-2 print:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full shadow-sm"
                  disabled={regeneratingIndex === index}
                  onClick={() => handleRegenerate(index)}
                >
                  <RefreshCcw className={`w-3 h-3 mr-2 ${regeneratingIndex === index ? "animate-spin" : ""}`} />
                  {regeneratingIndex === index ? "Regenerating..." : "Regenerate Day"}
                </Button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-5">
            <Activity
              activity={day.activities.morning}
              heading="Morning"
              icon={<Sunrise className="w-4 h-4 text-[#c86d51]" />}
            />
            <Activity
              activity={day.activities.afternoon}
              heading="Afternoon"
              icon={<Sun className="w-4 h-4 text-yellow-500" />}
            />
            <Activity
              activity={day.activities.evening}
              heading="Evening"
              icon={<Sunset className="w-4 h-4 text-gray-600 dark:text-white" />}
            />
            {day.activities.night && day.activities.night.length > 0 && (
              <Activity
                activity={day.activities.night}
                heading="Night"
                icon={<Moon className="w-4 h-4 text-indigo-500" />}
              />
            )}
            
            {day.foodRecommendations && (
              <div className="flex flex-col gap-2 p-2 bg-muted/30 rounded-sm mt-2 border">
                <h4 className="font-semibold text-sm">Food Recommendations</h4>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  {day.foodRecommendations.breakfast && <li><strong>Breakfast:</strong> {day.foodRecommendations.breakfast}</li>}
                  {day.foodRecommendations.lunch && <li><strong>Lunch:</strong> {day.foodRecommendations.lunch}</li>}
                  {day.foodRecommendations.dinner && <li><strong>Dinner:</strong> {day.foodRecommendations.dinner}</li>}
                </ul>
              </div>
            )}
            
            {day.stayOptions && day.stayOptions.length > 0 && (
              <div className="flex flex-col gap-2 p-2 bg-muted/30 rounded-sm mt-2 border">
                <h4 className="font-semibold text-sm">Stay Options</h4>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  {day.stayOptions.map((opt, i) => <li key={i}>{opt}</li>)}
                </ul>
              </div>
            )}
            
            {day.optionalActivities && day.optionalActivities.length > 0 && (
              <div className="flex flex-col gap-2 p-2 bg-muted/30 rounded-sm mt-2 border">
                <h4 className="font-semibold text-sm">Optional Activities</h4>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  {day.optionalActivities.map((act, i) => <li key={i}>{act}</li>)}
                </ul>
              </div>
            )}
            
            {day.quickBookings && day.quickBookings.length > 0 && (
              <div className="flex flex-col gap-2 p-2 bg-muted/30 rounded-sm mt-2 border">
                <h4 className="font-semibold text-sm">Quick Bookings</h4>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  {day.quickBookings.map((book, i) => <li key={i}>{book}</li>)}
                </ul>
              </div>
            )}
            
            {day.tips && (
              <div className="flex flex-col gap-2 p-2 bg-yellow-50/50 dark:bg-yellow-900/20 rounded-sm mt-2 border border-yellow-200 dark:border-yellow-700/30">
                <h4 className="font-semibold text-sm text-yellow-800 dark:text-yellow-400">Tip</h4>
                <p className="text-sm text-muted-foreground">{day.tips}</p>
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};

const Activity = ({
  activity,
  heading,
  icon,
}: {
  activity: {itineraryItem: string; briefDescription: string}[];
  heading: string;
  icon: ReactNode;
}) => {
  if (activity.length == 0) return null;
  return (
    <div className="flex flex-col gap-2 shadow-md p-2 bg-muted rounded-sm">
      <h3
        className="text-sm leading-none
                  text-gray-600  w-max p-2 font-semibold
                  flex justify-center gap-2 items-center capitalize"
      >
        {icon}
        <div className="text-foreground">{heading}</div>
      </h3>
      <ul className="space-y-1 text-muted-foreground pl-2">
        {activity.map((act, index) => (
          <li key={index}>
            <div className="w-full p-1 overflow-hidden">
              <span className=" text-foreground font-semibold">{act.itineraryItem}</span>
              <p className="max-w-md md:max-w-full text-wrap whitespace-pre-line">
                {act.briefDescription}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
