import z from "zod";

export const markSchema = z.object({
  mark: z.enum(["waiting", "done", "rejected"]),
});
