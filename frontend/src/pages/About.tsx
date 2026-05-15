import Navbar from "@/components/Navbar";
import {
  Target, Users, Globe,
  Upload, Cpu, BarChart3, Mail, MapPin,
  ArrowDown, ChevronRight,
} from "lucide-react";

const About = () => {
  const features = [
    { icon: Target, title: "AI Detection", desc: "Advanced computer vision models identify plastic waste in real-time from uploaded images." },
    { icon: Users, title: "Citizen Reporting", desc: "Empowering communities to report pollution directly to municipal authorities." },
    { icon: Globe, title: "Smart City Integration", desc: "Seamless integration with municipal systems for faster resolution and cleaner cities." },
  ];

  const workflowSteps = [
    {
      icon: Upload,
      step: "01",
      title: "Image Upload",
      desc: "User captures or uploads a photo of plastic waste from their surroundings.",
      detail: "Supports JPEG, PNG formats via the web interface",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Cpu,
      step: "02",
      title: "AI Analysis",
      desc: "The image is sent to our backend where a Roboflow-trained object detection model identifies and localizes each plastic item.",
      detail: "Uses inference-sdk to communicate with Roboflow's serverless API",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: BarChart3,
      step: "03",
      title: "PPI Calculation",
      desc: "A weighted Plastic Pollution Index is computed using 4 factors: item count (35%), coverage area (40%), density factor (15%), and detection confidence (10%).",
      detail: "Score normalized to 0–100, classified as Low / Medium / High severity",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Mail,
      step: "04",
      title: "Automated Reporting",
      desc: "Citizens fill in their city and optional details. An email report with PPI score, severity, and Google Maps location is auto-sent to the mapped municipal authority.",
      detail: "City-to-authority email mapping for targeted notifications",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: MapPin,
      step: "05",
      title: "Hotspot Detection",
      desc: "All report locations are plotted on an interactive map. When 5 or more reports cluster in a geographic area, it is automatically declared a pollution hotspot.",
      detail: "Helps authorities prioritize cleanup in high-density zones",
      color: "from-red-500 to-rose-500",
    },
  ];

  const techStack = [
    { label: "Frontend", items: "React, TypeScript, Tailwind CSS, Recharts, Leaflet" },
    { label: "Backend", items: "FastAPI, Python, Uvicorn" },
    { label: "AI / ML", items: "Roboflow Inference SDK, Object Detection Model" },
    { label: "Deployment", items: "Vercel (Frontend), Render (Backend)" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="gradient-hero py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            About EcoSpectra
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Building a cleaner future through AI-powered pollution detection and citizen engagement.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Feature Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-elevated p-8 hover-lift text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto">
                  <Icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-display text-xl font-bold text-card-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works — Workflow ────────────────── */}
        <section>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-secondary uppercase tracking-widest mb-2">
              System Workflow
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              How EcoSpectra Works
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              From a single photo to municipal action — here's the end-to-end pipeline
              that powers our plastic pollution detection system.
            </p>
          </div>

          {/* Desktop: alternating timeline */}
          <div className="hidden md:block relative">
            {/* Vertical connector line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

            <div className="space-y-0">
              {workflowSteps.map((s, i) => {
                const Icon = s.icon;
                const isLeft = i % 2 === 0;

                return (
                  <div key={s.step} className="relative flex items-center min-h-[180px]">
                    {/* Center node */}
                    <div className="absolute left-1/2 -translate-x-1/2 z-10 w-14 h-14 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-muted-foreground">{s.step}</span>
                    </div>

                    {/* Left half */}
                    <div className={`w-1/2 ${isLeft ? "pr-16 text-right" : ""}`}>
                      {isLeft && (
                        <div className="card-elevated p-6 hover-lift space-y-3 inline-block text-left max-w-md ml-auto">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${s.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                            Step {s.step}
                          </div>
                          <h3 className="font-display text-lg font-bold text-card-foreground">{s.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                          <p className="text-xs text-muted-foreground/70 italic flex items-center gap-1.5">
                            <ChevronRight className="w-3 h-3 flex-shrink-0" />
                            {s.detail}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right half */}
                    <div className={`w-1/2 ${!isLeft ? "pl-16" : ""}`}>
                      {!isLeft && (
                        <div className="card-elevated p-6 hover-lift space-y-3 max-w-md">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${s.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                            Step {s.step}
                          </div>
                          <h3 className="font-display text-lg font-bold text-card-foreground">{s.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                          <p className="text-xs text-muted-foreground/70 italic flex items-center gap-1.5">
                            <ChevronRight className="w-3 h-3 flex-shrink-0" />
                            {s.detail}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: vertical cards with arrows */}
          <div className="md:hidden space-y-2">
            {workflowSteps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.step}>
                  <div className="card-elevated p-5 space-y-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${s.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      Step {s.step}
                    </div>
                    <h3 className="font-display text-lg font-bold text-card-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    <p className="text-xs text-muted-foreground/70 italic flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 flex-shrink-0" />
                      {s.detail}
                    </p>
                  </div>
                  {i < workflowSteps.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Tech Stack ────────────────────────────── */}
        <section>
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-secondary uppercase tracking-widest mb-2">
              Built With
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground">
              Technology Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {techStack.map((t) => (
              <div key={t.label} className="card-elevated p-5 space-y-2 hover-lift">
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
                  {t.label}
                </p>
                <p className="text-sm text-card-foreground font-medium leading-relaxed">
                  {t.items}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default About;
