import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../Services/authService";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

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
        await authService.login({ email, password });

        const returnTo = location.state?.returnTo || "/";
        navigate(returnTo, { replace: true });
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

  return { executeAuth, isLoading, error, signupSuccess, setSignupSuccess };
};
