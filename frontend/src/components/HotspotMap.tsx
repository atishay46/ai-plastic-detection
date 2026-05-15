import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { AlertTriangle, MapPin, Info } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue in bundlers
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ── Dummy Report Data ──────────────────────────────
// Each report has real lat/lng in specific neighborhoods

interface ReportPin {
  id: string;
  lat: number;
  lng: number;
  area: string;
  city: string;
  ppi: number;
  severity: "Low" | "Medium" | "High";
}

const reportPins: ReportPin[] = [
  // ─── NAGPUR — Nandanvan area (HOTSPOT: 7 reports clustered) ───
  { id: "RPT-901201", lat: 21.1285, lng: 79.1045, area: "Nandanvan", city: "Nagpur", ppi: 78, severity: "High" },
  { id: "RPT-901202", lat: 21.1292, lng: 79.1058, area: "Nandanvan", city: "Nagpur", ppi: 65, severity: "High" },
  { id: "RPT-901203", lat: 21.1278, lng: 79.1032, area: "Nandanvan", city: "Nagpur", ppi: 71, severity: "High" },
  { id: "RPT-901204", lat: 21.1301, lng: 79.1067, area: "Nandanvan", city: "Nagpur", ppi: 82, severity: "High" },
  { id: "RPT-901205", lat: 21.1270, lng: 79.1050, area: "Nandanvan", city: "Nagpur", ppi: 59, severity: "Medium" },
  { id: "RPT-901206", lat: 21.1310, lng: 79.1040, area: "Nandanvan", city: "Nagpur", ppi: 73, severity: "High" },
  { id: "RPT-901207", lat: 21.1295, lng: 79.1075, area: "Nandanvan", city: "Nagpur", ppi: 68, severity: "High" },

  // ─── NAGPUR — Sadar area (3 reports, not a hotspot) ───
  { id: "RPT-901301", lat: 21.1530, lng: 79.0820, area: "Sadar", city: "Nagpur", ppi: 32, severity: "Medium" },
  { id: "RPT-901302", lat: 21.1545, lng: 79.0835, area: "Sadar", city: "Nagpur", ppi: 28, severity: "Low" },
  { id: "RPT-901303", lat: 21.1520, lng: 79.0810, area: "Sadar", city: "Nagpur", ppi: 35, severity: "Medium" },

  // ─── MUMBAI — Dharavi area (HOTSPOT: 6 reports clustered) ───
  { id: "RPT-482917", lat: 19.0414, lng: 72.8553, area: "Dharavi", city: "Mumbai", ppi: 72, severity: "High" },
  { id: "RPT-482918", lat: 19.0425, lng: 72.8540, area: "Dharavi", city: "Mumbai", ppi: 81, severity: "High" },
  { id: "RPT-482919", lat: 19.0402, lng: 72.8565, area: "Dharavi", city: "Mumbai", ppi: 66, severity: "High" },
  { id: "RPT-482920", lat: 19.0438, lng: 72.8558, area: "Dharavi", city: "Mumbai", ppi: 74, severity: "High" },
  { id: "RPT-482921", lat: 19.0410, lng: 72.8530, area: "Dharavi", city: "Mumbai", ppi: 69, severity: "High" },
  { id: "RPT-482922", lat: 19.0445, lng: 72.8548, area: "Dharavi", city: "Mumbai", ppi: 77, severity: "High" },

  // ─── PUNE — Kothrud area (HOTSPOT: 5 reports clustered) ───
  { id: "RPT-193847", lat: 18.5074, lng: 73.8077, area: "Kothrud", city: "Pune", ppi: 45, severity: "Medium" },
  { id: "RPT-193848", lat: 18.5085, lng: 73.8090, area: "Kothrud", city: "Pune", ppi: 52, severity: "Medium" },
  { id: "RPT-193849", lat: 18.5062, lng: 73.8065, area: "Kothrud", city: "Pune", ppi: 61, severity: "High" },
  { id: "RPT-193850", lat: 18.5091, lng: 73.8082, area: "Kothrud", city: "Pune", ppi: 48, severity: "Medium" },
  { id: "RPT-193851", lat: 18.5070, lng: 73.8095, area: "Kothrud", city: "Pune", ppi: 55, severity: "Medium" },

  // ─── THANE — scattered (2 reports, not a hotspot) ───
  { id: "RPT-928461", lat: 19.2183, lng: 72.9781, area: "Naupada", city: "Thane", ppi: 68, severity: "High" },
  { id: "RPT-928462", lat: 19.1970, lng: 72.9630, area: "Kalwa", city: "Thane", ppi: 41, severity: "Medium" },

  // ─── NASHIK — scattered (2 reports) ───
  { id: "RPT-374829", lat: 19.9975, lng: 73.7898, area: "Panchavati", city: "Nashik", ppi: 37, severity: "Medium" },
  { id: "RPT-374830", lat: 20.0063, lng: 73.7710, area: "Gangapur Rd", city: "Nashik", ppi: 24, severity: "Low" },

  // ─── AURANGABAD — scattered (2 reports) ───
  { id: "RPT-549172", lat: 19.8762, lng: 75.3433, area: "City Chowk", city: "Aurangabad", ppi: 19, severity: "Low" },
  { id: "RPT-549173", lat: 19.8850, lng: 75.3520, area: "Kranti Chowk", city: "Aurangabad", ppi: 26, severity: "Low" },
];

// ── Hotspot Threshold ──────────────────────────────
const HOTSPOT_THRESHOLD = 5;

// ── Compute hotspot areas ──────────────────────────
interface HotspotArea {
  area: string;
  city: string;
  count: number;
  avgPpi: number;
  centerLat: number;
  centerLng: number;
  isHotspot: boolean;
}

function computeHotspots(pins: ReportPin[]): HotspotArea[] {
  const grouped: Record<string, ReportPin[]> = {};
  pins.forEach((p) => {
    const key = `${p.area}, ${p.city}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p);
  });

  return Object.entries(grouped)
    .map(([, reports]) => {
      const count = reports.length;
      const avgPpi = Math.round(reports.reduce((s, r) => s + r.ppi, 0) / count);
      const centerLat = reports.reduce((s, r) => s + r.lat, 0) / count;
      const centerLng = reports.reduce((s, r) => s + r.lng, 0) / count;
      return {
        area: reports[0].area,
        city: reports[0].city,
        count,
        avgPpi,
        centerLat,
        centerLng,
        isHotspot: count >= HOTSPOT_THRESHOLD,
      };
    })
    .sort((a, b) => b.count - a.count);
}

// ── Custom cluster icon ────────────────────────────
const createClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  const isHotspot = count >= HOTSPOT_THRESHOLD;

  return L.divIcon({
    html: `<div style="
      background: ${isHotspot ? "rgba(239,68,68,0.85)" : "rgba(34,197,94,0.85)"};
      color: white;
      border-radius: 50%;
      width: ${isHotspot ? 48 : 36}px;
      height: ${isHotspot ? 48 : 36}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: ${isHotspot ? 16 : 13}px;
      border: 3px solid ${isHotspot ? "#dc2626" : "#16a34a"};
      box-shadow: 0 0 ${isHotspot ? "16px rgba(239,68,68,0.5)" : "8px rgba(34,197,94,0.3)"};
    ">${count}</div>`,
    className: "custom-cluster-icon",
    iconSize: L.point(isHotspot ? 48 : 36, isHotspot ? 48 : 36),
  });
};

// ── Severity pin color ─────────────────────────────
const severityColor = (s: string) =>
  s === "High" ? "#ef4444" : s === "Medium" ? "#f59e0b" : "#22c55e";

// ── Component ──────────────────────────────────────
const HotspotMap = () => {
  const hotspots = useMemo(() => computeHotspots(reportPins), []);

  return (
    <div className="card-elevated p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-display text-lg font-semibold text-card-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5 text-secondary" />
          Pollution Hotspots
        </h3>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20">
          <Info className="w-4 h-4 text-secondary" />
          <span className="text-xs text-muted-foreground">
            Areas with <strong className="text-card-foreground">{HOTSPOT_THRESHOLD}+ reports</strong> are declared as hotspots
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-border" style={{ height: 420 }}>
        <MapContainer
          center={[20.5, 76.5]}
          zoom={7}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Hotspot zone circles */}
          {hotspots
            .filter((h) => h.isHotspot)
            .map((h) => (
              <Circle
                key={`zone-${h.area}`}
                center={[h.centerLat, h.centerLng]}
                radius={1200}
                pathOptions={{
                  color: "#ef4444",
                  fillColor: "#ef4444",
                  fillOpacity: 0.12,
                  weight: 2,
                  dashArray: "6 4",
                }}
              />
            ))}

          {/* Clustered markers */}
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterIcon}
            maxClusterRadius={60}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
          >
            {reportPins.map((pin) => (
              <Marker key={pin.id} position={[pin.lat, pin.lng]}>
                <Popup>
                  <div style={{ minWidth: 180, fontFamily: "Inter, sans-serif" }}>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                      {pin.id}
                    </p>
                    <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
                      {pin.area}, {pin.city}
                    </p>
                    <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                      <span>
                        PPI: <strong>{pin.ppi}</strong>
                      </span>
                      <span style={{ color: severityColor(pin.severity), fontWeight: 600 }}>
                        {pin.severity}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* Hotspot Summary Cards */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Area-wise Summary
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {hotspots.map((h) => (
            <div
              key={`${h.area}-${h.city}`}
              className={`relative p-4 rounded-xl border transition-all ${
                h.isHotspot
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-border bg-card-foreground/5"
              }`}
            >
              {/* Hotspot badge */}
              {h.isHotspot && (
                <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-destructive/15 text-destructive animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  Hotspot
                </span>
              )}

              <p className="font-semibold text-card-foreground text-sm">{h.area}</p>
              <p className="text-xs text-muted-foreground mb-3">{h.city}</p>

              <div className="flex items-center gap-4 text-xs">
                <div>
                  <p className="text-lg font-bold text-card-foreground">{h.count}</p>
                  <p className="text-muted-foreground">Reports</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-lg font-bold text-card-foreground">{h.avgPpi}</p>
                  <p className="text-muted-foreground">Avg PPI</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p
                    className={`text-lg font-bold ${
                      h.isHotspot ? "text-destructive" : "text-secondary"
                    }`}
                  >
                    {h.isHotspot ? "⚠ High" : "✓ Normal"}
                  </p>
                  <p className="text-muted-foreground">Risk</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotspotMap;
