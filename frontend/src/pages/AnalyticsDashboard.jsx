import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AnalyticsDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/issues/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };

    fetchStats();
  }, [token]);

  if (!stats) return <p className="text-center mt-10">Loading analytics...</p>;

  const categoryData = {
    labels: stats.categoryStats.map((c) => c._id),
    datasets: [
      {
        label: "Issues per Category",
        data: stats.categoryStats.map((c) => c.count),
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      },
    ],
  };

  const statusData = {
    labels: stats.statusStats.map((s) => s._id),
    datasets: [
      {
        label: "Issue Status",
        data: stats.statusStats.map((s) => s.count),
        backgroundColor: ["#f87171", "#34d399"],
      },
    ],
  };

  const monthlyData = {
    labels: stats.monthlyStats.map((m) => `Month ${m._id}`),
    datasets: [
      {
        label: "Issues per Month",
        data: stats.monthlyStats.map((m) => m.count),
        backgroundColor: "#6366f1",
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 space-y-10">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>

      <div>
        <h3 className="text-lg font-semibold mb-2">Issues by Category</h3>
        <Bar data={categoryData} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Status Breakdown</h3>
        <Pie data={statusData} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Monthly Trends</h3>
        <Bar data={monthlyData} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;