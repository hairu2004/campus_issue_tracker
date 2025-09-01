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

        const unresolved = res.data.issues.filter(
          (i) => i.status === "resolved" && !i.notified
        );

        if (unresolved.length > 0) {
          toast.success(`🎉 ${unresolved.length} issue(s) have been resolved!`);
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

  if (!user)
    return (
      <p className="text-center mt-20 text-slate-500 text-lg font-medium">
        Loading profile...
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-zinc-100 to-slate-200 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-neutral-700 text-center">My Profile</h2>

        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <p className="text-lg text-slate-800"><strong>Name:</strong> {user.name}</p>
          <p className="text-lg text-slate-800"><strong>Email:</strong> {user.email}</p>
          <p className="text-lg text-slate-800"><strong>Role:</strong> {user.role}</p>
        </div>

        <h3 className="text-2xl font-semibold text-slate-800 text-center">My Submitted Issues</h3>
        {issues.length === 0 ? (
          <p className="text-slate-500 text-center text-lg">You haven’t submitted any issues yet.</p>
        ) : (
          <div className="space-y-6">
            {issues.map((issue) => (
              <div key={issue._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <h4 className="text-xl font-semibold text-slate-800">{issue.title}</h4>
                <p className="text-sm text-slate-600 mt-1">{issue.description}</p>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-violet-500">Category: {issue.category}</span>
                  <span className={`font-medium ${issue.status === "resolved" ? "text-lime-600" : "text-amber-500"}`}>
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
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(issue)}
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white px-4 py-2 rounded-full transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(issue._id)}
                    className="bg-gradient-to-r from-neutral-600 to-slate-700 hover:from-neutral-700 hover:to-slate-800 text-white px-4 py-2 rounded-full transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;