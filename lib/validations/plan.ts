import * as z from "zod";

export const planFormSchema = z.object({
  placeName: z
    .string({ required_error: "Please select a place" })
    .min(3, "Place name should be at least 3 character long"),
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
