import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";

const cities = ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"];

export interface UserFormData {
  name: string;
  phone: string;
  email: string;
  state: string;
  city: string;
}

interface UserFormProps {
  formData: UserFormData;
  onChange: (data: UserFormData) => void;
}

const UserForm = ({ formData, onChange }: UserFormProps) => {
  const update = (field: keyof UserFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="card-elevated p-6">
      <h3 className="font-display text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-secondary" />
        Reporter Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-card-foreground text-sm">Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
            className="bg-card-foreground/5 border-border text-card-foreground"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-card-foreground text-sm">Phone Number</Label>
          <Input
            value={formData.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="Phone number"
            className="bg-card-foreground/5 border-border text-card-foreground"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-card-foreground text-sm">Email</Label>
          <Input
            value={formData.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="Email address"
            type="email"
            className="bg-card-foreground/5 border-border text-card-foreground"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-card-foreground text-sm">State</Label>
          <Input value="Maharashtra" disabled className="bg-card-foreground/5 border-border text-card-foreground" />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-card-foreground text-sm">City</Label>
          <Select value={formData.city} onValueChange={(v) => update("city", v)}>
            <SelectTrigger className="bg-card-foreground/5 border-border text-card-foreground">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
