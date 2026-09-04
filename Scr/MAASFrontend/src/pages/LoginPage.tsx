import { useState } from "react";
import Paper from "@/components/common/Paper/Paper";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import Checkbox from "@/components/common/Checkbox/Checkbox";
import SocialLoginButton from "@/components/common/SocialLoginButton/SocialLoginButton";

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type FormErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setSubmitError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    // Simulate social login
    console.log(`Logging in with ${provider}`);
    // Add your social login logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">MAAS</h1>
          <p className="text-neutral-600">
            Modern Accounting and Analytics System
          </p>
        </div>

        {/* Login Card */}
        <Paper variant="filled" className="p-8 mb-6">
          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-semantic-success/10 border border-semantic-success rounded-lg">
              <p className="text-sm font-medium text-semantic-success">
                Login successful! Redirecting...
              </p>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-semantic-error/10 border border-semantic-error rounded-lg">
              <p className="text-sm font-medium text-semantic-error">
                {submitError}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              disabled={isLoading}
              required
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              disabled={isLoading}
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <Checkbox
                name="rememberMe"
                label="Remember me"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <a
                href="#"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-neutral-300" />
            <span className="text-sm text-neutral-600 font-medium">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-neutral-300" />
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <SocialLoginButton
              provider="google"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
            />
            <SocialLoginButton
              provider="github"
              onClick={() => handleSocialLogin("github")}
              disabled={isLoading}
            />
            <SocialLoginButton
              provider="microsoft"
              onClick={() => handleSocialLogin("microsoft")}
              disabled={isLoading}
            />
          </div>
        </Paper>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-neutral-600 text-sm">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Sign up
            </a>
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-xs text-neutral-500">
          <a href="#" className="hover:text-neutral-700 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-neutral-700 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-neutral-700 transition-colors">
            Support
          </a>
        </div>
      </div>
    </div>
  );
}
