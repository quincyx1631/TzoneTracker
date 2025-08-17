import { useNavigate } from "react-router-dom";
import { LandingHeader } from "./LandingHeader";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { SocialProof } from "./SocialProof";
import { CTASection } from "./CTASection";
import { Footer } from "./Footer";

export function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader onGetStarted={handleGetStarted} />
      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        <FeaturesSection />
        <SocialProof />
        <CTASection onGetStarted={handleGetStarted} />
      </main>
      <Footer />
    </div>
  );
}
