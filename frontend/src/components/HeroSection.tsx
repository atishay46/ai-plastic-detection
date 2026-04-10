import { useState, useEffect } from "react";

const quotes = [
  '"It\'s just a single plastic bottle..." — said 1 billion people.',
  '"Report the plastic trash you find to the municipal corporation."',
  '"Plastic can take hundreds of years to decompose, harming ecosystems for generations."',
];

const HeroSection = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative gradient-hero-animated overflow-hidden">
      {/* Subtle wave overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,60 1440,60 L1440,120 L0,120 Z"
            fill="white"
            className="animate-pulse"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center space-y-6">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight animate-fade-in-up">
            EcoSpectra
          </h1>

          <p className="text-lg md:text-4xl font-semibold text-primary-foreground/90 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            AI-Powered Plastic Pollution Detection & Reporting System
          </p>

          <p className="text-base md:text-2xl text-primary-foreground/70 max-w-2xl mx-auto animate-fade-in-up italic" style={{ animationDelay: "0.3s" }}>
            Detect. Analyze. Act for a Cleaner Tomorrow.
          </p>

          {/* Animated quotes — enlarged, bold, gradient */}
          <div className="h-20 md:h-16 flex items-center justify-center mt-6">
            {quotes.map((quote, i) => (
              <p
                key={i}
                className={`absolute text-lg md:text-xl lg:text-2xl font-bold quote-gradient max-w-3xl px-4 transition-all duration-700 ${i === currentQuote
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                  }`}
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {quote}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
