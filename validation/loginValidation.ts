import { z } from "zod";

export const loginSchema = z
  .object({
    identifier: z.string(),
    password: z
      .string()
      .min(6, { message: "Password should be greater than 5 characters" })
      .max(20, { message: "Password should be less than 21 characters" }),
  })
  .refine(
    (data) => {
      const emailRegex =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
      if (data.identifier.includes("@")) {
        return emailRegex.test(data.identifier);
      } else {
        return data.identifier.length > 2;
      }
    },
    {
      message: "Enter a valid username or email",
      path: ["identifier"],
    },
  );

export type LoginFormData = z.infer<typeof loginSchema>;
