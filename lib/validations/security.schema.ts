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
  device_name: z.string().min(1, "Device name is required").optional(),
});

export type PasskeyRegisterInput = z.infer<typeof passkeyRegisterSchema>;

export const passkeyAuthenticateSchema = z.object({
  credential: z.any(),
});

export type PasskeyAuthenticateInput = z.infer<typeof passkeyAuthenticateSchema>;

export const recoveryCodeSchema = z.object({
  code: z.string().min(8, "Recovery code must be at least 8 characters"),
});

export type RecoveryCodeInput = z.infer<typeof recoveryCodeSchema>;
