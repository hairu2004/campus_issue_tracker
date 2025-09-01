import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import MapView from "../components/MapView";

const Dashboard = () => {
  const { token, user } = useAuth();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        const res = await axios.get("/issues?page=1&limit=100", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIssues(res.data.issues);
      } catch (err) {
        console.error("Failed to load issues", err);
      }
    };

    fetchMyIssues();
  }, [token]);

  const total = issues.length;
  const pending = issues.filter((i) => i.status === "pending").length;
  const resolved = issues.filter((i) => i.status === "resolved").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-zinc-100 to-slate-200 px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-neutral-700 text-center">
          Welcome, {user?.name}
        </h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 text-center">
            <p className="text-lg font-semibold text-slate-600">Total Issues</p>
            <p className="text-4xl font-bold text-yellow-600 mt-2">{total}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 text-center">
            <p className="text-lg font-semibold text-slate-600">Pending</p>
            <p className="text-4xl font-bold text-amber-500 mt-2">{pending}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 text-center">
            <p className="text-lg font-semibold text-slate-600">Resolved</p>
            <p className="text-4xl font-bold text-lime-600 mt-2">{resolved}</p>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/report-issue"
            className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white px-6 py-2 rounded-full shadow transition duration-200"
          >
            Report New Issue
          </Link>
          <Link
            to="/my-issues"
            className="bg-gradient-to-r from-neutral-600 to-slate-700 hover:from-neutral-700 hover:to-slate-800 text-white px-6 py-2 rounded-full shadow transition duration-200"
          >
            View My Issues
          </Link>
          <Link
            to="/profile"
            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white px-6 py-2 rounded-full shadow transition duration-200"
          >
            My Profile
          </Link>
        </div>

        {/* Recent Issues */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4 text-center">
            Recent Issues
          </h2>
          {issues.length === 0 ? (
            <p className="text-slate-500 text-center">
              You haven’t submitted any issues yet.
            </p>
          ) : (
            <ul className="space-y-6">
              {issues.slice(0, 5).map((issue) => (
                <li
                  key={issue._id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <p className="text-xl font-semibold text-slate-800">{issue.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{issue.description}</p>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-violet-500">Category: {issue.category}</span>
                    <span
                      className={`font-medium ${
                        issue.status === "resolved"
                          ? "text-lime-600"
                          : "text-amber-500"
                      }`}
                    >
                      Status: {issue.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Campus Map */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4 text-center">
            Campus Map
          </h2>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <MapView issues={issues} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;