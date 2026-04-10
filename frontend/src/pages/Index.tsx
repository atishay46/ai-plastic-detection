import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ImageUpload from "@/components/ImageUpload";
import ResultDisplay, { type DetectionResult } from "@/components/ResultDisplay";
import ToggleControls from "@/components/ToggleControls";
import UserForm, { type UserFormData } from "@/components/UserForm";
import ReportSection from "@/components/ReportSection";
import { analyzeImage } from "@/lib/api";

const Index = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetections, setShowDetections] = useState(true);
  const [sharePersonalData, setSharePersonalData] = useState(true);
  const [highSensitivity, setHighSensitivity] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    phone: "",
    email: "",
    state: "Maharashtra",
    city: "",
  });

  const handleImageSelect = useCallback(async (file: File, previewUrl: string) => {
    setPreview(previewUrl);
    setUploadedFile(file);
    setResult(null);
    setError(null);
    setIsAnalyzing(true);

    try {
      const response = await analyzeImage(file);
      setResult({
        plasticCount: response.count,
        ppiScore: response.ppi,
        severity: response.severity,
        predictions: response.predictions || [],
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze image. Please try again.";
      setError(message);
      setResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleClear = () => {
    setPreview(null);
    setUploadedFile(null);
    setResult(null);
    setIsAnalyzing(false);
    setError(null);
  };

  const handleDarkMode = (val: boolean) => {
    setDarkMode(val);
    document.documentElement.classList.toggle("dark", val);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-400">
      <Navbar darkMode={darkMode} onToggleDarkMode={handleDarkMode} />
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Toggle Controls */}
        <div className="card-elevated p-4">
          <ToggleControls
            showDetections={showDetections}
            onToggleDetections={setShowDetections}
            sharePersonalData={sharePersonalData}
            onToggleShareData={setSharePersonalData}
            highSensitivity={highSensitivity}
            onToggleHighSensitivity={setHighSensitivity}
          />
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-6 py-4 rounded-xl animate-fade-in-up">
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageUpload
            onImageSelect={handleImageSelect}
            preview={preview}
            onClear={handleClear}
          />
          <ResultDisplay
            result={result}
            originalImage={preview}
            showDetections={showDetections}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* User form + Report */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserForm formData={formData} onChange={setFormData} />
          </div>
          <ReportSection
            hasResult={!!result}
            formData={formData}
            ppi={result?.ppiScore ?? 0}
            severity={result?.severity ?? "Low"}
            sharePersonalData={sharePersonalData}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
