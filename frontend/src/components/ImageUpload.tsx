import { useState, useRef, useCallback } from "react";
import { Upload, Camera, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  preview: string | null;
  onClear: () => void;
}

const ImageUpload = ({ onImageSelect, preview, onClear }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect(file, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) handleFile(file);
    },
    [handleFile]
  );

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch {
      alert("Camera access denied");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        handleFile(file);
      }
    });
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach((t) => t.stop());
    setShowCamera(false);
  };

  return (
    <div className="card-elevated p-6 h-full">
      <h3 className="font-display text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-secondary" />
        Image Input
      </h3>

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-xl"
          />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-card/80 backdrop-blur hover:bg-destructive hover:text-destructive-foreground transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : showCamera ? (
        <div className="relative">
          <video ref={videoRef} autoPlay className="w-full h-64 object-cover rounded-xl" />
          <Button onClick={capturePhoto} className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
            Capture
          </Button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
            isDragging
              ? "border-secondary bg-secondary/10"
              : "border-border hover:border-secondary/50"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-10 h-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop an image, or click to browse
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-card-foreground/10 border-border text-card-foreground hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={startCamera}
          className="flex-1 bg-card-foreground/10 border-border text-card-foreground hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
        >
          <Camera className="w-4 h-4 mr-2" />
          Camera
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
