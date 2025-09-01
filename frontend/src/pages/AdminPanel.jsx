import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AdminPanel = () => {
  const { token } = useAuth();
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get(`/issues?page=${page}&limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIssues(res.data.issues);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        toast.error("Failed to load issues");
        console.error(err);
      }
    };

    fetchIssues();
  }, [token, page]);

  const markResolved = async (id) => {
    try {
      await axios.patch(`/issues/${id}`, { status: "resolved" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Issue marked as resolved");
      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === id ? { ...issue, status: "resolved" } : issue
        )
      );
    } catch (err) {
      toast.error("Failed to update issue");
      console.error(err);
    }
  };

  const handleEdit = async (issue) => {
    const allowedCategories = ["infrastructure", "academics", "hostel"];
    const newTitle = prompt("Edit title:", issue.title)?.trim();
    const newDescription = prompt("Edit description:", issue.description)?.trim();
    const newCategory = prompt("Edit category (infrastructure, academics, hostel):", issue.category)?.toLowerCase();

    if (!newTitle || !newDescription || !allowedCategories.includes(newCategory)) {
      toast.error("Invalid input. Please use valid category and non-empty fields.");
      return;
    }

    try {
      const res = await axios.patch(`/issues/edit/${issue._id}`, {
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
      await axios.delete(`/issues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Issue deleted");
      setIssues((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      toast.error("Failed to delete issue");
      console.error(err);
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || issue.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" || issue.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-zinc-100 to-slate-200 px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-neutral-700 text-center">Admin Dashboard</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by title or description"
            className="px-4 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="academics">Academics</option>
            <option value="hostel">Hostel</option>
          </select>
          <select
            className="px-4 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Issue List */}
        {filteredIssues.length === 0 ? (
          <p className="text-neutral-500 text-center">No matching issues found.</p>
        ) : (
          <div className="space-y-6">
            {filteredIssues.map((issue) => (
              <div key={issue._id} className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-slate-800">{issue.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{issue.description}</p>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-indigo-500">Category: {issue.category}</span>
                  <span className={`font-medium ${issue.status === "resolved" ? "text-emerald-500" : "text-amber-500"}`}>
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
                  {issue.status !== "resolved" && (
                    <button
                      onClick={() => markResolved(issue._id)}
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white px-4 py-2 rounded-full transition"
                    >
                      Mark as Resolved
                    </button>
                  )}
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

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-50 transition"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-slate-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;