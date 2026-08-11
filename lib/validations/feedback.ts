import * as z from "zod";

export const feedbackFormSchema = z.object({
  message: z.string().min(2),
  label: z.union([
    z.literal("issue"),
    z.literal("idea"),
    z.literal("question"),
    z.literal("complaint"),
    z.literal("featurerequest"),
    z.literal("other"),
  ]),
});

export type FeedbackFormSchemaType = z.infer<typeof feedbackFormSchema>;
