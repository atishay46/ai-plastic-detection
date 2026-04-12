const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export interface Prediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
}

export interface AnalyzeResponse {
  count: number;
  ppi: number;
  severity: "Low" | "Medium" | "High";
  predictions: Prediction[];
}

export interface ReportPayload {
  name?: string;
  phone?: string;
  email?: string;
  city: string;
  ppi: number;
  severity: string;
  latitude?: number;
  longitude?: number;
}

export interface ReportResponse {
  message: string;
  report_id: string;
}

export async function analyzeImage(file: File): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Analysis failed (${res.status}): ${text}`);
  }

  return res.json();
}

export async function submitReport(data: ReportPayload): Promise<ReportResponse> {
  const res = await fetch(`${API_BASE}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Report submission failed (${res.status}): ${text}`);
  }

  return res.json();
}
