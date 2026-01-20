import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LiveGrid from "@/components/LiveGrid";
import FeaturedStreamers from "@/components/FeaturedStreamers";
import DownloadCTA from "@/components/DownloadCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <LiveGrid />
      <FeaturedStreamers />
      <DownloadCTA />
      <Footer />
    </div>
  );
};

export default Index;
