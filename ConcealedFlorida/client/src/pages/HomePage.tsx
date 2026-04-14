import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import pantherLogo from "@assets/IMG_3356_1760656536659.jpg";

export default function HomePage() {
  const features = [
    {
      title: "We Are Ready",
      path: "/we-are-ready",
      description: "Master physical fitness, life-saving skills like CPR and stop-the-bleed training, plus hand-to-hand combat and firearms proficiency to defend and protect your friends and family.",
    },
    {
      title: "We Are Watching",
      path: "/we-are-watching",
      description: "Develop situational awareness, understand local laws, and stay alert to potential threats in your environment for safe and responsible citizenship.",
    },
    {
      title: "We Are Hiding in Plain Sight",
      path: "/we-are-hiding",
      description: "Learn about practical everyday-carry gear and discreet tools that provide security without drawing attention while blending into daily life.",
    },
  ];

  return (
    <>
      <SEOHead 
        title="Concealed Florida - Preparedness & Awareness"
        description="Your resource for physical readiness, situational awareness, and everyday-carry preparedness in Florida."
        path="/"
      />
      <Layout>
        <div className="relative min-h-[calc(100vh-200px)] flex flex-col items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-15 blur-[2px]"
            style={{ backgroundImage: `url(${pantherLogo})`, backgroundSize: '1500px' }}
          />

          <div className="relative z-10 container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h1 className="text-white text-7xl font-bold tracking-tight" data-testid="text-company-name">
                Concealed Florida
              </h1>
            </div>

            <div className="flex justify-center mb-12">
              <div className="w-full max-w-2xl rounded-md border border-white/10 overflow-hidden" data-testid="video-channel-welcome">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src="https://www.youtube.com/embed/wcNehVwTzb4"
                    title="Concealed Florida — Who We Are"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {features.map((feature) => {
                return (
                  <div key={feature.path} className="text-center">
                    <Button
                      data-testid={`button-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
                      variant="secondary"
                      size="lg"
                      className="w-full min-h-16 text-lg font-semibold hover:bg-gray-600 transition-colors"
                      asChild
                    >
                      <Link href={feature.path}>
                        <a>
                          {feature.title}
                        </a>
                      </Link>
                    </Button>
                    <p className="text-gray-400 mt-4 text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
