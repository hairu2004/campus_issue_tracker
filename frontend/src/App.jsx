import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Unauthorized from "./pages/Unauthorized";
import RedirectAfterLogin from "./pages/RedirectAfterLogin";
import ReportIssue from "./pages/ReportIssue";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import MyIssues from "./pages/MyIssues";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import StudentProfile from "./pages/StudentProfile";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home"; // ✅ New landing page

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> {/* ✅ Redirect to /home */}
        <Route path="/home" element={<Home />} /> {/* ✅ Landing page */}

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/redirect" element={<RedirectAfterLogin />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student", "admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-issue"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ReportIssue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-issues"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyIssues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;