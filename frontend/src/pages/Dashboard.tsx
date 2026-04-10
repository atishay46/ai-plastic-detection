import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { FileText, Trash2, Activity, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts";

const cityData = [
  { city: "Mumbai", complaints: 145 },
  { city: "Pune", complaints: 98 },
  { city: "Nagpur", complaints: 67 },
  { city: "Nashik", complaints: 54 },
  { city: "Thane", complaints: 89 },
  { city: "Aurangabad", complaints: 42 },
];

const timeData = [
  { month: "Jan", reports: 30 },
  { month: "Feb", reports: 45 },
  { month: "Mar", reports: 62 },
  { month: "Apr", reports: 78 },
  { month: "May", reports: 55 },
  { month: "Jun", reports: 92 },
];

interface Complaint {
  id: string;
  city: string;
  ppi: number;
  severity: "Low" | "Medium" | "High";
  status: Status;
}

const initialComplaints: Complaint[] = [
  { id: "RPT-482917", city: "Mumbai", ppi: 72, severity: "High" as const, status: "Received" as const },
  { id: "RPT-193847", city: "Pune", ppi: 45, severity: "Medium" as const, status: "In Progress" as const },
  { id: "RPT-657382", city: "Nagpur", ppi: 23, severity: "Low" as const, status: "Resolved" as const },
  { id: "RPT-928461", city: "Thane", ppi: 68, severity: "High" as const, status: "Received" as const },
  { id: "RPT-374829", city: "Nashik", ppi: 37, severity: "Medium" as const, status: "In Progress" as const },
  { id: "RPT-816294", city: "Mumbai", ppi: 81, severity: "High" as const, status: "Received" as const },
  { id: "RPT-549172", city: "Aurangabad", ppi: 19, severity: "Low" as const, status: "Resolved" as const },
];

type Status = "Received" | "In Progress" | "Resolved";

const Dashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState(initialComplaints);

  useEffect(() => {
    if (sessionStorage.getItem("eco-auth") !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  const updateStatus = (id: string, status: Status) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const statusClass = (s: Status) =>
    s === "Received" ? "status-received" : s === "In Progress" ? "status-in-progress" : "status-resolved";

  const totalReports = complaints.length;
  const totalPlastic = complaints.reduce((a, c) => a + c.ppi, 0);
  const avgPPI = Math.round(totalPlastic / totalReports);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Municipal Dashboard
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem("eco-auth");
              navigate("/login");
            }}
            className="border-border text-foreground hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Reports", value: totalReports, icon: FileText },
            { label: "Total Plastic Detected", value: totalPlastic, icon: Trash2 },
            { label: "Average PPI", value: avgPPI, icon: Activity },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card-elevated p-6 hover-lift">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-3xl font-bold text-card-foreground">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-elevated p-6">
            <h3 className="font-display text-lg font-semibold text-card-foreground mb-4">
              City-wise Complaints
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="city" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="complaints" fill="#b5e930" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card-elevated p-6">
            <h3 className="font-display text-lg font-semibold text-card-foreground mb-4">
              Reports Over Time
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="reports" stroke="#164437" strokeWidth={3} dot={{ fill: "#b5e930", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaint Table */}
        <div className="card-elevated p-6">
          <h3 className="font-display text-lg font-semibold text-card-foreground mb-4">
            Complaint Reports
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Report ID", "City", "PPI", "Severity", "Status"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 font-semibold text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-card-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-card-foreground">{c.id}</td>
                    <td className="py-3 px-4 text-card-foreground">{c.city}</td>
                    <td className="py-3 px-4 font-semibold text-card-foreground">{c.ppi}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          c.severity === "High"
                            ? "bg-destructive/15 text-destructive"
                            : c.severity === "Medium"
                            ? "bg-secondary/20 text-secondary-foreground"
                            : "bg-severity-low/15 text-severity-low"
                        }`}
                      >
                        {c.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Select value={c.status} onValueChange={(v) => updateStatus(c.id, v as Status)}>
                        <SelectTrigger className={`w-36 h-8 text-xs font-semibold border-0 ${statusClass(c.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Received">Received</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
