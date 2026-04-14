import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import pantherLogo from "@assets/IMG_3356_1760656536659.jpg";

const sections = [
  {
    title: "Training",
    path: "/fitness",
    description:
      "Physical fitness standards by age group and gender, plus firearm training fundamentals — concealed carry, home defense, EDC, dry fire, and pistol fundamentals — for the fully prepared Florida resident.",
  },
  {
    title: "First Aid & Skills",
    path: "/first-aid",
    description:
      "Life-saving skills every prepared person must know. Stop the bleed, CPR, wound care, and trusted free training resources from nationally recognized organizations.",
  },
  {
    title: "Preparedness",
    path: "/preparedness",
    description:
      "Hurricanes, floods, civil unrest, and grid failures. Planning checklists, gear and supply lists, water and food security, power systems, and the mindset to stay functional when everything else breaks down.",
  },
];

export default function WeAreReady() {
  return (
    <>
      <SEOHead
        title="We Are Ready | Concealed Florida"
        description="Physical fitness, first aid skills, and mental preparedness for responsible Floridians."
        path="/we-are-ready"
      />
      <Layout>
        <div className="relative min-h-[calc(100vh-200px)] flex flex-col items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-15 blur-[2px]"
            style={{ backgroundImage: `url(${pantherLogo})`, backgroundSize: "1500px" }}
          />

          <div className="relative z-10 container mx-auto px-4 py-16">
            <div className="text-center mb-20">
              <h1 className="text-white text-6xl md:text-7xl font-bold tracking-tight" data-testid="heading-we-are-ready">
                We Are Ready
              </h1>
              <p className="text-gray-300 text-lg mt-4 max-w-2xl mx-auto">
                Physical fitness, life-saving skills, and the mindset to protect those you love.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {sections.map((section) => (
                <div key={section.path} className="text-center">
                  <Button
                    data-testid={`button-${section.title.toLowerCase().replace(/\s+/g, "-")}`}
                    variant="secondary"
                    size="lg"
                    className="w-full min-h-16 text-lg font-semibold hover:bg-gray-600 transition-colors"
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
            <div className="mt-16 flex justify-center">
              <div className="w-full max-w-sm rounded-md border border-white/10 overflow-hidden" data-testid="video-we-are-ready">
                <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                  <iframe
                    src="https://www.youtube.com/embed/eXxLYVGIQnM"
                    title="We Are Ready — Overview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
