import Navbar from "@/components/Navbar";
import { Leaf, Target, Users, Globe } from "lucide-react";

const About = () => {
  const features = [
    { icon: Target, title: "AI Detection", desc: "Advanced computer vision models identify plastic waste in real-time from uploaded images." },
    { icon: Users, title: "Citizen Reporting", desc: "Empowering communities to report pollution directly to municipal authorities." },
    { icon: Globe, title: "Smart City Integration", desc: "Seamless integration with municipal systems for faster resolution and cleaner cities." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="gradient-hero py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            About EcoDetect
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Building a cleaner future through AI-powered pollution detection and citizen engagement.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
      </main>
    </div>
  );
};

export default About;
