import { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "@/pages/LoginPage/LoginPage";
import RegisterPage from "@/pages/RegisterPage/RegisterPage";

function App() {
  const [currentPage, setCurrentPage] = useState<"login" | "register">(() => {
    if (typeof window !== "undefined" && window.location.hash === "#login") {
      return "login";
    }
    return "register";
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#login") {
        setCurrentPage("login");
      } else if (hash === "#register") {
        setCurrentPage("register");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateToLogin = () => {
    window.location.hash = "login";
    setCurrentPage("login");
  };

  const navigateToRegister = () => {
    window.location.hash = "register";
    setCurrentPage("register");
  };

  return currentPage === "register" ? (
    <RegisterPage onNavigateToLogin={navigateToLogin} />
  ) : (
    <LoginPage onNavigateToRegister={navigateToRegister} />
  );
}

export default App;
