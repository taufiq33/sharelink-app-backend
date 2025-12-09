import z from "zod";

const changePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z.string().min(8, "new password must be 8 character minimum"),
    confirmationNewPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.confirmationNewPassword === data.newPassword;
    },
    {
      message: "confirmationNewPassword does not match!",
      path: ["confirmationNewPassword"],
    },
  );

export default changePasswordSchema;
