import z from "zod";

export const trackSchema = z
  .object({
    deviceId: z.uuid().nonempty(),
    linkId: z.uuid().nonempty(),
  })
  .strict();
