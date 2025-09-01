import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ReportIssue = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "infrastructure",
    image: null,
  });
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Location error:", err);
          toast.error("Unable to detect location");
        }
      );
    } else {
      toast.error("Geolocation not supported");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("image", formData.image);
    data.append("studentId", user.id);
    if (location) {
      data.append("lat", location.lat);
      data.append("lng", location.lng);
    }

    try {
      await axios.post("/issues", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Issue submitted successfully!");
      setFormData({
        title: "",
        description: "",
        category: "infrastructure",
        image: null,
      });
      setLocation(null);
    } catch (err) {
      toast.error("Submission failed. Try again.");
      console.error("Issue submission error:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 via-zinc-100 to-slate-200 px-4 py-10">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8 space-y-8">
        <h2 className="text-3xl font-bold text-neutral-700 text-center">Report an Issue</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">Title</label>
            <input
              name="title"
              placeholder="Issue title"
              className="w-full px-4 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Describe the issue"
              className="w-full px-4 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">Category</label>
            <select
              name="category"
              className="w-full px-4 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="infrastructure">Infrastructure</option>
              <option value="academics">Academics</option>
              <option value="hostel">Hostel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">Upload Image</label>
            <input
              type="file"
              name="image"
              className="w-full px-4 py-2 rounded-lg bg-gray-50"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">Your Location</label>
            {location ? (
              <>
                <MapContainer
                  center={[location.lat, location.lng]}
                  zoom={16}
                  style={{ height: "300px" }}
                  className="rounded-xl overflow-hidden shadow-md"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[location.lat, location.lng]} />
                </MapContainer>
                <p className="text-sm mt-2 text-neutral-500">
                  Auto-detected: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                </p>
              </>
            ) : (
              <p className="text-sm text-neutral-400">Detecting location...</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white font-semibold py-2 rounded-full transition duration-200"
          >
            Submit Issue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;