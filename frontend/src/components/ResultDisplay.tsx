import { useRef, useEffect, useCallback } from "react";
import { BarChart3, AlertTriangle, Activity } from "lucide-react";
import type { Prediction } from "@/lib/api";

interface DetectionResult {
  plasticCount: number;
  ppiScore: number;
  severity: "Low" | "Medium" | "High";
  predictions: Prediction[];
}

interface ResultDisplayProps {
  result: DetectionResult | null;
  originalImage: string | null;
  showDetections: boolean;
  isAnalyzing: boolean;
}

const ResultDisplay = ({
  result,
  originalImage,
  showDetections,
  isAnalyzing,
}: ResultDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawBoundingBoxes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage || !result) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      if (showDetections && result.predictions.length > 0) {
        result.predictions.forEach((pred) => {
          const x = pred.x - pred.width / 2;
          const y = pred.y - pred.height / 2;

          // Draw box
          ctx.strokeStyle = "#b5e930";
          ctx.lineWidth = Math.max(2, Math.round(img.naturalWidth / 300));
          ctx.strokeRect(x, y, pred.width, pred.height);

          // Draw label background
          const label = `${pred.class} ${(pred.confidence * 100).toFixed(0)}%`;
          const fontSize = Math.max(12, Math.round(img.naturalWidth / 50));
          ctx.font = `bold ${fontSize}px Inter, sans-serif`;
          const textMetrics = ctx.measureText(label);
          const textHeight = fontSize + 6;
          const padding = 4;

          ctx.fillStyle = "rgba(22, 68, 55, 0.85)";
          ctx.fillRect(x, y - textHeight - padding, textMetrics.width + padding * 2, textHeight + padding);

          // Draw label text
          ctx.fillStyle = "#b5e930";
          ctx.fillText(label, x + padding, y - padding - 3);
        });
      }
    };
    img.src = originalImage;
  }, [originalImage, result, showDetections]);

  useEffect(() => {
    drawBoundingBoxes();
  }, [drawBoundingBoxes]);

  if (isAnalyzing) {
    return (
      <div className="card-elevated p-6 h-full flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        <p className="text-card-foreground font-medium animate-pulse">
          Analyzing image...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card-elevated p-6 h-full flex flex-col items-center justify-center gap-3 text-center">
        <BarChart3 className="w-12 h-12 text-muted-foreground/40" />
        <p className="text-muted-foreground text-sm">
          Upload an image to see detection results
        </p>
      </div>
    );
  }

  const severityColor =
    result.severity === "Low"
      ? "severity-low"
      : result.severity === "Medium"
      ? "severity-medium"
      : "severity-high";

  const severityPercent =
    result.severity === "Low" ? 30 : result.severity === "Medium" ? 60 : 90;

  return (
    <div className="card-elevated p-6 h-full space-y-5 animate-fade-in">
      <h3 className="font-display text-lg font-semibold text-card-foreground flex items-center gap-2">
        <Activity className="w-5 h-5 text-secondary" />
        Detection Results
      </h3>

      {/* Image with bounding boxes drawn on canvas */}
      {originalImage && (
        <div className="relative rounded-xl overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-auto rounded-xl"
            style={{ maxHeight: "320px", objectFit: "contain" }}
          />
          {result.predictions.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
              <p className="text-white font-medium text-sm bg-black/50 px-4 py-2 rounded-lg">
                No plastic detected in this image
              </p>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-card-foreground/5 text-center">
          <p className="text-2xl font-bold text-card-foreground">{result.plasticCount}</p>
          <p className="text-xs text-muted-foreground">Plastic Items</p>
        </div>
        <div className="p-3 rounded-xl bg-card-foreground/5 text-center">
          <p className="text-2xl font-bold text-card-foreground">{result.ppiScore}</p>
          <p className="text-xs text-muted-foreground">PPI Score</p>
        </div>
        <div className="p-3 rounded-xl bg-card-foreground/5 text-center flex flex-col items-center justify-center">
          <AlertTriangle className={`w-5 h-5 mb-1 ${result.severity === "High" ? "text-destructive" : "text-secondary"}`} />
          <p className="text-xs text-muted-foreground">{result.severity}</p>
        </div>
      </div>

      {/* Severity Bar */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Severity Level</span>
          <span>{result.severity}</span>
        </div>
        <div className="w-full h-3 rounded-full bg-card-foreground/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${severityColor}`}
            style={{ width: `${severityPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
export type { DetectionResult };
