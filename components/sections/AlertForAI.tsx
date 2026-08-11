import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Loader} from "lucide-react";
import {useEffect, useState} from "react";

const loadingMessages = [
  "Finding the best local cuisines...",
  "Scouting night activities...",
  "Checking the weather...",
  "Planning the perfect itinerary...",
  "Discovering hidden gems...",
  "Booking imaginary flights...",
];

const AlertForAI = ({show}: {show: boolean}) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;
  return (
    <Alert className="ring-1 ring-yellow-100 shadow-md">
      <Loader className="h-4 w-4 animate-spin" />
      <AlertTitle className="font-semibold tracking-wide text-yellow-700 dark:text-foreground">
        Travel Plan Insights Underway!
      </AlertTitle>
      <AlertDescription>
        {loadingMessages[messageIndex]} This may take 1-3 minutes.
      </AlertDescription>
    </Alert>
  );
};

export default AlertForAI;
