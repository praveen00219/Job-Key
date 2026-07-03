import { z } from "zod";

import { passwordRules } from "./password";

const emailField = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

/** Password must satisfy every rule in the strength checklist. */
const strongPassword = z.string().superRefine((val, ctx) => {
  for (const rule of passwordRules) {
    if (!rule.test(val)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Password does not meet requirements" });
      return;
    }
  }
});

export const signupSchema = z.object({
  email: emailField,
  password: strongPassword,
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms & Conditions" }),
  }),
});
export type SignupValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: emailField,
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
