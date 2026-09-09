import { useState } from "react";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { EyeOutlined, Locked1Outlined } from "@lineiconshq/free-icons";
import Paper from "@/components/common/Paper/Paper";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import EyeSlashOutlined from "@/components/common/icons/EyeSlashOutlined";
import "./ResetPasswordPage.css";

export type ResetPasswordPageProps = {
  onNavigateToLogin?: () => void;
};

type FormData = { password: string; confirmPassword: string };
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ResetPasswordPage({ onNavigateToLogin }: ResetPasswordPageProps = {}) {
  const [formData, setFormData] = useState<FormData>({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: FormErrors = {};

    if (!formData.password) nextErrors.password = "New password is required";
    else if (formData.password.length < 8) nextErrors.password = "Password must be at least 8 characters";
    if (!formData.confirmPassword) nextErrors.confirmPassword = "Please confirm your new password";
    else if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = "Passwords do not match";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsLoading(true);
    try {
      // Replace with the reset-password API request, including the token from the email link.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (name: keyof FormData, value: string) => {
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined, ...(name === "password" && value === formData.confirmPassword ? { confirmPassword: undefined } : {}) }));
  };

  return (
    <main className="reset-password-page">
      <Paper variant="elevated" className="reset-password-card">
        <div className="reset-password-header">
          <h1>Set a new password</h1>
          <p>Choose a strong password to keep your account secure.</p>
        </div>
        <div className="reset-password-content">
          {isSubmitted ? (
            <div className="reset-password-alert reset-password-alert-success" role="status">
              <p>Your password has been reset successfully. You can now sign in.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="reset-password-form" noValidate>
              <Input label="New Password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={(event) => updateField("password", event.currentTarget.value)} error={errors.password} disabled={isLoading} autoComplete="new-password" icon={<Lineicons icon={Locked1Outlined} size={18} strokeWidth={1.8} className="reset-password-field-icon" />} rightElement={<PasswordToggle visible={showPassword} onClick={() => setShowPassword((visible) => !visible)} />} required />
              <Input label="Confirm New Password" type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={(event) => updateField("confirmPassword", event.currentTarget.value)} error={errors.confirmPassword} disabled={isLoading} autoComplete="new-password" icon={<Lineicons icon={Locked1Outlined} size={18} strokeWidth={1.8} className="reset-password-field-icon" />} rightElement={<PasswordToggle visible={showConfirmPassword} onClick={() => setShowConfirmPassword((visible) => !visible)} />} required />
              <p className="reset-password-hint">Use at least 8 characters.</p>
              <Button type="submit" variant="primary" fullWidth size="md" isLoading={isLoading}>{isLoading ? "Resetting password..." : "Reset password"}</Button>
            </form>
          )}
          <p className="reset-password-login-prompt">{isSubmitted ? "" : "Remembered your password? "}{onNavigateToLogin ? <button type="button" onClick={onNavigateToLogin} className="reset-password-login-link">Back to login</button> : <a href="#login">Back to login</a>}</p>
        </div>
      </Paper>
    </main>
  );
}

function PasswordToggle({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return <button type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={onClick} className="reset-password-toggle"><Lineicons icon={visible ? EyeSlashOutlined : EyeOutlined} size={18} strokeWidth={1.8} aria-hidden="true" /></button>;
}
