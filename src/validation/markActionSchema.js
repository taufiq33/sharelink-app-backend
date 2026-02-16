import z from "zod";

export const markActionSchema = z.object({
  type: z.enum(["user", "link"]),
  actionId: z.uuid(),
});
