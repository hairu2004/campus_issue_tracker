import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const StudentProfile = () => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setIssues(res.data.issues);

        // ✅ Show toast if any resolved issue hasn't been notified
        const unresolved = res.data.issues.filter(
          (i) => i.status === "resolved" && !i.notified
        );

        if (unresolved.length > 0) {
          toast.success(`🎉 ${unresolved.length} issue(s) have been resolved!`);

          // ✅ Mark them as notified
          unresolved.forEach((i) => {
            axios.patch(`/issues/${i._id}`, { notified: true }, {
              headers: { Authorization: `Bearer ${token}` },
            });
          });
        }
      } catch (err) {
        toast.error("Failed to load profile");
        console.error(err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleEdit = async (issue) => {
    const allowedCategories = ["infrastructure", "academics", "hostel"];
    const newTitle = prompt("Edit title:", issue.title)?.trim();
    const newDescription = prompt("Edit description:", issue.description)?.trim();
    const newCategory = prompt("Edit category:", issue.category)?.toLowerCase();

    if (!newTitle || !newDescription || !allowedCategories.includes(newCategory)) {
      toast.error("Invalid input. Use valid category and non-empty fields.");
      return;
    }

    try {
      const res = await axios.patch(`/issues/student/edit/${issue._id}`, {
        title: newTitle,
        description: newDescription,
        category: newCategory,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Issue updated");
      setIssues((prev) =>
        prev.map((i) => (i._id === issue._id ? res.data.issue : i))
      );
    } catch (err) {
      toast.error("Failed to update issue");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;

    try {
      await axios.delete(`/issues/student/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Issue deleted");
      setIssues((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      toast.error("Failed to delete issue");
      console.error(err);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <div className="mb-6 border p-4 rounded shadow bg-gray-50">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      <h3 className="text-xl font-semibold mb-2">My Submitted Issues</h3>
      {issues.length === 0 ? (
        <p className="text-gray-600">You haven’t submitted any issues yet.</p>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue._id} className="border p-4 rounded shadow">
              <h4 className="text-lg font-semibold">{issue.title}</h4>
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
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleEdit(issue)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(issue._id)}
                  className="bg-red-600 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProfile;