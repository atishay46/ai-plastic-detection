import { BarChart3, AlertTriangle, Activity } from "lucide-react";

interface DetectionResult {
  plasticCount: number;
  ppiScore: number;
  severity: "Low" | "Medium" | "High";
}

interface ResultDisplayProps {
  result: DetectionResult | null;
  originalImage: string | null;
  detectedImage: string | null;
  showDetections: boolean;
  isAnalyzing: boolean;
}

const ResultDisplay = ({
  result,
  originalImage,
  detectedImage,
  showDetections,
  isAnalyzing,
}: ResultDisplayProps) => {
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
    <div className="card-elevated p-6 h-full space-y-5">
      <h3 className="font-display text-lg font-semibold text-card-foreground flex items-center gap-2">
        <Activity className="w-5 h-5 text-secondary" />
        Detection Results
      </h3>

      {/* Before / After */}
      {originalImage && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Before</p>
            <img src={originalImage} alt="Original" className="w-full h-32 object-cover rounded-lg" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">After</p>
            <img
              src={showDetections && detectedImage ? detectedImage : originalImage}
              alt="Detected"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
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
