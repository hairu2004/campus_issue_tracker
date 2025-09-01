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
        setIssues(res.data.issues); // ✅ Fix applied here
      } catch (err) {
        toast.error("Failed to load issues");
        console.error(err);
      }
    };

    fetchIssues();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">My Reported Issues</h2>
      {issues.length === 0 ? (
        <p className="text-gray-600">No issues submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{issue.title}</h3>
              <p className="text-sm text-gray-700">{issue.description}</p>
              <p className="text-sm text-blue-600">Category: {issue.category}</p>
              <p className="text-sm text-green-600">Status: {issue.status}</p>
              {issue.imageUrl && (
                <img
                  src={`http://localhost:5000/uploads/${issue.imageUrl}`}
                  alt="Issue"
                  className="mt-2 w-40 rounded"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyIssues;