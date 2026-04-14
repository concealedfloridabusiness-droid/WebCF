import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Play, Shield, Package, Siren,
  Heart, Scissors, Wind, Thermometer, Activity, ChevronDown
} from "lucide-react";

const KIT_SECTIONS = [
  {
    id: "kit-basic",
    title: "Personal Kit Assembly",
    subtitle: "Everyday Carry First Aid Kit",
    icon: Shield,
    color: "text-blue-400",
    videos: [
      { title: "Assembling Your Personal EDC First Aid Kit" },
      { title: "Tourniquet Application — Personal Kit Drill" },
      { title: "Chest Seal Placement & QuikClot Wound Packing" },
    ],
  },
  {
    id: "kit-medium",
    title: "Standard Kit Assembly",
    subtitle: "Trauma Car / Bag Kit",
    icon: Package,
    color: "text-green-400",
    videos: [
      { title: "Standard Kit Build — Full Walkthrough" },
      { title: "NPA Insertion — Airway Adjunct Training" },
      { title: "SAM Splint Application — Upper and Lower Limb" },
    ],
  },
  {
    id: "kit-advanced",
    title: "Advanced Kit Assembly",
    subtitle: "Home Station Trauma Kit — TCCC Compliant",
    icon: Siren,
    color: "text-red-400",
    videos: [
      { title: "Advanced Kit Organization — MARCH Protocol Layout" },
      { title: "Needle Chest Decompression — Concept Overview" },
      { title: "SAM Pelvic Sling Application — Pelvic Fracture Management" },
    ],
  },
];

const TECHNIQUE_SECTIONS = [
  {
    id: "tourniquet",
    title: "Tourniquet Application",
    icon: Scissors,
    color: "text-red-400",
    videos: [
      { title: "C-A-T Tourniquet — Self Application" },
      { title: "SOFTT-W Application — Two-Handed Technique" },
      { title: "Tourniquet Placement — High and Tight" },
    ],
  },
  {
    id: "wound-packing",
    title: "Wound Packing & Hemostatics",
    icon: Activity,
    color: "text-orange-400",
    videos: [
      { title: "Wound Packing with QuikClot Gauze — Step by Step" },
      { title: "Applying Pressure Bandage After Packing" },
      { title: "Junctional Wounds — Combat Gauze for Groin and Armpit" },
    ],
  },
  {
    id: "cpr",
    title: "CPR & Hands-Only Technique",
    icon: Heart,
    color: "text-pink-400",
    videos: [
      { title: "Hands-Only CPR — American Heart Association Guide" },
      { title: "CPR Rate and Depth — Getting It Right" },
      { title: "AED Use — Automated External Defibrillator Walkthrough" },
    ],
  },
  {
    id: "airway",
    title: "Airway Management",
    icon: Wind,
    color: "text-cyan-400",
    videos: [
      { title: "Recovery Position — Unconscious Casualty" },
      { title: "Nasopharyngeal Airway (NPA) — Concept and Insertion" },
      { title: "Chin Lift and Jaw Thrust — Basic Airway Techniques" },
    ],
  },
  {
    id: "hypothermia",
    title: "Hypothermia Prevention",
    icon: Thermometer,
    color: "text-yellow-400",
    videos: [
      { title: "Hypothermia Wrap — Heat Reflective Blanket Technique" },
      { title: "Field Signs of Hypothermia — Recognition and Response" },
      { title: "Wet-to-Dry — Managing Exposure Casualties" },
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

interface SplitNavButtonProps {
  label: string;
  mainPath: string;
  items: { label: string; path: string }[];
  navigate: (to: string) => void;
  testId: string;
}

function SplitNavButton({ label, mainPath, items, navigate, testId }: SplitNavButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative flex items-center" ref={ref}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => navigate(mainPath)}
        className="flex items-center gap-2 rounded-r-none border-r border-gray-700"
        data-testid={testId}
      >
        <ArrowLeft className="w-4 h-4" />
        {label}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className="rounded-l-none px-2"
        data-testid={`${testId}-chevron`}
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </Button>
      <div
        className={`absolute top-full left-0 mt-1 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 transition-all duration-100 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {items.map((item) => (
          <button
            key={item.path}
            className="flex items-center w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left"
            onClick={() => { navigate(item.path); setOpen(false); }}
            data-testid={`${testId}-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FirstAidVideosPage() {
  const [, navigate] = useLocation();

  return (
    <>
      <SEOHead
        title="First Aid Video Resources | Concealed Florida"
        description="Curated video resources for medical kit assembly, tourniquet application, wound packing, CPR, airway management, and more."
        path="/first-aid/videos"
      />
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <SplitNavButton
              label="First Aid & Skills"
              mainPath="/first-aid"
              items={[
                { label: "Personal Kit", path: "/first-aid/kit/basic"    },
                { label: "Standard Kit", path: "/first-aid/kit/medium"   },
                { label: "Advanced Kit", path: "/first-aid/kit/advanced" },
              ]}
              navigate={navigate}
              testId="button-back-first-aid"
            />
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" data-testid="heading-first-aid-videos">
              First Aid Video Resources
            </h1>
            <p className="text-gray-400 text-base max-w-2xl">
              Curated video content for medical kit assembly, trauma techniques, and life-saving skills. Content vetted before publishing — no paid promotion.
            </p>
          </div>

          {/* Kit Assembly */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-0.5 w-6 rounded-full bg-red-400" />
              <h2 className="text-2xl font-extrabold uppercase tracking-wide text-red-400">Kit Assembly</h2>
            </div>
            <p className="text-gray-500 text-sm mb-8 ml-9">Step-by-step assembly videos for each kit tier.</p>

            {KIT_SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <section key={section.id} id={section.id} className="mb-12 scroll-mt-24" data-testid={`section-videos-${section.id}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <Icon className={`w-5 h-5 ${section.color} shrink-0`} />
                    <h3 className={`text-xl font-bold ${section.color}`}>{section.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-5 ml-8">{section.subtitle}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {section.videos.map((video, i) => (
                      <PlaceholderVideoCard key={i} title={video.title} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Techniques */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-0.5 w-6 rounded-full bg-orange-400" />
              <h2 className="text-2xl font-extrabold uppercase tracking-wide text-orange-400">Trauma Techniques</h2>
            </div>
            <p className="text-gray-500 text-sm mb-8 ml-9">Tourniquet, wound packing, CPR, airway, and hypothermia management.</p>

            {TECHNIQUE_SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <section key={section.id} id={section.id} className="mb-12 scroll-mt-24" data-testid={`section-videos-${section.id}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <Icon className={`w-5 h-5 ${section.color} shrink-0`} />
                    <h3 className={`text-xl font-bold ${section.color}`}>{section.title}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {section.videos.map((video, i) => (
                      <PlaceholderVideoCard key={i} title={video.title} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

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
