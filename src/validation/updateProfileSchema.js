import { z } from "zod";

export const updateProfileSchema = z.object({
  email: z.email(),
  username: z
    .string()
    .min(4, "username must be 4 character minimum")
    .max(15, "username must be 15 character maximum"),
  shortBio: z.string().optional(),
});
