import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, Moon } from "lucide-react";

interface ToggleControlsProps {
  showDetections: boolean;
  onToggleDetections: (val: boolean) => void;
  darkMode: boolean;
  onToggleDarkMode: (val: boolean) => void;
}

const ToggleControls = ({
  showDetections,
  onToggleDetections,
  darkMode,
  onToggleDarkMode,
}: ToggleControlsProps) => {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex items-center gap-3">
        <Eye className="w-4 h-4 text-secondary" />
        <Label htmlFor="detections" className="text-card-foreground text-sm">
          Show Detections
        </Label>
        <Switch
          id="detections"
          checked={showDetections}
          onCheckedChange={onToggleDetections}
        />
      </div>
      <div className="flex items-center gap-3">
        <Moon className="w-4 h-4 text-secondary" />
        <Label htmlFor="darkmode" className="text-card-foreground text-sm">
          Dark Mode
        </Label>
        <Switch
          id="darkmode"
          checked={darkMode}
          onCheckedChange={onToggleDarkMode}
        />
      </div>
    </div>
  );
};

export default ToggleControls;
