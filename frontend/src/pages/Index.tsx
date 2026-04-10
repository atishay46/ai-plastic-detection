import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ImageUpload from "@/components/ImageUpload";
import ResultDisplay, { type DetectionResult } from "@/components/ResultDisplay";
import ToggleControls from "@/components/ToggleControls";
import UserForm, { type UserFormData } from "@/components/UserForm";
import ReportSection from "@/components/ReportSection";

const Index = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetections, setShowDetections] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    phone: "",
    email: "",
    state: "Maharashtra",
    city: "",
  });

  const handleImageSelect = useCallback((_file: File, previewUrl: string) => {
    setPreview(previewUrl);
    setResult(null);
    setIsAnalyzing(true);

    // Simulate API call
    setTimeout(() => {
      const severities: Array<"Low" | "Medium" | "High"> = ["Low", "Medium", "High"];
      setResult({
        plasticCount: Math.floor(Math.random() * 20) + 1,
        ppiScore: Math.floor(Math.random() * 80) + 20,
        severity: severities[Math.floor(Math.random() * 3)],
      });
      setIsAnalyzing(false);
    }, 2500);
  }, []);

  const handleClear = () => {
    setPreview(null);
    setResult(null);
    setIsAnalyzing(false);
  };

  const handleDarkMode = (val: boolean) => {
    setDarkMode(val);
    document.documentElement.classList.toggle("dark", val);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Toggle Controls */}
        <div className="card-elevated p-4">
          <ToggleControls
            showDetections={showDetections}
            onToggleDetections={setShowDetections}
            darkMode={darkMode}
            onToggleDarkMode={handleDarkMode}
          />
        </div>

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
            detectedImage={preview}
            showDetections={showDetections}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* User form + Report */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserForm formData={formData} onChange={setFormData} />
          </div>
          <ReportSection hasResult={!!result} />
        </div>
      </main>
    </div>
  );
};

export default Index;
