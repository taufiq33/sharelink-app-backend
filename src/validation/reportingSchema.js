import z from "zod";

export const reportingSchema = z.object({
  type: z.enum(["user", "link"]),
  linkTarget: z.uuid().optional(),
  userTarget: z.uuid(),
  reason: z.string(),
});
