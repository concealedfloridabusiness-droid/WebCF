import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Youtube, AlertCircle, Play, Shield, User, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const holsters = [
  {
    category: "AIWB",
    label: "Appendix Inside Waistband",
    color: "text-amber-400",
    borderColor: "border-amber-900/40",
    accentBg: "bg-amber-900/10",
    items: [
      {
        name: "Enigma Pro",
        brand: "Phlster",
        review: "The gold standard of appendix carry. Beltless design distributes weight evenly, making all-day carry genuinely comfortable for most body types. Excellent retention and minimal printing.",
        bestFor: "Slim to Athletic builds",
        url: "https://www.phlsterholsters.com",
        videoUrl: "https://www.youtube.com/results?search_query=Phlster+Enigma+review",
      },
      {
        name: "Ranger Series AIWB",
        brand: "Arrowhead Tactical",
        review: "Purpose-built for Florida heat and concealment. Sweat guard and adjustable cant make this one of the best daily carry options for warm-weather states.",
        bestFor: "All builds, especially hot climates",
        url: "https://www.arrowheadtactical.com",
        videoUrl: "https://www.youtube.com/results?search_query=AIWB+holster+review+2024",
      },
    ],
  },
  {
    category: "IWB",
    label: "Inside Waistband",
    color: "text-blue-400",
    borderColor: "border-blue-900/40",
    accentBg: "bg-blue-900/10",
    items: [
      {
        name: "Cloak Tuck 3.5",
        brand: "Alien Gear Holsters",
        review: "Hybrid design with a neoprene backer and Kydex shell. Extremely comfortable for longer wear. One of the most versatile IWB options on the market.",
        bestFor: "Larger builds, plus-size carry",
        url: "https://aliengearholsters.com",
        videoUrl: "https://www.youtube.com/results?search_query=Alien+Gear+Cloak+Tuck+review",
      },
      {
        name: "Koala IWB",
        brand: "945 Industries",
        review: "Precision-molded Kydex with adjustable retention. Minimal bulk while maintaining excellent trigger guard coverage. Built for serious everyday carriers.",
        bestFor: "Athletic to average builds",
        url: "https://www.945industries.com",
        videoUrl: "https://www.youtube.com/results?search_query=Kydex+IWB+holster+review",
      },
    ],
  },
  {
    category: "OWB",
    label: "Outside Waistband",
    color: "text-green-400",
    borderColor: "border-green-900/40",
    accentBg: "bg-green-900/10",
    items: [
      {
        name: "Safariland 7378RDS",
        brand: "Safariland",
        review: "ALS (Automatic Locking System) retention with Level 1 security. A trusted choice for range use, open carry, and vehicle carry. Durable and battle-tested.",
        bestFor: "Open carry, range days, vehicle storage",
        url: "https://www.safariland.com",
        videoUrl: "https://www.youtube.com/results?search_query=Safariland+OWB+holster+review",
      },
      {
        name: "Paddle OWB Pro",
        brand: "Bravo Concealment",
        review: "Lightweight paddle OWB that rides close to the body for reduced printing. Great for those who prefer OWB but need some concealment under a cover garment.",
        bestFor: "Slim to average builds with cover garment",
        url: "https://bravoconcealment.com",
        videoUrl: "https://www.youtube.com/results?search_query=Bravo+Concealment+OWB+review",
      },
    ],
  },
];

const bodyTypeGuide = [
  { body: "Slim / Athletic",    recommended: "AIWB or IWB at 3–4 o'clock",            notes: "Less body mass creates a natural tuck. AIWB works exceptionally well. Minimal printing risk." },
  { body: "Average Build",      recommended: "AIWB, IWB, or OWB with cover garment",   notes: "Most carry positions work well. Start with AIWB and experiment with 3–4 o'clock IWB." },
  { body: "Stocky / Muscular",  recommended: "IWB at 3–5 o'clock or OWB",             notes: "AIWB may be uncomfortable due to torso width when seated. Strong-side IWB is ideal." },
  { body: "Larger / Plus Size", recommended: "IWB at 3–5 o'clock or beltless systems", notes: "Hybrid holsters with neoprene backing distribute weight better. Consider Phlster Enigma beltless system." },
];

const holsterRequirements = [
  "Full trigger guard coverage — no exposed trigger under any circumstances.",
  "Positive retention — the firearm must not move or fall out during normal activity.",
  "Open mouth — the holster must stay open for one-handed reholstering without collapsing.",
  "Sweat guard — for Florida's heat, a sweat guard protects the firearm and your comfort.",
  "Quality hardware — use metal clips or hooks, never plastic that can flex or fail.",
];

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function HidingHolsters() {
  const [, navigate] = useLocation();

  return (
    <>
      <SEOHead
        title="Holsters & Carry | We Are Hiding in Plain Sight | Concealed Florida"
        description="AIWB, IWB, and OWB holster recommendations for Florida carriers — with body-type guidance and retention requirements."
        path="/we-are-hiding/holsters"
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
            <Shield className="w-7 h-7 text-amber-400 shrink-0" />
            <h1 className="text-4xl md:text-5xl font-bold text-amber-400" data-testid="heading-holsters">
              Holsters & Carry
            </h1>
          </div>
          <p className="text-gray-300 text-lg mb-8 max-w-3xl">
            A holster is not optional equipment — it is a safety device. The trigger guard must be fully covered, retention must hold the firearm during physical activity, and the mouth must stay open for one-handed reholstering. Every recommendation below meets those criteria.
          </p>

          {/* Video placeholder */}
          <div
            className="w-full rounded-lg border border-border bg-secondary flex flex-col items-center justify-center gap-4 mb-12"
            style={{ aspectRatio: "16/9", maxHeight: "480px" }}
            data-testid="placeholder-video-holsters"
          >
            <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center">
              <Play className="w-7 h-7 text-gray-500 ml-1" />
            </div>
            <p className="text-gray-400 text-sm">Holsters & Carry — Video coming soon</p>
          </div>

          <div className="space-y-12">

            {/* Non-negotiable requirements */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Non-Negotiable Holster Requirements</h2>
              <Card className="bg-secondary border-amber-900/40">
                <CardContent className="pt-5">
                  <ul className="space-y-3">
                    {holsterRequirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="text-amber-400 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                        <span className="text-gray-300 leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Holster categories */}
            {holsters.map((section) => (
              <div key={section.category}>
                <div className="flex items-center gap-3 mb-5">
                  <Badge className="bg-secondary border border-border text-gray-300 text-xs px-2.5 py-1 no-default-active-elevate">
                    {section.category}
                  </Badge>
                  <h2 className={`text-xl font-bold ${section.color}`}>{section.label}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {section.items.map((item) => (
                    <Card
                      key={item.name}
                      className={`bg-secondary ${section.borderColor} flex flex-col`}
                      data-testid={`card-holster-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <CardTitle className="text-white text-base">{item.name}</CardTitle>
                            <p className="text-gray-400 text-sm mt-0.5">{item.brand}</p>
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
                            <a href={item.url} target="_blank" rel="noopener noreferrer" data-testid={`link-holster-${item.name.toLowerCase().replace(/\s+/g, "-")}`}>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Product Page
                            </a>
                          </Button>
                          <Button variant="secondary" size="sm" asChild className="flex-1">
                            <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" data-testid={`video-holster-${item.name.toLowerCase().replace(/\s+/g, "-")}`}>
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
            ))}

            {/* Body type guide */}
            <div className="border-t border-border pt-10">
              <div className="flex items-center gap-3 mb-5">
                <User className="w-5 h-5 text-gray-400 shrink-0" />
                <h2 className="text-xl font-bold text-white">Body Type Carry Recommendations</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bodyTypeGuide.map((row) => (
                  <Card key={row.body} className="bg-secondary border-border" data-testid={`card-body-${row.body.toLowerCase().replace(/\s+/g, "-")}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-base">{row.body}</CardTitle>
                      <Badge variant="secondary" className="text-xs w-fit no-default-active-elevate">
                        {row.recommended}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm">{row.notes}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-secondary border border-border rounded-md px-4 py-3 flex gap-3 items-start">
              <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <p className="text-gray-400 text-sm">
                Florida is a shall-issue state. Always carry with a valid Concealed Weapon License (CWL). Verify all holster carry positions are compatible with safe handling practices and that your firearm remains fully secured at all times. In Florida, printing (visible outline through clothing) does not constitute illegal exposure of a firearm provided the weapon remains covered.
              </p>
            </div>

          </div>
        </div>
      </Layout>
    </>
  );
}
