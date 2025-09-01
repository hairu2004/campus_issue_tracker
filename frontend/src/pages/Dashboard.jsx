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
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        Welcome, {user?.name}
      </h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">Total Issues</p>
          <p className="text-2xl text-blue-600">{total}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">Pending</p>
          <p className="text-2xl text-yellow-600">{pending}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">Resolved</p>
          <p className="text-2xl text-green-600">{resolved}</p>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="flex gap-4 mb-6">
        <Link to="/report-issue" className="bg-blue-600 text-white px-4 py-2 rounded shadow">
          Report New Issue
        </Link>
        <Link to="/my-issues" className="bg-gray-700 text-white px-4 py-2 rounded shadow">
          View My Issues
        </Link>
        <Link to="/profile" className="bg-green-600 text-white px-4 py-2 rounded shadow">
          My Profile
        </Link>
      </div>

      {/* Recent Issues */}
      <h2 className="text-xl font-semibold mb-2">Recent Issues</h2>
      {issues.length === 0 ? (
        <p className="text-gray-600">You haven’t submitted any issues yet.</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {issues.slice(0, 5).map((issue) => (
            <li key={issue._id} className="border p-3 rounded shadow">
              <p className="font-semibold">{issue.title}</p>
              <p className="text-sm text-gray-700">{issue.description}</p>
              <p className="text-sm text-blue-600">Category: {issue.category}</p>
              <p className="text-sm text-green-600">Status: {issue.status}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Campus Map */}
      <MapView issues={issues} />
    </div>
  );
};

export default Dashboard;