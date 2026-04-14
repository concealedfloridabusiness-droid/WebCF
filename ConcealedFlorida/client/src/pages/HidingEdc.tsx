import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Youtube, AlertCircle, Play, Package, Flashlight, PocketKnife, HeartPulse, Radio, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const edcGear = [
  {
    category: "Lights",
    icon: Flashlight,
    color: "text-yellow-400",
    borderColor: "border-yellow-900/40",
    accentBg: "bg-yellow-900/10",
    intro: "A quality light is your most versatile tool. In Florida's power-outage-prone environment, low-light situations are more common than most people expect. A dedicated tactical light is non-negotiable EDC.",
    items: [
      {
        name: "Streamlight ProTac HL-X",
        type: "Tactical Flashlight",
        review: "1000 lumens in a compact package. USB rechargeable, dual fuel capable, and built to survive serious abuse. One of the best value tactical lights available.",
        bestFor: "Everyday pocket carry, vehicle, home defense",
        url: "https://www.streamlight.com",
        videoUrl: "https://www.youtube.com/results?search_query=Streamlight+ProTac+review",
      },
      {
        name: "Olight Warrior Mini 2",
        type: "Compact EDC Light",
        review: "1750 lumens in a palm-sized form factor. Magnetic charging, proximity sensor, and a dedicated tactical tail switch. Exceptional for its size.",
        bestFor: "Pocket carry, general EDC",
        url: "https://www.olightstore.com",
        videoUrl: "https://www.youtube.com/results?search_query=Olight+Warrior+Mini+2+review",
      },
    ],
  },
  {
    category: "Knives",
    icon: PocketKnife,
    color: "text-blue-400",
    borderColor: "border-blue-900/40",
    accentBg: "bg-blue-900/10",
    intro: "A quality folding knife is a utility tool first — and a last-resort defensive option when nothing else is available. Florida has no blade length restriction for folding knives carried in a pocket.",
    items: [
      {
        name: "Spyderco Paramilitary 2",
        type: "Folding Knife",
        review: "The benchmark for EDC folder performance. CPM S30V steel holds an exceptional edge. Lightweight, reliable, and discreet enough for daily use. Legal in Florida.",
        bestFor: "General EDC, utility, backup defense",
        url: "https://www.spyderco.com",
        videoUrl: "https://www.youtube.com/results?search_query=Spyderco+Paramilitary+2+review",
      },
      {
        name: "Benchmade Griptilian",
        type: "Folding Knife",
        review: "American-made with AXIS lock mechanism — one of the most reliable lock systems available. Ambidextrous and ergonomic. A lifetime tool.",
        bestFor: "Daily utility, professional carry",
        url: "https://www.benchmade.com",
        videoUrl: "https://www.youtube.com/results?search_query=Benchmade+Griptilian+review",
      },
    ],
  },
  {
    category: "Med Kits",
    icon: HeartPulse,
    color: "text-red-400",
    borderColor: "border-red-900/40",
    accentBg: "bg-red-900/10",
    intro: "You are more likely to need trauma medical care than to need your firearm. A CAT tourniquet and pressure bandage have saved more lives than any other single piece of gear. Carry medical. No excuses.",
    items: [
      {
        name: "IFAK Trauma Kit",
        type: "Individual First Aid Kit",
        review: "Compact MOLLE-compatible pouch with tourniquet, hemostatic gauze, pressure bandage, and nitrile gloves. Designed to treat gunshot wounds and severe trauma in the field.",
        bestFor: "Vehicle, range bag, everyday carry in backpack",
        url: "https://www.narescue.com",
        videoUrl: "https://www.youtube.com/results?search_query=IFAK+trauma+kit+setup",
      },
      {
        name: "Pocket Med Kit",
        type: "Compact EDC Med",
        review: "Ultra-minimal kit containing a CAT tourniquet, compressed gauze, and nitrile gloves in a flat pouch. Fits in any cargo pocket or bag. No excuses not to carry one.",
        bestFor: "True pocket EDC, minimalist carry",
        url: "https://www.darkangelmedicaltactical.com",
        videoUrl: "https://www.youtube.com/results?search_query=pocket+trauma+kit+EDC",
      },
    ],
  },
  {
    category: "Communications",
    icon: Radio,
    color: "text-purple-400",
    borderColor: "border-purple-900/40",
    accentBg: "bg-purple-900/10",
    intro: "When cellular networks fail — during hurricanes, emergencies, or grid events — your ability to communicate becomes critical. Satellite communicators and ham radio provide resilience your phone cannot.",
    items: [
      {
        name: "Garmin inReach Mini 2",
        type: "Satellite Communicator",
        review: "Two-way satellite messaging anywhere on Earth — no cell signal required. SOS capability, GPS tracking, and weather updates. Essential for anyone in remote Florida terrain.",
        bestFor: "Outdoors, rural carry, emergency backup",
        url: "https://www.garmin.com",
        videoUrl: "https://www.youtube.com/results?search_query=Garmin+inReach+Mini+2+review",
      },
      {
        name: "Baofeng UV-5R",
        type: "Dual-Band Ham Radio",
        review: "Affordable and capable handheld radio covering VHF and UHF bands. Requires a Technician license to transmit legally. Excellent for community coordination and emergency communication.",
        bestFor: "Emergency comms, neighborhood coordination",
        url: "https://www.baofengradio.com",
        videoUrl: "https://www.youtube.com/results?search_query=Baofeng+UV5R+beginners+guide",
      },
    ],
  },
];

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function HidingEdc() {
  const [, navigate] = useLocation();

  return (
    <>
      <SEOHead
        title="EDC Gear | We Are Hiding in Plain Sight | Concealed Florida"
        description="Lights, blades, med kits, and communications — the four pillars of everyday carry for responsible Florida carriers."
        path="/we-are-hiding/edc-gear"
      />
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/we-are-hiding")}
            data-testid="button-back-hiding"
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            We Are Hiding in Plain Sight
          </Button>

          <div className="flex items-center gap-3 mb-3">
            <Package className="w-7 h-7 text-blue-400 shrink-0" />
            <h1 className="text-4xl md:text-5xl font-bold text-blue-400" data-testid="heading-edc">
              EDC Gear
            </h1>
          </div>
          <p className="text-gray-300 text-lg mb-8 max-w-3xl">
            Build your EDC system around reliability and redundancy. Lights, blades, medical, and communications form the four pillars of a complete carry setup. You don't need everything at once — add one category at a time and master each before expanding.
          </p>

          {/* Video placeholder */}
          <div
            className="w-full rounded-lg border border-border bg-secondary flex flex-col items-center justify-center gap-4 mb-12"
            style={{ aspectRatio: "16/9", maxHeight: "480px" }}
            data-testid="placeholder-video-edc"
          >
            <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center">
              <Play className="w-7 h-7 text-gray-500 ml-1" />
            </div>
            <p className="text-gray-400 text-sm">EDC Gear — Video coming soon</p>
          </div>

          <div className="space-y-12">

            {edcGear.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={cat.category} className={idx > 0 ? "border-t border-border pt-12" : ""}>
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={`w-6 h-6 shrink-0 ${cat.color}`} />
                    <h2 className={`text-2xl font-bold ${cat.color}`}>{cat.category}</h2>
                  </div>
                  <p className="text-gray-300 text-sm mb-6 max-w-3xl">{cat.intro}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {cat.items.map((item) => (
                      <Card
                        key={item.name}
                        className={`bg-secondary ${cat.borderColor} flex flex-col`}
                        data-testid={`card-edc-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <CardTitle className="text-white text-base">{item.name}</CardTitle>
                              <p className="text-gray-400 text-sm mt-0.5">{item.type}</p>
                            </div>
                            <Badge variant="secondary" className="text-xs shrink-0 no-default-active-elevate">
                              {item.bestFor}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1 gap-4">
                          <p className="text-gray-300 text-sm leading-relaxed">{item.review}</p>
                          <div className="mt-auto flex gap-2 flex-wrap">
                            <Button variant="secondary" size="sm" asChild className="flex-1">
                              <a href={item.url} target="_blank" rel="noopener noreferrer" data-testid={`link-edc-${item.name.toLowerCase().replace(/\s+/g, "-")}`}>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Product Page
                              </a>
                            </Button>
                            <Button variant="secondary" size="sm" asChild className="flex-1">
                              <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" data-testid={`video-edc-${item.name.toLowerCase().replace(/\s+/g, "-")}`}>
                                <Youtube className="w-4 h-4 mr-2" />
                                Watch Review
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="bg-secondary border border-border rounded-md px-4 py-3 flex gap-3 items-start">
              <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <p className="text-gray-400 text-sm">
                No paid promotions or affiliate relationships exist for any products listed. All recommendations are based on community reputation and real-world performance. Ham radio transmission in the US requires a valid FCC Technician license or higher. Consult Florida statutes for current regulations on blade carry.
              </p>
            </div>

          </div>
        </div>
      </Layout>
    </>
  );
}
