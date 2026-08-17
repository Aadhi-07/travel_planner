"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@clerk/nextjs";
import { Dispatch, SetStateAction, useState } from "react";
import * as z from "zod";

import { useServerAction } from "@/hooks/useServerAction";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, MessageSquarePlus, Wand2, MapPin, ArrowDown, ArrowUpDown } from "lucide-react";
import { generatePlanAction } from "@/lib/actions/generateplanAction";
import PlacesAutoComplete from "@/components/PlacesAutoComplete";

import { generateEmptyPlanAction } from "@/lib/actions/generateEmptyPlanAction";
import { useToast } from "@/components/ui/use-toast";
import CompanionControl from "@/components/plan/CompanionControl";
import ActivityPreferences from "@/components/plan/ActivityPreferences";
import DateRangeSelector from "@/components/common/DateRangeSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { planFormSchema as formSchema, PlanFormSchemaType as formSchemaType } from "@/lib/validations/plan";
export type { formSchemaType };

const NewPlanForm = ({
  closeModal,
}: {
  closeModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return null;

  const { toast } = useToast();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originPlace: "",
      placeName: "",
      activityPreferences: [],
      companion: undefined,
      datesOfTravel: {
        from: undefined as unknown as Date,
        to: undefined as unknown as Date,
      },
    },
  });

  const originVal = form.watch("originPlace");
  const destVal = form.watch("placeName");

  const handleSwapLocations = () => {
    const currentOrigin = form.getValues("originPlace");
    const currentDest = form.getValues("placeName");
    form.setValue("originPlace", currentDest || "", { shouldValidate: true });
    form.setValue("placeName", currentOrigin || "", { shouldValidate: true });
  };


  const validateLocations = () => {
    let isValid = true;
    if (!form.getValues("originPlace")?.trim()) {
      form.setError("originPlace", {
        message: "Please enter your starting location.",
        type: "custom",
      });
      isValid = false;
    }
    if (!form.getValues("placeName")?.trim()) {
      form.setError("placeName", {
        message: "Please enter your destination.",
        type: "custom",
      });
      isValid = false;
    }
    return isValid;
  };

  const handleActionSuccess = (planId: string | null, type: "empty" | "ai") => {
    if (planId === null) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `We couldn't generate your ${type === "ai" ? "AI " : ""}plan. Please try again.`,
      });
      return;
    }
    form.reset();
    closeModal(false);
    toast({
      title: "Success!",
      description: `Your ${type === "ai" ? "AI " : ""}trip plan is ready.`,
    });
  };

  const { execute: executeEmptyPlan, isPending: pendingEmptyPlan } = useServerAction(generateEmptyPlanAction, {
    onSuccess: (planId) => handleActionSuccess(planId, "empty"),
  });

  const { execute: executeAIPlan, isPending: pendingAIPlan } = useServerAction(generatePlanAction, {
    onSuccess: (planId) => handleActionSuccess(planId, "ai"),
  });

  async function onSubmitEmptyPlan(values: z.infer<typeof formSchema>) {
    if (!validateLocations()) return;
    executeEmptyPlan(values);
  }

  async function onSubmitAIPlan(values: z.infer<typeof formSchema>) {
    if (!validateLocations()) return;
    executeAIPlan(values);
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmitAIPlan)}>
        {/* Route Direction Visual Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-3">
          {/* FROM FIELD */}
          <FormField
            control={form.control}
            name="originPlace"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  From (Starting Location)
                </FormLabel>
                <FormControl>
                  <PlacesAutoComplete
                    field={field}
                    form={form}
                    fieldName="originPlace"
                    placeholder="Where are you travelling from? (e.g. Chennai)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Visual Route Separator with Swap Button */}
          <div className="flex items-center justify-between text-xs text-slate-400 gap-2 py-1">
            <div className="h-px bg-slate-800 flex-1"></div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-sans text-[11px] bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-full text-amber-300">
                <span className="max-w-[100px] truncate">{originVal || "From"}</span>
                <ArrowDown className="w-3 h-3 text-orange-400 shrink-0" />
                <span className="max-w-[100px] truncate">{destVal || "To"}</span>
              </span>
              <button
                type="button"
                onClick={handleSwapLocations}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-orange-400 hover:text-amber-300 transition-colors border border-slate-700/80 shadow-sm group"
                title="Swap starting location & destination"
              >
                <ArrowUpDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-300" />
              </button>
            </div>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>


          {/* TO FIELD */}
          <FormField
            control={form.control}
            name="placeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-[#c86d51]" />
                  To (Destination)
                </FormLabel>
                <FormControl>
                  <PlacesAutoComplete
                    field={field}
                    form={form}
                    fieldName="placeName"
                    placeholder="Where do you want to go? (e.g. Ooty)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* DATES OF TRAVEL */}
        <FormField
          control={form.control}
          name="datesOfTravel"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select Dates</FormLabel>
              <DateRangeSelector
                value={field.value}
                onChange={field.onChange}
                forGeneratePlan={true}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ACTIVITY PREFERENCES */}
        <FormField
          control={form.control}
          name="activityPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Select the kind of activities you want to do
                <span className="font-medium ml-1 text-muted-foreground text-xs">(Optional)</span>
              </FormLabel>
              <FormControl>
                <ActivityPreferences
                  values={field.value}
                  onChange={(e) => field.onChange(e)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* COMPANION */}
        <FormField
          control={form.control}
          name="companion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Who are you travelling with
                <span className="font-medium ml-1 text-muted-foreground text-xs">(Optional)</span>
              </FormLabel>
              <FormControl>
                <CompanionControl
                  value={field.value}
                  onChange={(id: string) => field.onChange(id)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* BUDGET TIER */}
        <FormField
          control={form.control}
          name="budgetTier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Budget Tier
                <span className="font-medium ml-1 text-muted-foreground text-xs">(Optional)</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a budget tier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Budget">Budget</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SUBMIT BUTTONS */}
        <div className="w-full flex justify-between gap-2 pt-2">
          <Button
            onClick={() => form.handleSubmit(onSubmitEmptyPlan)()}
            aria-label="generate plan"
            aria-busy={pendingEmptyPlan}
            type="button"
            disabled={
              pendingEmptyPlan || pendingAIPlan
            }
            className={`bg-[#c86d51] text-white hover:bg-[#b55c41] w-full ${pendingAIPlan ? 'opacity-50' : ''}`}
          >
            {pendingEmptyPlan ? (
              <div className="flex gap-1 justify-center items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </div>
            ) : (
              <div className="flex gap-1 justify-center items-center">
                <MessageSquarePlus className="h-4 w-4" />
                <span>Create Custom Plan</span>
              </div>
            )}
          </Button>

          <Button
            aria-label="generate AI plan"
            aria-busy={pendingAIPlan}
            type="submit"
            disabled={
              pendingAIPlan || pendingEmptyPlan
            }
            className={`bg-[#b55c41] text-white hover:bg-[#a34f37] w-full group ${pendingEmptyPlan ? 'opacity-50' : ''}`}
          >
            {pendingAIPlan ? (
              <div className="flex gap-1 justify-center items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Generating AI Plan...</span>
              </div>
            ) : (
              <div className="flex gap-1 justify-center items-center">
                <Wand2 className="h-4 w-4 group-hover:animate-pulse" />
                <span>Generate AI Plan</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewPlanForm;
