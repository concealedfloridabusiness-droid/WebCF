import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, Play, BookOpen, Package, Radio,
  ExternalLink, AlertCircle, ChevronRight
} from "lucide-react";

const preparednessResources = [
  {
    title: "FEMA Emergency Preparedness Guide",
    description: "Federal Emergency Management Agency's official preparedness framework. Build a kit, make a plan, be informed.",
    url: "https://www.ready.gov",
    badge: "Government",
  },
  {
    title: "Red Cross Disaster Preparedness",
    description: "End-to-end disaster preparedness training resources including family planning guides and supply checklists.",
    url: "https://www.redcross.org/get-help/how-to-prepare-for-emergencies.html",
    badge: "Certified Resource",
  },
  {
    title: "Florida Division of Emergency Management",
    description: "Official Florida preparedness resources, evacuation zones, shelter locators, and county-level emergency management contacts.",
    url: "https://www.floridadisaster.org",
    badge: "State Resource",
  },
  {
    title: "FEMA Ready.gov — Build A Kit",
    description: "The federally recommended emergency supply kit standards. Covers water, food, tools, documents, medications, and special needs.",
    url: "https://www.ready.gov/kit",
    badge: "Free Resource",
  },
  {
    title: "NOAA National Hurricane Center",
    description: "Real-time Atlantic storm tracking, 5-day cone forecasts, and official warnings. The definitive authority for hurricane data — bookmark before June 1.",
    url: "https://www.nhc.noaa.gov",
    badge: "Live Data",
  },
  {
    title: "USGS Earthquake Hazards Program",
    description: "Live earthquake map, significant event feeds, and hazard assessments for the US. Updated continuously from seismograph networks nationwide.",
    url: "https://earthquake.usgs.gov",
    badge: "Live Data",
  },
  {
    title: "NASA FIRMS — Active Wildfire Monitor",
    description: "Satellite-detected wildfires across the US updated every 2 hours from MODIS and VIIRS sensors. The same source powering our Situation Room Map.",
    url: "https://firms.modaps.eosdis.nasa.gov/map/",
    badge: "Live Data",
  },
  {
    title: "CISA — Infrastructure & Cyber Alerts",
    description: "Cybersecurity and critical infrastructure security alerts from the Cybersecurity and Infrastructure Security Agency. Covers power, water, and communications threats.",
    url: "https://www.cisa.gov/topics/emergency-communications",
    badge: "Government",
  },
  {
    title: "ODIN — National Power Outage Monitor",
    description: "Real-time county-level power outage data from Oak Ridge National Laboratory / US Department of Energy Office of Electricity. Updated every 15 minutes.",
    url: "https://ornl.opendatasoft.com/explore/dataset/odin-real-time-outages-county",
    badge: "Live Data",
  },
  {
    title: "InciWeb — Wildfire Incident Map",
    description: "Official interagency wildfire perimeters, evacuation orders, and incident updates managed by the National Interagency Fire Center.",
    url: "https://inciweb.wildfire.gov",
    badge: "Government",
  },
];

const pillars = [
  {
    title: "Planning",
    subtitle: "Emergency Scenario Plans",
    path: "/preparedness/planning",
    icon: BookOpen,
    color: "text-blue-400",
    borderColor: "border-blue-900/40",
    accentBg: "bg-blue-900/10",
    summary: "Scenario-specific action plans for hurricanes, floods, power outages, civil unrest, and family separation — with downloadable, editable templates and military planning frameworks built in.",
  },
  {
    title: "Prepping",
    subtitle: "Gear, Water, Food & Power",
    path: "/preparedness/prepping",
    icon: Package,
    color: "text-green-400",
    borderColor: "border-green-900/40",
    accentBg: "bg-green-900/10",
    summary: "The right tools, water, food, power, and communication gear organized by priority tier — Essential, Recommended, and Optional — with operation notes and verified sources for every item.",
  },
  {
    title: "Communication",
    subtitle: "Comms, OODA & Mental Readiness",
    path: "/preparedness/communication",
    icon: Radio,
    color: "text-yellow-400",
    borderColor: "border-yellow-900/40",
    accentBg: "bg-yellow-900/10",
    summary: "How to communicate clearly under stress, reach emergency services, use national and international radio frequencies, and the OODA Loop mental framework that makes every other skill usable when it counts.",
  },
];

export default function PreparednessOverview() {
  const [, navigate] = useLocation();

  return (
    <>
      <SEOHead
        title="Preparedness | We Are Ready | Concealed Florida"
        description="Planning, prepping, and communication — the full preparedness framework for hurricanes, floods, civil unrest, and long-term survival situations."
        path="/preparedness"
      />
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/we-are-ready")}
            data-testid="button-back-we-are-ready"
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            We Are Ready
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 mt-2" data-testid="heading-preparedness">
            Preparedness
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-3xl">
            Hurricanes. Floods. Power grid failures. Civil unrest. The question is not whether Florida will face another major emergency — it is whether you will be ready when it arrives. Plan, prep, and communicate like your life depends on it, because one day it will.
          </p>

          {/* Featured Video */}
          <div className="mb-12 rounded-md border border-white/10 overflow-hidden" data-testid="video-preparedness">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src="https://www.youtube.com/embed/i6NUOz95CSc"
                title="Preparedness — Overview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>

          {/* Three Pillars */}
          <section className="mb-12" data-testid="section-pillars">
            <h2 className="text-2xl font-bold text-white mb-2">The Three Pillars</h2>
            <p className="text-gray-300 text-sm mb-6">
              Complete preparedness requires all three. Planning without supplies fails in execution. Supplies without a plan sit in boxes unused. Both fail without the mental and communication foundation to act under stress.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <button
                    key={pillar.title}
                    data-testid={`card-pillar-${pillar.title.toLowerCase()}`}
                    onClick={() => navigate(pillar.path)}
                    className={`border ${pillar.borderColor} ${pillar.accentBg} rounded-md text-left cursor-pointer w-full flex flex-col gap-5 p-6 hover-elevate active-elevate-2 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-md flex items-center justify-center bg-black/30 border ${pillar.borderColor} shrink-0`}>
                        <Icon className={`w-6 h-6 ${pillar.color}`} />
                      </div>
                      <div>
                        <p className="text-white text-2xl font-bold leading-tight">{pillar.title}</p>
                        <p className={`text-xs mt-0.5 ${pillar.color}`}>{pillar.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-base leading-relaxed flex-1">{pillar.summary}</p>
                    <div className={`w-full flex items-center justify-center gap-2 rounded-md py-3 font-semibold text-base bg-white/5 border ${pillar.borderColor} ${pillar.color} hover:bg-white/10 transition-colors`}>
                      Go to {pillar.title}
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Resources */}
          <section className="mb-10" data-testid="section-resources">
            <h2 className="text-2xl font-bold text-white mb-2">Verified Official Resources</h2>
            <p className="text-gray-300 text-sm mb-5">
              Every recommendation on this site is backed by a verified government or non-profit source. These are the primary authorities — click any card to go directly to the official resource.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {preparednessResources.map((r) => (
                <a
                  key={r.title}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  data-testid={`card-resource-${r.title.toLowerCase().replace(/\s+/g, "-").slice(0, 20)}`}
                >
                  <Card className="bg-secondary border-secondary h-full hover-elevate cursor-pointer">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="text-white font-semibold text-sm">{r.title}</p>
                            <span className="text-gray-500 text-xs border border-gray-700 rounded px-1.5 py-0.5 shrink-0">{r.badge}</span>
                          </div>
                          <p className="text-gray-300 text-xs leading-relaxed">{r.description}</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </section>

          <div className="bg-secondary border border-secondary rounded-lg p-4 flex gap-3 items-start">
            <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Preparedness is a process, not a purchase. Start with 72 hours, then build to 30 days, then 90. No single purchase makes you prepared — consistent planning and practice over time does. The information on this site is organized to help you build that systematically.
            </p>
          </div>

        </div>
      </Layout>
    </>
  );
}
