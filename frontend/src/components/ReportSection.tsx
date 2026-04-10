import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Send, Loader2 } from "lucide-react";
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

  const handleReport = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = sharePersonalData
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

      const response = await submitReport(payload);
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
