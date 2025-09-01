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
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or description"
          className="p-2 border rounded w-full sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="academics">Academics</option>
          <option value="hostel">Hostel</option>
        </select>
        <select
          className="p-2 border rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Issue List */}
      {filteredIssues.length === 0 ? (
        <p className="text-gray-600">No matching issues found.</p>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue) => (
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
              <div className="mt-2 space-x-2">
                {issue.status !== "resolved" && (
                  <button
                    onClick={() => markResolved(issue._id)}
                    className="bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Mark as Resolved
                  </button>
                )}
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;