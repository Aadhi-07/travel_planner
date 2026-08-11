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
import { Loader2, MessageSquarePlus, Wand2 } from "lucide-react";
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

  const [selectedFromList, setSelectedFromList] = useState(false);

  const { toast } = useToast();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activityPreferences: [],
      companion: undefined,
      placeName: "",
      datesOfTravel: {
        from: undefined as unknown as Date,
        to: undefined as unknown as Date,
      },
    },
  });

  const isPlaceValid = () => {
    if (!selectedFromList) {
      form.setError("placeName", {
        message: "Place should be selected from the list",
        type: "custom",
      });
      return false;
    }
    return true;
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
    if (!isPlaceValid()) return;
    executeEmptyPlan(values);
  }

  async function onSubmitAIPlan(values: z.infer<typeof formSchema>) {
    if (!isPlaceValid()) return;
    executeAIPlan(values);
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmitAIPlan)}>
        <FormField
          control={form.control}
          name="placeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search for your destination city</FormLabel>
              <FormControl>
                <PlacesAutoComplete
                  field={field}
                  form={form}
                  selectedFromList={selectedFromList}
                  setSelectedFromList={setSelectedFromList}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="activityPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Select the kind of activities you want to do
                <span className="font-medium ml-1">(Optional)</span>
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
        <FormField
          control={form.control}
          name="companion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Who are you travelling with
                <span className="font-medium ml-1">(Optional)</span>
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
        <FormField
          control={form.control}
          name="budgetTier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Budget Tier
                <span className="font-medium ml-1">(Optional)</span>
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
        <div className="w-full flex justify-between gap-1">
          <Button
            onClick={() => form.handleSubmit(onSubmitEmptyPlan)()}
            aria-label="generate plan"
            aria-busy={pendingEmptyPlan}
            type="button"
            disabled={
              pendingEmptyPlan || pendingAIPlan || !form.formState.isValid
            }
            className={`bg-blue-500 text-white hover:bg-blue-600 w-full ${pendingAIPlan ? 'opacity-50' : ''}`}
          >
            {pendingEmptyPlan ? (
              <div className="flex gap-1 justify-center items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </div>
            ) : (
              <div className="flex gap-1 justify-center items-center">
                <MessageSquarePlus className="h-4 w-4" />
                <span>Create Your Plan</span>
              </div>
            )}
          </Button>

          <Button
            aria-label="generate AI plan"
            aria-busy={pendingAIPlan}
            type="submit"
            disabled={
              pendingAIPlan || pendingEmptyPlan || !form.formState.isValid
            }
            className={`bg-indigo-500 text-white hover:bg-indigo-600 w-full group ${pendingEmptyPlan ? 'opacity-50' : ''}`}
          >
            {pendingAIPlan ? (
              <div className="flex gap-1 justify-center items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Generating AI Plan...</span>
              </div>
            ) : (
              <div className="flex gap-1 justify-center items-center ">
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
