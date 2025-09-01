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

  // ✅ Auto-detect location on mount
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
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Report an Issue</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          className="w-full p-2 border rounded"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="infrastructure">Infrastructure</option>
          <option value="academics">Academics</option>
          <option value="hostel">Hostel</option>
        </select>
        <input
          type="file"
          name="image"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />

        {/* Auto-detected Location Preview */}
        <div>
          <label className="block font-semibold mb-1">Your Location:</label>
          {location ? (
            <>
              <MapContainer center={[location.lat, location.lng]} zoom={16} style={{ height: "300px" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[location.lat, location.lng]} />
              </MapContainer>
              <p className="text-sm mt-2 text-gray-600">
                Auto-detected: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">Detecting location...</p>
          )}
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReportIssue;