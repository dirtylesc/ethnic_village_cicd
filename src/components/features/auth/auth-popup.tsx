'use client';

import { useAuthStore } from '@/stores/useAuthStore';

import { ForgotPasswordPopup } from './forgot-password-popup';
import { LoginPopup } from './login/login-popup';
import { EnterOtpPopup } from './otp/enter-otp-popup';
import { SignupPopup } from './signup/signup-popup';

export function AuthPopup() {
  const { loginOpen, signupOpen, forgotPasswordOpen, enterOtpOpen } = useAuthStore();

  return (
    <>
      {loginOpen && <LoginPopup />}
      {signupOpen && <SignupPopup />}
      {forgotPasswordOpen && <ForgotPasswordPopup />}
      {enterOtpOpen && <EnterOtpPopup />}
    </>
  );
}
