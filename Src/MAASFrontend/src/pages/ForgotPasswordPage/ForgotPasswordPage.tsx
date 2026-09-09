import { useState } from "react";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { Envelope1Outlined } from "@lineiconshq/free-icons";
import Paper from "@/components/common/Paper/Paper";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import "./ForgotPasswordPage.css";

export type ForgotPasswordPageProps = {
  onNavigateToLogin?: () => void;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage({
  onNavigateToLogin,
}: ForgotPasswordPageProps = {}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setError(undefined);
    setIsLoading(true);

    try {
      // Replace with the password-reset API request when it is available.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="forgot-password-page">
      <Paper variant="elevated" className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>Forgot password?</h1>
          <p>
            Enter your email address and we’ll send you a secure reset link.
          </p>
        </div>

        <div className="forgot-password-content">
          {isSubmitted ? (
            <div
              className="forgot-password-alert forgot-password-alert-success"
              role="status"
            >
              <p>
                If an account exists for <strong>{email}</strong>, a password
                reset link has been sent.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="forgot-password-form"
              noValidate
            >
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.currentTarget.value);
                  setError(undefined);
                }}
                error={error}
                disabled={isLoading}
                autoComplete="email"
                icon={
                  <Lineicons
                    icon={Envelope1Outlined}
                    size={18}
                    strokeWidth={1.8}
                    className="forgot-password-field-icon"
                  />
                }
                required
              />
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="md"
                isLoading={isLoading}
                className="login-submit-button"
              >
                {isLoading ? "Sending link..." : "Send reset link"}
              </Button>
            </form>
          )}

          <p className="forgot-password-login-prompt">
            Remembered your password?{" "}
            {onNavigateToLogin ? (
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="forgot-password-login-link"
              >
                Back to login
              </button>
            ) : (
              <a href="#login">Back to login</a>
            )}
          </p>
        </div>
      </Paper>
    </main>
  );
}
