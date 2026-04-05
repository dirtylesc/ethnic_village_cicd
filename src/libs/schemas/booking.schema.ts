'use client';

import * as z from 'zod';

export const contactInfoSchema = z.object({
  name: z.string().min(1, 'name_required'),
  email: z.string().min(1, 'email_required').email('email_invalid'),
  phone: z
    .string()
    .min(1, 'phone_required')
    .regex(/^[0-9]{10}$/, 'phone_invalid'),
});

export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;

export function validateEmail(email: string): { isValid: boolean; error: string | null } {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'email_required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'email_invalid' };
  }
  return { isValid: true, error: null };
}

export function validatePhone(phone: string): { isValid: boolean; error: string | null } {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'phone_required' };
  }
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'phone_invalid' };
  }
  return { isValid: true, error: null };
}

export function validateContactInfo(data: { name: string; email: string; phone: string }): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'name_required';
  }

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid && emailValidation.error) {
    errors.email = emailValidation.error;
  }

  const phoneValidation = validatePhone(data.phone);
  if (!phoneValidation.isValid && phoneValidation.error) {
    errors.phone = phoneValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
