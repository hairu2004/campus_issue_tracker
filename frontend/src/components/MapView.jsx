import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapView = ({ issues }) => {
  const defaultCenter = [11.2765, 77.2146];

  const validIssues = issues.filter((i) => i.location?.lat && i.location?.lng);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Campus Issue Map</h2>
      <MapContainer center={defaultCenter} zoom={16} style={{ height: "400px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {validIssues.map((issue) => (
          <Marker key={issue._id} position={[issue.location.lat, issue.location.lng]}>
            <Popup>
              <strong>{issue.title}</strong><br />
              Category: {issue.category}<br />
              Status: {issue.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;