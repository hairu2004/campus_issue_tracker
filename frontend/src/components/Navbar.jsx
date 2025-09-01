import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-700 tracking-wide">Campus Tracker</div>

      <div className="space-x-4 text-sm font-medium text-gray-700">
        {!user && (
          <>
            <Link
              to="/login"
              className="hover:text-blue-600 transition duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:text-blue-600 transition duration-200"
            >
              Sign Up
            </Link>
          </>
        )}

        {user?.role === "student" && (
          <>
            <Link
              to="/dashboard"
              className="hover:text-blue-600 transition duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/report-issue"
              className="hover:text-blue-600 transition duration-200"
            >
              Report Issue
            </Link>
            <Link
              to="/my-issues"
              className="hover:text-blue-600 transition duration-200"
            >
              My Issues
            </Link>
            <Link
              to="/profile"
              className="hover:text-blue-600 transition duration-200"
            >
              Profile
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link
              to="/admin"
              className="hover:text-blue-600 transition duration-200"
            >
              Admin Panel
            </Link>
            <Link
              to="/analytics"
              className="hover:text-blue-600 transition duration-200"
            >
              Analytics
            </Link>
          </>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 transition duration-200"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;