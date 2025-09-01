import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

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

  if (!stats)
    return (
      <p className="text-center mt-20 text-neutral-500 text-lg font-medium">
        Loading analytics...
      </p>
    );

  const categoryData = {
    labels: stats.categoryStats.map((c) => c._id),
    datasets: [
      {
        label: "Issues per Category",
        data: stats.categoryStats.map((c) => c.count),
        backgroundColor: ["#fbbf24", "#a78bfa", "#94a3b8"], // amber, violet, slate
      },
    ],
  };

  const statusData = {
    labels: stats.statusStats.map((s) => s._id),
    datasets: [
      {
        label: "Issue Status",
        data: stats.statusStats.map((s) => s.count),
        backgroundColor: ["#facc15", "#60a5fa"], // yellow, sky
      },
    ],
  };

  const monthlyData = {
    labels: stats.monthlyStats.map((m) => `Month ${m._id}`),
    datasets: [
      {
        label: "Issues per Month",
        data: stats.monthlyStats.map((m) => m.count),
        backgroundColor: "#818cf8", // indigo
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-zinc-100 to-slate-200 px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <h2 className="text-3xl font-bold text-neutral-700 text-center">Analytics Dashboard</h2>

        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Issues by Category</h3>
          <Bar data={categoryData} />
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Status Breakdown</h3>
          <Pie data={statusData} />
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Monthly Trends</h3>
          <Bar data={monthlyData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;