import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RedirectAfterLogin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.role) {
      navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="text-center mt-10 text-slate-600 text-lg">
      {loading ? "Loading user info..." : "Redirecting..."}
    </div>
  );
};

export default RedirectAfterLogin;