"use client";

import {
  AlertForAI,
  AboutThePlace,
  BestTimeToVisit,
  Itinerary,
  ImageSection,
  TopActivities,
  TopPlacesToVisit,
  LocalCuisineRecommendations,
  PackingChecklist,
  TripHighlights,
  WeatherAnalysis,
  BudgetRange,
} from "@/components/sections";

import { usePlanContext } from "../../contexts/PlanContextProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Send, Users, X, Printer } from "lucide-react";
import Weather from "@/components/sections/Weather";
import PlanMetaData from "@/components/sections/PlanMetaData";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";

type PlanProps = {
  planId: string;
  isNewPlan: boolean;
  isPublic: boolean;
};

const Plan = ({ planId }: PlanProps) => {
  const { isLoading, plan, shouldShowAlert } = usePlanContext();
  const [showAlert, setShowAlert] = useState(false);

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (window.localStorage) {
      localStorage.setItem("showPublishAlert", "false");
    }
  };

  useEffect(() => {
    if (window.localStorage) {
      const showPublishAlert =
        localStorage.getItem("showPublishAlert") ?? "true";
      setShowAlert(showPublishAlert === "false" ? false : true);
    }
  }, []);

  return (
    <section className="h-full flex flex-col gap-5">
      {showAlert && (
        <Alert className="relative">
          <Button
            className="absolute right-1 top-1"
            variant="link"
            onClick={handleCloseAlert}
          >
            <X className="size-4" />
          </Button>
          <Send className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">
            Share Your Travel Plans
          </AlertTitle>
          <AlertDescription className="text-xs">
            Help fellow travelers by sharing your travel plans! Your experiences
            could inspire and guide others on their journeys.
          </AlertDescription>
        </Alert>
      )}
      {plan?.isSharedPlan && (
        <Alert>
          <Users className="h-4 w-4" />
          <AlertTitle className="font-semibold">Shared Access!</AlertTitle>
          <AlertDescription>
            You are currently viewing a shared Travel Plan.
          </AlertDescription>
        </Alert>
      )}
      {plan?.contentGenerationState?.generationError && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle className="font-semibold">Generation Failed</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <p>Unable to generate your travel plan due to an unexpected error. The AI response could not be parsed.</p>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">Return to Trip Setup</Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}
      <AlertForAI show={shouldShowAlert} />
      <PlanMetaData
        allowEdit={true}
        companionId={plan?.companion}
        activityPreferencesIds={plan?.activityPreferences ?? []}
        fromDate={plan?.fromDate ?? undefined}
        toDate={plan?.toDate ?? undefined}
        planId={planId}
        isPublished={plan?.isPublished ?? false}
        isLoading={isLoading}
      />
      <ImageSection
        userPrompt={plan?.userPrompt}
        placeName={plan?.nameoftheplace}
        imageUrl={plan?.imageUrl}
        isLoading={isLoading || !plan?.contentGenerationState.imagination}
      />
      <AboutThePlace
        isLoading={isLoading || !plan?.contentGenerationState.abouttheplace}
        planId={planId}
        content={plan?.abouttheplace}
        allowEdit={true}
      />
      <TripHighlights
        content={plan?.tripHighlights}
        isLoading={isLoading || !plan?.contentGenerationState.tripHighlights}
      />
      <WeatherAnalysis
        data={plan?.weatherAnalysis}
        isLoading={isLoading || !plan?.contentGenerationState.weatherAnalysis}
      />
      <Weather placeName={plan?.nameoftheplace} />
      <TopActivities
        activities={plan?.adventuresactivitiestodo}
        planId={planId}
        isLoading={
          isLoading || !plan?.contentGenerationState.adventuresactivitiestodo
        }
        allowEdit={true}
      />
      <TopPlacesToVisit
        topPlacesToVisit={plan?.topplacestovisit}
        planId={planId}
        isLoading={isLoading || !plan?.contentGenerationState.topplacestovisit}
        allowEdit={true}
      />
      <Itinerary
        itinerary={plan?.itinerary}
        planId={planId}
        isLoading={isLoading || !plan?.contentGenerationState.itinerary}
        allowEdit={true}
      />
      <BudgetRange
        data={plan?.budgetRange}
        isLoading={isLoading || !plan?.contentGenerationState.budgetRange}
      />
      <LocalCuisineRecommendations
        recommendations={plan?.localcuisinerecommendations}
        isLoading={
          isLoading || !plan?.contentGenerationState.localcuisinerecommendations
        }
        planId={planId}
        allowEdit={true}
      />
      <PackingChecklist
        checklist={plan?.packingchecklist}
        isLoading={isLoading || !plan?.contentGenerationState.packingchecklist}
        planId={planId}
        allowEdit={true}
      />
      <BestTimeToVisit
        content={plan?.besttimetovisit}
        planId={planId}
        isLoading={isLoading || !plan?.contentGenerationState.besttimetovisit}
        allowEdit={true}
      />
      {!isLoading && (
        <Button
          className="fixed bottom-10 right-10 z-50 rounded-full w-14 h-14 shadow-lg print:hidden"
          onClick={() => window.print()}
          title="Export to PDF"
        >
          <Printer className="w-6 h-6" />
        </Button>
      )}
    </section>
  );
};

export default Plan;
