import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export type OtpFormValues = z.infer<typeof otpSchema>;
