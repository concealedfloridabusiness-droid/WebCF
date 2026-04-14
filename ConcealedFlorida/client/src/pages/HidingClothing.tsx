import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertCircle, Play, Shirt, ChevronRight, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const clothingBrands = [
  {
    brand: "5.11 Tactical",
    type: "Tactical Clothing",
    color: "text-amber-400",
    borderColor: "border-amber-900/40",
    accentBg: "bg-amber-900/10",
    description: "Industry standard for concealment-friendly pants, shirts, and outerwear. The Apex pants and Stryke series feature hidden pockets and reinforced carry zones without looking \"tactical.\"",
    tip: "The Apex pant reads as business casual while providing excellent IWB access.",
    url: "https://www.511tactical.com",
  },
  {
    brand: "Vertx",
    type: "Covert Carry Apparel",
    color: "text-blue-400",
    borderColor: "border-blue-900/40",
    accentBg: "bg-blue-900/10",
    description: "Specifically engineered for concealed carry without tactical aesthetics. The Hyde pants and Phantom series are indistinguishable from normal streetwear while providing purpose-built concealment access.",
    tip: "The Phantom LT shorts are ideal for Florida summers with built-in carry access.",
    url: "https://vertx.com",
  },
  {
    brand: "Kuhl",
    type: "Outdoor / Casual Wear",
    color: "text-green-400",
    borderColor: "border-green-900/40",
    accentBg: "bg-green-900/10",
    description: "Hiking and outdoor apparel that is loose enough for concealed carry without looking out of place in urban or suburban environments. Durable, breathable, and socially invisible.",
    tip: "The Renegade pants are excellent for warm-weather carry — relaxed fit hides printing naturally.",
    url: "https://www.kuhl.com",
  },
  {
    brand: "Pistol Wear",
    type: "Concealment Undershirts & Belly Bands",
    color: "text-purple-400",
    borderColor: "border-purple-900/40",
    accentBg: "bg-purple-900/10",
    description: "Belly bands and undershirt holster systems that eliminate the need for a belt entirely. Especially useful for Florida dress codes, formal occasions, and those with physical limitations.",
    tip: "Pair with any normal clothing. No belt loops required — great for athletic wear or business attire.",
    url: "https://pistolwear.com",
  },
  {
    brand: "Carhartt",
    type: "Work Wear / Outerwear",
    color: "text-orange-400",
    borderColor: "border-orange-900/40",
    accentBg: "bg-orange-900/10",
    description: "Rugged, thick fabric naturally conceals printing under jackets and vests. The Detroit Jacket and similar outerwear are classic concealment tools hiding in plain sight on worksites and in public.",
    tip: "A Carhartt vest worn over a t-shirt provides OWB cover in cool weather without looking tactical.",
    url: "https://www.carhartt.com",
  },
  {
    brand: "Concealment Express",
    type: "Print-Resistant Undershirts",
    color: "text-cyan-400",
    borderColor: "border-cyan-900/40",
    accentBg: "bg-cyan-900/10",
    description: "Purpose-built compression undershirts designed to eliminate printing from IWB carry. Moisture-wicking material ideal for Florida heat. Allows carry in professional dress environments.",
    tip: "Layer under dress shirts or polo shirts for office-appropriate concealment.",
    url: "https://www.concealmentexpress.com",
  },
];

const clothingTips = [
  "Wear patterned or textured fabrics — solid colors show printing more easily than patterns.",
  "Choose slightly looser fits around the waistband and hip area without looking baggy overall.",
  "Dark colors (charcoal, navy, black) naturally reduce printing visibility.",
  "Untucked shirts, flannels, and unbuttoned overshirts are classic cover garments — no one notices.",
  "In Florida heat, lightweight linen or technical fabric shirts ventilate well while still covering your carry.",
  "Avoid thin white t-shirts for carry — they print on every body type regardless of holster.",
  "Layered clothing (e.g., a light jacket over a polo) is the most versatile concealment solution year-round.",
  "Avoid clothing with logos, patches, or graphics that broadcast a tactical or gun-culture identity — blend in.",
];

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function HidingClothing() {
  const [, navigate] = useLocation();

  return (
    <>
      <SEOHead
        title="Clothing & Blending In | We Are Hiding in Plain Sight | Concealed Florida"
        description="Concealment-friendly clothing brands and carry strategies for Florida's climate. Blend in while staying ready."
        path="/we-are-hiding/clothing"
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
            <Shirt className="w-7 h-7 text-green-400 shrink-0" />
            <h1 className="text-4xl md:text-5xl font-bold text-green-400" data-testid="heading-clothing">
              Clothing & Blending In
            </h1>
          </div>
          <p className="text-gray-300 text-lg mb-8 max-w-3xl">
            The best concealment tool is looking like everyone else. These brands offer concealment-friendly cuts, carry-specific features, and everyday aesthetics that don't signal "armed." In Florida's heat and dress culture, this matters more than anywhere else in the country.
          </p>

          {/* Video placeholder */}
          <div
            className="w-full rounded-lg border border-border bg-secondary flex flex-col items-center justify-center gap-4 mb-12"
            style={{ aspectRatio: "16/9", maxHeight: "480px" }}
            data-testid="placeholder-video-clothing"
          >
            <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center">
              <Play className="w-7 h-7 text-gray-500 ml-1" />
            </div>
            <p className="text-gray-400 text-sm">Clothing & Blending In — Video coming soon</p>
          </div>

          <div className="space-y-10">

            {/* Brand cards */}
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Recommended Brands</h2>
              <p className="text-gray-300 text-sm mb-6 max-w-3xl">
                All brands below have been selected for carry-specific functionality, social invisibility, and suitability for Florida's climate. None are compensated for their inclusion.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {clothingBrands.map((brand) => (
                  <div
                    key={brand.brand}
                    className={`border ${brand.borderColor} ${brand.accentBg} rounded-md overflow-hidden flex flex-col`}
                    data-testid={`card-clothing-${brand.brand.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="p-5 pb-3 flex-1">
                      <h3 className={`text-lg font-bold mb-0.5 ${brand.color}`}>{brand.brand}</h3>
                      <p className="text-gray-400 text-xs mb-3">{brand.type}</p>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">{brand.description}</p>
                      <div className="bg-black/20 border border-white/5 rounded-md px-3 py-2">
                        <p className="text-gray-300 text-xs leading-relaxed">
                          <span className="text-white font-medium">Florida tip:</span> {brand.tip}
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-5 pt-3 border-t border-white/5">
                      <Button variant="secondary" size="sm" asChild className="w-full">
                        <a
                          href={brand.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid={`link-clothing-${brand.brand.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit Brand
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General tips */}
            <div className="border-t border-border pt-10">
              <h2 className="text-xl font-bold text-white mb-5">General Concealment Clothing Tips</h2>
              <Card className="bg-secondary border-border">
                <CardContent className="pt-5">
                  <ul className="space-y-3">
                    {clothingTips.map((tip, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <ChevronRight className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-secondary border border-border rounded-md px-4 py-3 flex gap-3 items-start">
              <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <p className="text-gray-400 text-sm">
                Carrying a firearm in Florida requires a valid Concealed Weapon License (CWL). In Florida, printing (visible outline through clothing) does not constitute illegal exposure of a firearm, provided the weapon remains covered by a garment. Consult a licensed Florida attorney for specific legal questions about carry and concealment law.
              </p>
            </div>

          </div>
        </div>
      </Layout>
    </>
  );
}
