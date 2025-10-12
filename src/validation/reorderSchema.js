import z from "zod";

export const reorderSchema = z.object({
  links: z
    .array(z.uuid())
    .min(1)
    .refine((links) => new Set(links).size === links.length, {
      message: "possible duplicate link",
    }),
});
