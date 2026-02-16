import z from "zod";

export const createNotificationSchema = z.object({
  userId: z.uuid(),
  title: z.string().nonempty(),
  message: z.string().optional(),
  redirectUrl: z.string().optional(),
});
