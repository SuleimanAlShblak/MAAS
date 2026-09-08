import { useState, useRef, useEffect } from "react";
import Paper from "@/components/common/Paper/Paper";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  Envelope1Outlined,
  EyeOutlined,
  Locked1Outlined,
} from "@lineiconshq/free-icons";
import EyeSlashOutlined from "@/components/common/icons/EyeSlashOutlined";
import "./LoginPage.css";

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type FormErrors = {
  email?: string;
  password?: string;
};

export type LoginPageProps = {
  onNavigateToRegister?: () => void;
};

export default function LoginPage({ onNavigateToRegister }: LoginPageProps = {}) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.currentTarget;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success
      setSubmitSuccess(true);
      setFormData({ email: "", password: "", rememberMe: false });

      // Reset success message after 3 seconds with safe cleanup
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = setTimeout(() => setSubmitSuccess(false), 3000);
    } catch {
      setSubmitError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <Paper variant="elevated" className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to manage your medical files safely.</p>
        </div>

        <div className="login-content">
          {/* Success Message */}
          {submitSuccess && (
            <div className="login-alert login-alert-success">
              <p>Login successful! Redirecting...</p>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="login-alert login-alert-error">
              <p>{submitError}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              disabled={isLoading}
              autoComplete="email"
              icon={
                <Lineicons
                  icon={Envelope1Outlined}
                  size={18}
                  strokeWidth={1.8}
                  className="login-field-icon"
                />
              }
              required
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              disabled={isLoading}
              autoComplete="current-password"
              icon={
                <Lineicons
                  icon={Locked1Outlined}
                  size={18}
                  strokeWidth={1.8}
                  className="login-field-icon"
                />
              }
              rightElement={
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="login-password-toggle"
                >
                  <Lineicons
                    icon={showPassword ? EyeSlashOutlined : EyeOutlined}
                    size={18}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>
              }
              required
            />

            <div className="login-forgot-password">
              <a href="#">Forgot password?</a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="md"
              isLoading={isLoading}
              disabled={isLoading}
              className="login-submit-button"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="login-register-prompt">
            Don't have an account?{" "}
            {onNavigateToRegister ? (
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="login-register-link"
              >
                Register
              </button>
            ) : (
              <a href="#register" className="login-register-link">
                Register
              </a>
            )}
          </p>
        </div>
      </Paper>
    </main>
  );
}
