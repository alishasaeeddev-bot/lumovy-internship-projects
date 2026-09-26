import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api";
import { useAuth } from "../context/AuthContext";

import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const googleButtonRef = useRef(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        {
          email: email.trim(),
          password
        },
        {
          timeout: 10000
        }
      );

      if (!response.data?.token || !response.data?.user) {
        throw new Error("Invalid login response from server.");
      }

      login(
        response.data.token,
        response.data.user
      );

      navigate("/dashboard", {
        replace: true
      });
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        setError(
          "The server is taking too long to respond. Please try again."
        );
      } else if (error.response) {
        setError(
          error.response.data?.message ||
            "Invalid email or password."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(
          error.message ||
            "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGoogleLogin = async (response) => {
      try {
        setError("");

        const result = await api.post(
          "/auth/google",
          {
            credential: response.credential
          },
          {
            timeout: 10000
          }
        );

        if (!result.data?.token || !result.data?.user) {
          throw new Error(
            "Invalid Google login response from server."
          );
        }

        login(
          result.data.token,
          result.data.user
        );

        navigate("/dashboard", {
          replace: true
        });
      } catch (error) {
        if (error.code === "ECONNABORTED") {
          setError(
            "The server is taking too long to respond. Please try again."
          );
        } else if (error.response) {
          setError(
            error.response.data?.message ||
              "Google login failed. Please try again."
          );
        } else if (error.request) {
          setError(
            "Unable to connect to the server. Please make sure the backend is running."
          );
        } else {
          setError(
            error.message ||
              "Google login failed. Please try again."
          );
        }
      }
    };

    const initializeGoogle = () => {
      if (
        !window.google ||
        !googleButtonRef.current
      ) {
        return false;
      }

      window.google.accounts.id.initialize({
        client_id:
          import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin
      });

      googleButtonRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "continue_with"
        }
      );

      return true;
    };

    if (initializeGoogle()) {
      return;
    }

    const interval = setInterval(() => {
      if (initializeGoogle()) {
        clearInterval(interval);
      }
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, [login, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Login</h1>

        <p>
          Sign in to manage your tasks.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            autoComplete="email"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div
          ref={googleButtonRef}
          className="google-login-button"
        ></div>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;