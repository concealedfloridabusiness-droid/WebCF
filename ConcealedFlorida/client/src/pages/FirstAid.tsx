import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Youtube, AlertCircle, ArrowLeft, ShoppingBag, ChevronRight, Play, Shield, Package, Siren } from "lucide-react";

const firstAidResources = [
  {
    title: "Stop the Bleed",
    org: "American College of Surgeons",
    description: "Learn how to control severe bleeding in an emergency before EMS arrives. Free training courses available nationwide.",
    url: "https://www.stopthebleed.org",
    badge: "Free Training",
  },
  {
    title: "FEMA Emergency Preparedness",
    org: "FEMA",
    description: "Comprehensive guides from the Federal Emergency Management Agency on disaster readiness and response.",
    url: "https://www.ready.gov",
    badge: "Government Resource",
  },
  {
    title: "Red Cross First Aid Training",
    org: "American Red Cross",
    description: "Certified first aid, CPR, and AED courses available in person and online. Learn life-saving skills from trusted professionals.",
    url: "https://www.redcross.org/take-a-class",
    badge: "Certified Courses",
  },
  {
    title: "National Stop the Bleed Coalition",
    org: "NSTBC",
    description: "Bleeding control education resources, kit recommendations, and instructor-led courses for communities and workplaces.",
    url: "https://www.bleedingcontrol.org",
    badge: "Free Resource",
  },
];

const firstAidVideos = [
  {
    title: "How to Apply a Tourniquet",
    description: "Step-by-step tourniquet application for severe limb bleeding — a critical skill that can save a life in under 60 seconds.",
    url: "https://www.youtube.com/watch?v=H3lR-FaGLH8",
  },
  {
    title: "Wound Packing & Hemostatic Gauze",
    description: "Learn how to pack a wound effectively using hemostatic gauze to control severe bleeding in a tactical or emergency scenario.",
    url: "https://www.youtube.com/watch?v=CUhFwMvs53g",
  },
  {
    title: "Hands-Only CPR Tutorial",
    description: "American Heart Association guide to performing hands-only CPR — no certification required to save a life.",
    url: "https://www.youtube.com/watch?v=cosVBV96E2g",
  },
];

const kitTiers = [
  {
    tier: "basic",
    path: "/first-aid/kit/basic",
    label: "Personal Kit",
    subtitle: "Everyday Carry First Aid Kit",
    description:
      "Covers the three leading causes of preventable trauma death: hemorrhage, airway obstruction, and tension pneumothorax. Every concealed carrier should have one.",
    priceRange: "$120–$280",
    items: "25 items",
    forWho: "On-person EDC, purse, belt bag, desk, home",
    highlight: "C-A-T TQ · QuikClot · Chest Seals",
    icon: Shield,
    color: "text-blue-400",
    borderColor: "border-blue-900/40",
    accentBg: "bg-blue-900/10",
  },
  {
    tier: "medium",
    path: "/first-aid/kit/medium",
    label: "Standard Kit",
    subtitle: "Trauma Car / Bag Kit",
    description:
      "Adds a second tourniquet, airway adjunct, splinting, hypothermia prevention, and additional supplies. Designed for anyone operating in remote areas or as part of a prepared group.",
    priceRange: "$250–$350",
    items: "33 items",
    forWho: "Car kit, range bag, hiking, vehicle response",
    highlight: "SOFTT-W · NPA · SAM Splint",
    icon: Package,
    color: "text-green-400",
    borderColor: "border-green-900/40",
    accentBg: "bg-green-900/10",
  },
  {
    tier: "advanced",
    path: "/first-aid/kit/advanced",
    label: "Advanced Kit",
    subtitle: "Home Station Trauma Kit — Worst-Case Ready",
    description:
      "A comprehensive trauma system for TCCC-trained individuals. Covers the full MARCH protocol including needle decompression, burn care, pelvic stabilization, and hypothermia management.",
    priceRange: "$450–$700",
    items: "63 items",
    forWho: "Home station, multi-person household, grid-down",
    highlight: "NCD Kit · SAM Pelvic Sling · HPMK",
    icon: Siren,
    color: "text-red-400",
    borderColor: "border-red-900/40",
    accentBg: "bg-red-900/10",
  },
];

export default function FirstAid() {
  const [, navigate] = useLocation();
  return (
    <>
      <SEOHead
        title="First Aid & Skills | We Are Ready | Concealed Florida"
        description="Life-saving first aid skills, free training resources, and instructional videos for emergency preparedness."
        path="/first-aid"
      />
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">

          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/we-are-ready")}
              data-testid="button-back-we-are-ready"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              We Are Ready
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/first-aid/videos")}
              data-testid="button-video-resources-first-aid"
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Video Resources
            </Button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 mt-2" data-testid="heading-first-aid">
            First Aid & Skills
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-3xl">
            These are trusted, free resources for learning life-saving skills. Stop the Bleed, CPR, and wound care are core competencies for anyone serious about readiness.
          </p>

          {/* Featured Video */}
          <div className="mb-12 rounded-md border border-red-900/40 bg-red-900/10 overflow-hidden" data-testid="video-first-aid">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src="https://www.youtube.com/embed/O9XNFW4DBYk?start=27"
                title="First Aid & Skills — Featured"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>

          <div className="space-y-12">

            {/* Medical Kit Builder */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ShoppingBag className="w-5 h-5 text-gray-400" />
                <h2 className="text-2xl font-bold text-white">Build Your Medical Kit</h2>
              </div>
              <p className="text-gray-300 text-sm mb-6 max-w-3xl">
                Every item sourced from North American Rescue, Tactical Medical Solutions, SAM Medical, and other verified military and TCCC-approved vendors — not cheap knockoffs. Choose your kit level below.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {kitTiers.map((kit) => {
                  const Icon = kit.icon;
                  return (
                    <button
                      key={kit.tier}
                      data-testid={`card-kit-${kit.tier}`}
                      onClick={() => navigate(kit.path)}
                      className={`border ${kit.borderColor} ${kit.accentBg} rounded-md text-left cursor-pointer w-full flex flex-col gap-5 p-6 hover-elevate active-elevate-2 transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-md flex items-center justify-center bg-black/30 border ${kit.borderColor}`}>
                          <Icon className={`w-6 h-6 ${kit.color}`} />
                        </div>
                        <div>
                          <p className="text-white text-2xl font-bold leading-tight">{kit.label}</p>
                          <p className={`text-xs mt-0.5 ${kit.color}`}>{kit.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-base leading-relaxed flex-1">{kit.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">{kit.items}</Badge>
                        <Badge variant="secondary" className="text-xs">{kit.priceRange}</Badge>
                        <Badge variant="secondary" className="text-xs">{kit.forWho}</Badge>
                      </div>
                      <div className={`w-full flex items-center justify-center gap-2 rounded-md py-3 font-semibold text-base bg-white/5 border ${kit.borderColor} ${kit.color} hover:bg-white/10 transition-colors`}>
                        Build {kit.label}
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Free Training Resources */}
            <div className="border-t border-border pt-10">
              <h2 className="text-2xl font-bold text-white mb-6">Free Training Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {firstAidResources.map((resource) => (
                  <Card key={resource.title} className="bg-secondary border-border flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <CardTitle className="text-white text-base">{resource.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs shrink-0">{resource.badge}</Badge>
                      </div>
                      <p className="text-gray-300 text-sm">{resource.org}</p>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 gap-4">
                      <p className="text-gray-300 text-sm">{resource.description}</p>
                      <div className="mt-auto">
                        <Button variant="secondary" size="sm" asChild className="w-full">
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" data-testid={`link-resource-${resource.title.toLowerCase().replace(/\s+/g, "-")}`}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit Resource
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Instructional Videos */}
            <div className="border-t border-border pt-10">
              <h2 className="text-2xl font-bold text-white mb-2">Instructional Videos</h2>
              <p className="text-gray-300 mb-6">
                Watch these before you need them. These skills take minutes to learn and can save a life.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {firstAidVideos.map((video) => (
                  <Card key={video.title} className="bg-secondary border-border flex flex-col">
                    <CardHeader>
                      <div className="flex items-start gap-2">
                        <Youtube className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                        <CardTitle className="text-white text-base">{video.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 gap-4">
                      <p className="text-gray-300 text-sm">{video.description}</p>
                      <div className="mt-auto">
                        <Button variant="secondary" size="sm" asChild className="w-full">
                          <a href={video.url} target="_blank" rel="noopener noreferrer" data-testid={`link-firstaid-video-${video.title.toLowerCase().replace(/\s+/g, "-").slice(0, 20)}`}>
                            <Youtube className="w-4 h-4 mr-2" />
                            Watch Video
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-secondary border border-border rounded-md p-4 flex gap-3 items-start">
              <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <p className="text-gray-300 text-sm">
                This content is for educational purposes only and does not substitute for certified medical training. We strongly encourage completing an in-person course with a qualified instructor.
              </p>
            </div>

          </div>
        </div>
      </Layout>
    </>
  );
}
