import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Leaf } from "lucide-react";
import Navbar from "@/components/Navbar";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      sessionStorage.setItem("eco-auth", "true");
      navigate("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="card-elevated p-8 w-full max-w-md space-y-6 animate-fade-in-up">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto">
              <Leaf className="w-7 h-7 text-accent-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-card-foreground">
              Authority Login
            </h2>
            <p className="text-sm text-muted-foreground">
              Municipal dashboard access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-card-foreground">Username</Label>
              <Input
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder="admin"
                className="bg-card-foreground/5 border-border text-card-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-card-foreground">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className="bg-card-foreground/5 border-border text-card-foreground"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold">
              <Lock className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
