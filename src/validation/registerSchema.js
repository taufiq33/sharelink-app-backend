import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(4, "username must be 4 character minimum")
      .max(15, "username must be 15 character maximum"),
    email: z.email(),
    password: z.string().min(8, "password must be 8 character minimum"),
    confirmationPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmationPassword, {
    message: "confirmationPassword does not match!",
    path: ["confirmationPassword"],
  }); // custom validation
