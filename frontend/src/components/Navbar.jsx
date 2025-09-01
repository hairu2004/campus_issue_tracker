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
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="font-bold text-lg">Campus Tracker</div>
      <div className="space-x-4">
        {!user && (
          <>
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link to="/signup" className="hover:underline">SignUp</Link>
          </>
        )}

        {user?.role === "student" && (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/report-issue" className="hover:underline">
              Report Issue
            </Link>
            <Link to="/my-issues" className="hover:underline">
              My Issues
            </Link>
            <Link to="/profile" className="hover:underline">Profile</Link> {/* ✅ Add this */}
            

          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin" className="hover:underline">
              Admin Panel
            </Link>
            <Link to="/analytics" className="hover:underline">
              Analytics
            </Link>
          </>
        )}

        {user && (
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;