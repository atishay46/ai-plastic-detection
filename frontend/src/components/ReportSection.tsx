import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Send, Loader2, MapPin } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { submitReport } from "@/lib/api";
import type { UserFormData } from "@/components/UserForm";

interface ReportSectionProps {
  hasResult: boolean;
  formData: UserFormData;
  ppi: number;
  severity: string;
  sharePersonalData: boolean;
}

const ReportSection = ({ hasResult, formData, ppi, severity, sharePersonalData }: ReportSectionProps) => {
  const [reportSent, setReportSent] = useState(false);
  const [reportId, setReportId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Location state
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationLoading(false);
      },
      (err) => {
        setLocationLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError("Location access denied. Please enable location or enter manually.");
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("An unknown error occurred.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleReport = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = sharePersonalData
        ? {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            city: formData.city,
            ppi,
            severity,
          }
        : {
            city: formData.city || "Unknown",
            ppi,
            severity,
          };

      // Include location if available
      if (latitude !== null && longitude !== null) {
        payload.latitude = latitude;
        payload.longitude = longitude;
      }

      const response = await submitReport(payload as any);
      setReportId(response.report_id);
      setReportSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (reportSent) {
    return (
      <div className="card-elevated p-6 text-center space-y-3 animate-fade-in-up">
        <CheckCircle className="w-12 h-12 text-secondary mx-auto" />
        <h3 className="font-display text-xl font-bold text-card-foreground">
          Report Sent Successfully
        </h3>
        <p className="text-sm text-muted-foreground">
          Report ID: <span className="font-mono font-bold text-card-foreground">{reportId}</span>
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setReportSent(false); setError(null); }}
          className="border-border text-card-foreground bg-secondary text-secondary-foreground"
        >
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6 text-center space-y-3">
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg mb-2 animate-fade-in">
          {error}
        </div>
      )}

      {/* Location Capture */}
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGetLocation}
          disabled={locationLoading}
          className="w-full bg-card-foreground/5 border-border text-card-foreground hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
        >
          {locationLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Fetching location...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              Use Current Location 📍
            </>
          )}
        </Button>

        {latitude !== null && longitude !== null && (
          <div className="text-xs text-muted-foreground bg-card-foreground/5 px-3 py-2 rounded-lg space-y-0.5 animate-fade-in">
            <p>Latitude: <span className="font-mono font-semibold text-card-foreground">{latitude.toFixed(4)}</span></p>
            <p>Longitude: <span className="font-mono font-semibold text-card-foreground">{longitude.toFixed(4)}</span></p>
          </div>
        )}

        {locationError && (
          <p className="text-xs text-destructive animate-fade-in">{locationError}</p>
        )}
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            disabled={!hasResult || isSubmitting}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8 py-3 text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Report to Municipal Authority
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Confirm Report
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to report this issue to the municipal authority?
              {sharePersonalData ? (
                <span className="block mt-2 text-xs text-muted-foreground">
                  Your personal information will be included in the report.
                </span>
              ) : (
                <span className="block mt-2 text-xs text-muted-foreground">
                  Only detection data will be sent (no personal information).
                </span>
              )}
              {latitude !== null && longitude !== null && (
                <span className="block mt-1 text-xs text-muted-foreground">
                  📍 Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReport} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Yes, Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!hasResult && (
        <p className="text-xs text-muted-foreground mt-2">
          Upload and analyze an image first to submit a report.
        </p>
      )}
    </div>
  );
};

export default ReportSection;
