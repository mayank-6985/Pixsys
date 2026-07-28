import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../Services/authService";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [isOtpStep, setIsOtpStep] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const executeAuth = async (
    email,
    password,
    isSignup = false,
    phoneNumber = "",
  ) => {
    setIsLoading(true);
    setError(null);
    setSignupSuccess(false);

    try {
      if (isSignup) {
        await authService.signUp({
          email: email,
          password: password,
          phone_number: phoneNumber,
        });
        setSignupSuccess(true);
      } else {
        await authService.loginInitiate({ email, password });
        setEmailForOtp(email);
        setIsOtpStep(true);
      }
    } catch (err) {
      console.error("Authentication failed:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otpCode) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.loginVerify({
        email: emailForOtp,
        otp_code: otpCode,
      });
      const returnTo = location.state?.returnTo || "/";
      navigate(returnTo, { replace: true });
    } catch (err) {
      console.error("OTP Verification failed:", err);
      setError(
        err.response?.data?.message || "Invalid OTP code. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resendOtp(emailForOtp);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeAuth,
    verifyOtp,
    handleResendOtp,
    isLoading,
    error,
    setError,
    signupSuccess,
    setSignupSuccess,
    isOtpStep,
    setIsOtpStep,
  };
};
