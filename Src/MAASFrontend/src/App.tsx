import { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "@/pages/LoginPage/LoginPage";
import RegisterPage from "@/pages/RegisterPage/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage/ResetPasswordPage";

type Page = "login" | "register" | "forgot-password" | "reset-password";

const getPageFromHash = (): Page => {
  switch (window.location.hash) {
    case "#login":
      return "login";
    case "#forgot-password":
      return "forgot-password";
    case "#reset-password":
      return "reset-password";
    default:
      return "register";
  }
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => getPageFromHash());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (page: Page) => {
    window.location.hash = page;
    setCurrentPage(page);
  };

  if (currentPage === "forgot-password") {
    return <ForgotPasswordPage onNavigateToLogin={() => navigateTo("login")} />;
  }

  if (currentPage === "reset-password") {
    return <ResetPasswordPage onNavigateToLogin={() => navigateTo("login")} />;
  }

  if (currentPage === "register") {
    return <RegisterPage onNavigateToLogin={() => navigateTo("login")} />;
  }

  return (
    <LoginPage
      onNavigateToRegister={() => navigateTo("register")}
      onNavigateToForgotPassword={() => navigateTo("forgot-password")}
    />
  );
}

export default App;
