import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Send } from "lucide-react";
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

interface ReportSectionProps {
  hasResult: boolean;
}

const ReportSection = ({ hasResult }: ReportSectionProps) => {
  const [reportSent, setReportSent] = useState(false);
  const [reportId, setReportId] = useState("");

  const handleReport = () => {
    const id = Math.floor(100000 + Math.random() * 90000000).toString();
    setReportId(id);
    setReportSent(true);
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
          onClick={() => setReportSent(false)}
          className="border-border text-card-foreground hover:bg-secondary hover:text-secondary-foreground"
        >
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6 text-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            disabled={!hasResult}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8 py-3 text-base"
          >
            <Send className="w-4 h-4 mr-2" />
            Report to Municipal Authority
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
    </div>
  );
};

export default ReportSection;
