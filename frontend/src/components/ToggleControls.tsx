import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, Shield, Zap } from "lucide-react";

interface ToggleControlsProps {
  showDetections: boolean;
  onToggleDetections: (val: boolean) => void;
  sharePersonalData: boolean;
  onToggleShareData: (val: boolean) => void;
  highSensitivity: boolean;
  onToggleHighSensitivity: (val: boolean) => void;
}

const ToggleControls = ({
  showDetections,
  onToggleDetections,
  sharePersonalData,
  onToggleShareData,
  highSensitivity,
  onToggleHighSensitivity,
}: ToggleControlsProps) => {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex items-center gap-3 bg-card-foreground/5 px-4 py-2.5 rounded-xl border border-border/50">
        <Eye className="w-4 h-4 text-secondary" />
        <Label htmlFor="detections" className="text-card-foreground text-sm font-medium cursor-pointer">
          Show Detections
        </Label>
        <Switch
          id="detections"
          checked={showDetections}
          onCheckedChange={onToggleDetections}
        />
      </div>
      <div className="flex items-center gap-3 bg-card-foreground/5 px-4 py-2.5 rounded-xl border border-border/50">
        <Shield className="w-4 h-4 text-secondary" />
        <Label htmlFor="sharedata" className="text-card-foreground text-sm font-medium cursor-pointer">
          Share Personal Data
        </Label>
        <Switch
          id="sharedata"
          checked={sharePersonalData}
          onCheckedChange={onToggleShareData}
        />
      </div>
      <div className="flex items-center gap-3 bg-card-foreground/5 px-4 py-2.5 rounded-xl border border-border/50">
        <Zap className="w-4 h-4 text-secondary" />
        <Label htmlFor="sensitivity" className="text-card-foreground text-sm font-medium cursor-pointer">
          High Sensitivity Mode
        </Label>
        <Switch
          id="sensitivity"
          checked={highSensitivity}
          onCheckedChange={onToggleHighSensitivity}
        />
      </div>
    </div>
  );
};

export default ToggleControls;
