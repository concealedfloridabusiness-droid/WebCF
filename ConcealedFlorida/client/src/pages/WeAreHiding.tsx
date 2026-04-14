import { Link, useLocation } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, AlertCircle, ChevronRight, Play, Shield, Package, Shirt } from "lucide-react";

const hidingCards = [
  {
    href: "/we-are-hiding/holsters",
    label: "Holsters & Carry",
    desc: "AIWB, IWB, and OWB holster recommendations curated for Florida carriers — with body-type guidance, retention requirements, and real-world daily carry reviews for every build.",
    testId: "link-hiding-holsters",
    color: "text-amber-400",
    borderColor: "border-amber-900/40",
    accentBg: "bg-amber-900/10",
    icon: Shield,
    badges: ["AIWB", "IWB", "OWB", "Body Type Guide", "Florida Carry"],
  },
  {
    href: "/we-are-hiding/edc-gear",
    label: "EDC Gear",
    desc: "The four pillars of everyday carry: lights, blades, medical, and communications. Curated gear reviews built around reliability, redundancy, and real-world Florida conditions.",
    testId: "link-hiding-edc",
    color: "text-blue-400",
    borderColor: "border-blue-900/40",
    accentBg: "bg-blue-900/10",
    icon: Package,
    badges: ["Lights", "Knives", "Med Kits", "Communications"],
  },
  {
    href: "/we-are-hiding/clothing",
    label: "Clothing & Blending In",
    desc: "The best concealment tool is looking like everyone else. Brands, cuts, and Florida-specific clothing strategies that provide carry access without signaling \"armed.\"",
    testId: "link-hiding-clothing",
    color: "text-green-400",
    borderColor: "border-green-900/40",
    accentBg: "bg-green-900/10",
    icon: Shirt,
    badges: ["Tactical Brands", "Casual Carry", "Florida Heat", "Concealment Tips"],
  },
];

const resourceVideos = [
  {
    title: "Concealed Carry Fundamentals",
    channel: "Warrior Poet Society",
    description: "Holster selection, draw stroke mechanics, and everyday carry philosophy from a combat veteran and firearms instructor.",
    benefit: "Covers the mindset and mechanics of responsible armed citizenship.",
    url: "https://www.youtube.com/@WarriorPoetSociety",
  },
  {
    title: "EDC Gear Reviews & Philosophy",
    channel: "Garand Thumb",
    description: "Detailed gear reviews covering lights, blades, holsters, and loadout philosophy from a Marine veteran perspective.",
    benefit: "Cuts through the noise on gear selection — practical over tactical.",
    url: "https://www.youtube.com/@GarandThumb",
  },
  {
    title: "Concealed Carry Corner",
    channel: "The Firearm Blog",
    description: "Regular deep dives into concealment clothing, holster options, and carry techniques for everyday environments.",
    benefit: "Practical carry advice for civilians in everyday situations.",
    url: "https://www.youtube.com/@TheFirearmBlog",
  },
];

export default function WeAreHiding() {
  const [, navigate] = useLocation();

  return (
    <>
      <SEOHead
        title="We Are Hiding in Plain Sight | Concealed Florida"
        description="Holster recommendations, EDC gear reviews, and concealment clothing for responsible Florida carriers. The best concealed carrier is the one nobody knows about."
        path="/we-are-hiding"
      />
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 mt-2" data-testid="heading-we-are-hiding">
            We Are Hiding in Plain Sight
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-3xl">
            Practical gear, smart carry, and the art of blending in while staying ready. The best concealed carrier is the one nobody knows about. Select a discipline below to get started.
          </p>

          {/* Video placeholder */}
          <div className="mb-12">
            <div
              className="w-full rounded-lg border border-border bg-secondary flex flex-col items-center justify-center gap-4"
              style={{ aspectRatio: "16/9", maxHeight: "480px" }}
              data-testid="placeholder-video-hiding"
            >
              <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center">
                <Play className="w-7 h-7 text-gray-500 ml-1" />
              </div>
              <p className="text-gray-400 text-sm">Video coming soon</p>
            </div>
          </div>

          <div className="space-y-8">

            {/* Section cards */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Focus</h2>
              <p className="text-gray-300 mb-6">
                Concealment is a system, not a single product. Holsters, gear, and clothing all work together — master each layer to become truly invisible while armed.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {hidingCards.map(({ href, label, desc, testId, color, borderColor, accentBg, icon: Icon, badges }) => (
                  <div
                    key={href}
                    className={`border ${borderColor} ${accentBg} rounded-md overflow-hidden flex flex-col`}
                  >
                    <Link href={href}>
                      <a
                        data-testid={testId}
                        className="group flex items-start justify-between gap-3 p-6 pb-4 hover-elevate block cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                            <h3 className={`text-xl font-bold ${color}`}>{label}</h3>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
                        </div>
                        <ChevronRight className={`w-5 h-5 shrink-0 mt-1 ${color}`} />
                      </a>
                    </Link>

                    <div className="flex gap-2 flex-wrap px-6 py-3 border-t border-white/5">
                      {badges.map((tag) => (
                        <button
                          key={tag}
                          data-testid={`badge-hiding-${tag.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => navigate(href)}
                          className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer hover-elevate bg-white/5 border border-white/10 text-gray-300`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <div className="px-6 pb-6 pt-3">
                      <Link href={href}>
                        <a
                          data-testid={`button-go-${href.split("/").pop()}`}
                          className={`w-full flex items-center justify-center gap-2 rounded-md py-3 font-semibold text-sm bg-white/5 border ${borderColor} ${color} hover:bg-white/10 transition-colors`}
                        >
                          View {label}
                          <ChevronRight className="w-4 h-4 shrink-0" />
                        </a>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resource videos */}
            <div className="border-t border-gray-800 pt-8">
              <h2 className="text-2xl font-bold text-white mb-2">Recommended Channels</h2>
              <p className="text-gray-300 mb-6">
                Curated YouTube channels for gear reviews, carry philosophy, and concealment technique. No paid promotion — these are genuinely recommended resources.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resourceVideos.map((video) => (
                  <Card key={video.title} className="bg-secondary border-border flex flex-col">
                    <CardHeader>
                      <div className="flex items-start gap-2">
                        <Youtube className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <CardTitle className="text-white text-base">{video.title}</CardTitle>
                          <p className="text-gray-300 text-sm mt-1">{video.channel}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 gap-3">
                      <p className="text-gray-300 text-sm">{video.description}</p>
                      <p className="text-gray-400 text-xs italic">{video.benefit}</p>
                      <div className="mt-auto">
                        <Button variant="secondary" size="sm" asChild className="w-full">
                          <a href={video.url} target="_blank" rel="noopener noreferrer" data-testid={`link-video-${video.channel.toLowerCase().replace(/\s+/g, "-")}`}>
                            <Youtube className="w-4 h-4 mr-2" />
                            View Channel
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-secondary border border-border rounded-lg p-4 flex gap-3 items-start">
              <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <p className="text-gray-300 text-sm">
                No paid promotions or affiliate relationships exist for any products or channels listed. All recommendations are editorially selected based on real-world use and community reputation. Florida requires a valid Concealed Weapon License (CWL) to carry concealed. Always confirm the legality of carry methods in your jurisdiction.
              </p>
            </div>

          </div>
        </div>
      </Layout>
    </>
  );
}
