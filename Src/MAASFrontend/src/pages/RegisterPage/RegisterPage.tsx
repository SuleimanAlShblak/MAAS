import { useState, useRef, useEffect } from "react";
import Paper from "@/components/common/Paper/Paper";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import DatePicker from "@/components/common/DatePicker/DatePicker";
import { parseDate } from "@/components/common/DatePicker/date";
import SegmentedControl, {
  type SegmentedControlOption,
} from "@/components/common/SegmentedControl/SegmentedControl";
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  Envelope1Outlined,
  EyeOutlined,
  Locked1Outlined,
  Telephone1Outlined,
  User4Outlined,
  Buildings1Outlined,
} from "@lineiconshq/free-icons";
import EyeSlashOutlined from "@/components/common/icons/EyeSlashOutlined";
import "./RegisterPage.css";

export type UserRole = "private" | "practice";

type FormData = {
  firstName: string;
  surname: string;
  organizationName: string;
  role: UserRole;
  dateOfBirth: string;
  telephoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const roleOptions: SegmentedControlOption<UserRole>[] = [
  { value: "private", label: "Private" },
  { value: "practice", label: "Practice" },
];

export type RegisterPageProps = {
  onNavigateToLogin?: () => void;
};

export default function RegisterPage({ onNavigateToLogin }: RegisterPageProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    surname: "",
    organizationName: "",
    role: "private",
    dateOfBirth: "",
    telephoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,}$/;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.surname.trim()) {
      newErrors.surname = "Surname is required";
    }

    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const parsedDate = parseDate(formData.dateOfBirth.trim());
      const now = new Date();
      if (!parsedDate) {
        newErrors.dateOfBirth =
          "Please choose a valid date";
      } else if (parsedDate >= now) {
        newErrors.dateOfBirth = "Date of birth must be in the past";
      } else if (now.getFullYear() - parsedDate.getFullYear() > 125) {
        newErrors.dateOfBirth = "Please enter a realistic date of birth";
      }
    }

    if (!formData.telephoneNumber.trim()) {
      newErrors.telephoneNumber = "Telephone number is required";
    } else if (!phoneRegex.test(formData.telephoneNumber.trim())) {
      newErrors.telephoneNumber = "Please enter a valid telephone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Keep password match error synchronized when user edits either field
    if (name === "password" && formData.confirmPassword) {
      if (value === formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      }
    }
    if (name === "confirmPassword" && formData.password) {
      if (value === formData.password) {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      }
    }

    setSubmitError(null);
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
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
      // Simulate API registration request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitSuccess(true);
      setFormData({
        firstName: "",
        surname: "",
        organizationName: "",
        role: "private",
        dateOfBirth: "",
        telephoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = setTimeout(() => setSubmitSuccess(false), 3000);
    } catch {
      setSubmitError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="register-page">
      <Paper variant="elevated" className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Connect to SanoPath secure healthcare network.</p>
        </div>

        <div className="register-content">
          {submitSuccess && (
            <div className="register-alert register-alert-success">
              <p>Account created successfully! Welcome to SanoPath.</p>
            </div>
          )}

          {submitError && (
            <div className="register-alert register-alert-error">
              <p>{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form" noValidate>
            {/* First Name & Surname */}
            <div className="register-grid">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                disabled={isLoading}
                placeholder="Sarah"
                autoComplete="given-name"
                icon={
                  <Lineicons
                    icon={User4Outlined}
                    size={18}
                    strokeWidth={1.8}
                    className="register-field-icon"
                  />
                }
                required
              />

              <Input
                label="Surname"
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                error={errors.surname}
                disabled={isLoading}
                placeholder="Jones"
                autoComplete="family-name"
                icon={
                  <Lineicons
                    icon={User4Outlined}
                    size={18}
                    strokeWidth={1.8}
                    className="register-field-icon"
                  />
                }
                required
              />
            </div>
            <Input
              label="Organization Name (Optional)"
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleInputChange}
              error={errors.organizationName}
              disabled={isLoading}
              autoComplete="organization"
              icon={
                <Lineicons
                  icon={Buildings1Outlined}
                  size={18}
                  strokeWidth={1.8}
                  className="register-field-icon"
                />
              }
              placeholder="Organization Name"
            />
            {/* User Role */}
            <SegmentedControl<UserRole>
              label="User Role"
              options={roleOptions}
              value={formData.role}
              onChange={handleRoleChange}
              disabled={isLoading}
            />

            {/* Date of Birth & Telephone Number */}
            <div className="register-grid">
              <DatePicker
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, dateOfBirth: value }));
                  setErrors((prev) => ({ ...prev, dateOfBirth: undefined }));
                  setSubmitError(null);
                }}
                error={errors.dateOfBirth}
                disabled={isLoading}
                required
              />

              <Input
                label="Telephone Number"
                type="tel"
                name="telephoneNumber"
                value={formData.telephoneNumber}
                onChange={handleInputChange}
                error={errors.telephoneNumber}
                disabled={isLoading}
                placeholder="+1 (555) 000-0000"
                autoComplete="tel"
                icon={
                  <Lineicons
                    icon={Telephone1Outlined}
                    size={18}
                    strokeWidth={1.8}
                    className="register-field-icon"
                  />
                }
                required
              />
            </div>

            {/* Email Address */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              disabled={isLoading}
              placeholder="name@domain.com"
              autoComplete="email"
              icon={
                <Lineicons
                  icon={Envelope1Outlined}
                  size={18}
                  strokeWidth={1.8}
                  className="register-field-icon"
                />
              }
              required
            />

            {/* Create Password */}
            <Input
              label="Create Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              disabled={isLoading}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              icon={
                <Lineicons
                  icon={Locked1Outlined}
                  size={18}
                  strokeWidth={1.8}
                  className="register-field-icon"
                />
              }
              rightElement={
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="register-password-toggle"
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

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              disabled={isLoading}
              placeholder="Confirm your password"
              autoComplete="new-password"
              icon={
                <Lineicons
                  icon={Locked1Outlined}
                  size={18}
                  strokeWidth={1.8}
                  className="register-field-icon"
                />
              }
              rightElement={
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  className="register-password-toggle"
                >
                  <Lineicons
                    icon={showConfirmPassword ? EyeSlashOutlined : EyeOutlined}
                    size={18}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>
              }
              required
            />

            {/* Register Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="md"
              isLoading={isLoading}
              disabled={isLoading}
              className="register-submit-button"
            >
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </form>

          <p className="register-login-prompt">
            Already have an account?{" "}
            {onNavigateToLogin ? (
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="register-login-link"
              >
                Login
              </button>
            ) : (
              <a href="#login" className="register-login-link">
                Login
              </a>
            )}
          </p>
        </div>
      </Paper>
    </main>
  );
}
