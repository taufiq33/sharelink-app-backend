import z from "zod";

export const linkSchema = z.object({
  label: z.string().trim().nonempty(),
  link: z.url(),
});
