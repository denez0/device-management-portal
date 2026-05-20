import { z } from "zod";

export const createDeviceSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  model: z.string().trim().min(1, "model is required"),
  userId: z.string().trim().min(1, "userId is required"),
  status: z.string().optional(),
});

export type CreateDeviceInput = z.infer<typeof createDeviceSchema>;

export const requestTypeSchema = z.enum(["order", "repair", "support"]);

export type RequestType = z.infer<typeof requestTypeSchema>;

export const createSupportRequestSchema = z.object({
  deviceId: z.coerce.number().int().positive("deviceId must be a positive integer"),
  requestType: requestTypeSchema,
  description: z.string().trim().min(1, "description is required"),
  status: z.string().optional(),
});

export type CreateSupportRequestInput = z.infer<typeof createSupportRequestSchema>;

export function zodValidationDetails(error: z.ZodError) {
  const flattened = error.flatten();
  return {
    issues: error.issues,
    formErrors: flattened.formErrors,
    fieldErrors: flattened.fieldErrors,
  };
}
