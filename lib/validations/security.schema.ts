import { z } from "zod";

export const totpSetupSchema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters"),
});

export type TOTPSetupInput = z.infer<typeof totpSetupSchema>;

export const totpVerifySchema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters"),
});

export type TOTPVerifyInput = z.infer<typeof totpVerifySchema>;

export const passkeyRegisterSchema = z.object({
  credential: z.any(),
});

export type PasskeyRegisterInput = z.infer<typeof passkeyRegisterSchema>;

export const passkeyAuthenticateSchema = z.object({
  credential: z.any(),
});

export type PasskeyAuthenticateInput = z.infer<typeof passkeyAuthenticateSchema>;
