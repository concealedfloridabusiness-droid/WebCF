import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import pantherLogo from "@assets/IMG_3356_1760656536659.jpg";

const sections = [
  {
    title: "Situation Room",
    path: "/we-are-watching/map",
    description:
      "Interactive crime, disaster, and environmental awareness map for Florida.",
  },
  {
    title: "Liberty Watch",
    path: "/we-are-watching/news",
    description:
      "Stay current on Second Amendment news, legislation, and updates from trusted experts.",
  },
  {
    title: "Situational Awareness",
    path: "/we-are-watching/awareness",
    description:
      "The Cooper Color Code, environment-specific awareness tips, international travel safety, embassy registration, de-escalation, and mindset habits for staying alert anywhere.",
  },
];

export default function WeAreWatching() {
  return (
    <>
      <SEOHead
        title="We Are Watching | Concealed Florida"
        description="Know your area, stay current on 2A news, and sharpen your situational awareness as a prepared Floridian."
        path="/we-are-watching"
      />
      <Layout>
        <div className="relative min-h-[calc(100vh-200px)] flex flex-col items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-15 blur-[2px]"
            style={{ backgroundImage: `url(${pantherLogo})`, backgroundSize: "1500px" }}
          />

          <div className="relative z-10 container mx-auto px-4 py-16">
            <div className="text-center mb-20">
              <h1
                className="text-white text-6xl md:text-7xl font-bold tracking-tight"
                data-testid="heading-we-are-watching"
              >
                We Are Watching
              </h1>
              <p className="text-gray-300 text-lg mt-4 max-w-2xl mx-auto">
                Situational awareness, local intelligence, and staying current on what matters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {sections.map((section) => (
                <div key={section.path} className="text-center">
                  <Button
                    data-testid={`button-${section.title.toLowerCase().replace(/\s+/g, "-")}`}
                    variant="secondary"
                    size="lg"
                    className="w-full min-h-16 text-lg font-semibold hover:bg-gray-600 transition-colors py-5 h-auto"
                    asChild
                  >
                    <Link href={section.path}>
                      <a>{section.title}</a>
                    </Link>
                  </Button>
                  <p className="text-gray-300 mt-4 text-base leading-relaxed">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Featured Video */}
            <div className="mt-16 max-w-6xl mx-auto rounded-md border border-white/10 overflow-hidden" data-testid="video-we-are-watching">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src="https://www.youtube.com/embed/b5oR4P3dFp4"
                  title="We Are Watching — Overview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
