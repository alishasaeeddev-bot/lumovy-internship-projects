import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const GoogleLoginButton = () => {
  const googleButtonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google || !googleButtonRef.current) {
        return false;
      }

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: "outline",
          size: "large",
          width: 300,
          text: "continue_with",
        }
      );

      return true;
    };

    const handleCredentialResponse = async (response) => {
      try {
        const result = await api.post("/auth/google", {
          credential: response.credential,
        });

        localStorage.setItem("token", result.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(result.data.user)
        );

        navigate("/dashboard");
      } catch (error) {
        console.error(
          "Google login failed:",
          error.response?.data?.message || error.message
        );
      }
    };

    if (initializeGoogle()) {
      return;
    }

    const interval = setInterval(() => {
      if (initializeGoogle()) {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [navigate]);

  return <div ref={googleButtonRef}></div>;
};

export default GoogleLoginButton;