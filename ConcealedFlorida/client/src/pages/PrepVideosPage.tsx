import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Axe, Droplets, ShoppingCart, Zap, Radio, AlertCircle } from "lucide-react";

const SECTIONS = [
  {
    id: "situation",
    title: "Priority Gear by Situation",
    icon: AlertCircle,
    color: "text-orange-400",
    videos: [
      { title: "Hurricane Preparedness Gear Guide" },
      { title: "Earthquake Survival Kit Essentials" },
      { title: "Flood Emergency Priorities" },
    ],
  },
  {
    id: "tools",
    title: "Tools & Equipment",
    icon: Axe,
    color: "text-orange-400",
    videos: [
      { title: "Multi-Tool Selection and Setup" },
      { title: "Emergency Axe and Cutting Techniques" },
      { title: "Post-Disaster Debris Clearing Basics" },
    ],
  },
  {
    id: "water",
    title: "Water Security",
    icon: Droplets,
    color: "text-cyan-400",
    videos: [
      { title: "Water Filtration Methods Compared" },
      { title: "Long-Term Water Storage Best Practices" },
      { title: "Emergency Water Purification Techniques" },
    ],
  },
  {
    id: "food",
    title: "Food Storage",
    icon: ShoppingCart,
    color: "text-green-400",
    videos: [
      { title: "72-Hour Emergency Food Planning" },
      { title: "Long-Term Food Preservation Methods" },
      { title: "Caloric Requirements in Emergencies" },
    ],
  },
  {
    id: "power",
    title: "Power Systems",
    icon: Zap,
    color: "text-yellow-400",
    videos: [
      { title: "Generator Selection and Maintenance" },
      { title: "Solar Power for Emergency Preparedness" },
      { title: "Battery Banks and Portable Power Options" },
    ],
  },
  {
    id: "comms",
    title: "Communication Equipment",
    icon: Radio,
    color: "text-blue-400",
    videos: [
      { title: "NOAA Weather Radio Basics" },
      { title: "Ham Radio for Preppers — Getting Started" },
      { title: "Emergency Communication Planning Guide" },
    ],
  },
];

function PlaceholderVideoCard({ title }: { title: string }) {
  return (
    <Card className="bg-secondary border-secondary overflow-hidden">
      <div className="relative bg-black/50 border-b border-border" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center">
            <Play className="w-4 h-4 text-white/30 ml-0.5" />
          </div>
        </div>
      </div>
      <CardContent className="pt-3 pb-4 px-3">
        <p className="text-white/50 text-sm font-medium leading-snug line-clamp-2">{title}</p>
        <p className="text-gray-600 text-xs mt-1">Coming soon</p>
      </CardContent>
    </Card>
  );
}

export default function PrepVideosPage() {
  const [, navigate] = useLocation();

  return (
    <>
      <SEOHead
        title="Prepping Video Resources | Concealed Florida"
        description="Curated video resources for emergency preparedness — gear, water, food, power, and communications."
        path="/preparedness/prepping/videos"
      />
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/preparedness/prepping")}
              className="flex items-center gap-2"
              data-testid="button-back-prepping"
            >
              <ArrowLeft className="w-4 h-4" />
              Prepping
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/we-are-watching/news")}
              className="flex items-center gap-2"
              data-testid="button-back-liberty-watch"
            >
              <ArrowLeft className="w-4 h-4" />
              Liberty Watch
            </Button>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" data-testid="heading-prep-videos">
              Prepping Video Resources
            </h1>
            <p className="text-gray-400 text-base max-w-2xl">
              Curated video resources for each preparedness category. Content added as it's vetted — no paid promotion.
            </p>
          </div>

          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <section
                key={section.id}
                id={section.id}
                className="mb-14 scroll-mt-24"
                data-testid={`section-videos-${section.id}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <Icon className={`w-5 h-5 ${section.color} shrink-0`} />
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {section.videos.map((video, i) => (
                    <PlaceholderVideoCard key={i} title={video.title} />
                  ))}
                </div>
              </section>
            );
          })}

          <div className="border-t border-gray-800 pt-8 mt-4">
            <p className="text-gray-600 text-xs text-center">
              All video recommendations are curated independently. No paid promotion.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}
