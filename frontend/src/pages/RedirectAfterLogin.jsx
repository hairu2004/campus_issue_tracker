import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RedirectAfterLogin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role) {
      navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="text-center mt-10 text-slate-600 text-lg">
      Redirecting based on your role...
    </div>
  );
};

export default RedirectAfterLogin;