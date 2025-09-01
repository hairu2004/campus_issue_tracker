import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const MyIssues = () => {
  const { token } = useAuth();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get("/issues", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIssues(res.data.issues);
      } catch (err) {
        toast.error("Failed to load issues");
        console.error(err);
      }
    };

    fetchIssues();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-zinc-100 to-slate-200 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-neutral-700 text-center">My Reported Issues</h2>

        {issues.length === 0 ? (
          <p className="text-slate-500 text-center text-lg">
            You haven’t submitted any issues yet.
          </p>
        ) : (
          <div className="space-y-6">
            {issues.map((issue) => (
              <div
                key={issue._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-slate-800">{issue.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{issue.description}</p>
                <div className="mt-2 flex justify-between text-sm">
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
                {issue.imageUrl && (
                  <img
                    src={`http://localhost:5000/uploads/${issue.imageUrl}`}
                    alt="Issue"
                    className="mt-4 w-48 rounded-lg shadow"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyIssues;