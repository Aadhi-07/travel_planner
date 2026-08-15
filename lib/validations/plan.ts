import * as z from "zod";

export const planFormSchema = z.object({
  originPlace: z
    .string({ required_error: "Please enter your starting location." })
    .min(2, "Please enter your starting location."),
  placeName: z
    .string({ required_error: "Please enter your destination." })
    .min(2, "Please enter your destination."),
  datesOfTravel: z
    .object({
      from: z.date({ required_error: "Start date is required" }),
      to: z.date({ required_error: "End date is required" }),
    })
    .refine((data) => data.to >= data.from, {
      message: "End date cannot be before start date",
      path: ["to"], // Associates the error with the 'to' field
    }),
  activityPreferences: z.array(z.string()),
  companion: z.optional(z.string()),
  budgetTier: z.enum(["Budget", "Moderate", "Luxury"]).optional(),
});

export type PlanFormSchemaType = z.infer<typeof planFormSchema>;
