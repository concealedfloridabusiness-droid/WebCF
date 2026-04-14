import { Link, useLocation } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Youtube, AlertCircle, ChevronRight, Play, ArrowLeft, Shield } from "lucide-react";
import { setPendingScroll } from "@/lib/pendingScroll";

const categoryBadges = [
  { tag: "Cardio",      num: 1, color: "bg-red-900/40 text-red-300 border border-red-900/60" },
  { tag: "Strength",    num: 2, color: "bg-blue-900/40 text-blue-300 border border-blue-900/60" },
  { tag: "Endurance",   num: 3, color: "bg-green-900/40 text-green-300 border border-green-900/60" },
  { tag: "Flexibility", num: 4, color: "bg-purple-900/40 text-purple-300 border border-purple-900/60" },
  { tag: "Grip",        num: 5, color: "bg-amber-900/40 text-amber-300 border border-amber-900/60" },
  { tag: "Body Fat",    num: 6, color: "bg-cyan-900/40 text-cyan-300 border border-cyan-900/60" },
  { tag: "Balance",     num: 7, color: "bg-indigo-900/40 text-indigo-300 border border-indigo-900/60" },
];

const advancedVideos = [
  {
    title: "Strength Training Fundamentals",
    channel: "Jeff Nippard",
    description: "Science-based strength programming for functional fitness and longevity.",
    benefit: "Builds the compound movement foundation critical for physical readiness.",
    url: "https://www.youtube.com/@JeffNippard",
  },
  {
    title: "Tactical Fitness & Movement",
    channel: "Alan Thrall",
    description: "Practical strength training focused on real-world performance.",
    benefit: "Develops power and endurance needed for high-stress physical situations.",
    url: "https://www.youtube.com/@UntamedStrength",
  },
  {
    title: "Military Calisthenics Program",
    channel: "Warrior Poet Society",
    description: "Bodyweight training protocols used by military and law enforcement.",
    benefit: "No-equipment training you can do anywhere to maintain peak readiness.",
    url: "https://www.youtube.com/@WarriorPoetSociety",
  },
];

const fitnessCards = [
  {
    href: "/fitness/male",
    label: "Men's Fitness Standards",
    desc: "Full breakdown of all 7 categories — cardio, strength, endurance, flexibility, grip, body composition, and neuromotor — with male-specific standards, how-to-test instructions, and improvement tips for every age group.",
    testId: "link-fitness-male-detail",
    color: "text-blue-400",
    borderColor: "border-blue-900/40",
    accentBg: "bg-blue-900/10",
  },
  {
    href: "/fitness/female",
    label: "Women's Fitness Standards",
    desc: "Full breakdown of all 7 categories with women-specific standards, how-to-test instructions, and improvement tips. Physiologically accurate ranges for every age group based on ACSM and military norms.",
    testId: "link-fitness-female-detail",
    color: "text-green-400",
    borderColor: "border-green-900/40",
    accentBg: "bg-green-900/10",
  },
];

export default function PhysicalFitness() {
  const [, navigate] = useLocation();

  return (
    <>
      <SEOHead
        title="Training | We Are Ready | Concealed Florida"
        description="Physical fitness standards, firearm training fundamentals, and readiness resources — all in one place."
        path="/fitness"
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
              onClick={() => navigate("/training/videos")}
              data-testid="button-video-resources-training"
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Video Resources
            </Button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 mt-2" data-testid="heading-training">
            Training
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-3xl">
            Physical readiness and firearm proficiency are the two pillars of personal preparedness. You cannot run, fight, carry, or protect without the body and the skills to back it up. Select a discipline below to begin.
          </p>

          {/* Featured Video */}
          <div className="mb-10 rounded-md border border-amber-900/40 bg-amber-900/10 overflow-hidden" data-testid="video-training">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src="https://www.youtube.com/embed/Zeh4tL8P_yk"
                title="Training — Featured"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>

          <div className="space-y-8">

            {/* Fitness Standards */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Physical Fitness Standards</h2>
              <p className="text-gray-300 mb-2">
                There is no single U.S. government fitness standard for civilians. The ranges below are compiled from ACSM (American College of Sports Medicine) health norms, public domain military testing standards (Army ACFT, USMC PFT, Navy PRT), and widely accepted exercise science benchmarks.
              </p>
              <p className="text-gray-300 text-sm mb-6">
                <span className="text-white font-medium">Baseline</span> — general health and functional fitness for civilians. &nbsp;
                <span className="text-white font-medium">Military</span> — readiness standard used in active duty fitness assessments.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {fitnessCards.map(({ href, label, desc, testId, color, borderColor, accentBg }) => (
                  <div
                    key={href}
                    className={`border ${borderColor} ${accentBg} rounded-md overflow-hidden flex flex-col`}
                  >
                    {/* Clickable main area */}
                    <Link href={href}>
                      <a
                        data-testid={testId}
                        className="group flex items-start justify-between gap-3 p-6 pb-4 hover-elevate block cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-2xl font-bold mb-2 ${color}`}>{label}</h3>
                          <p className="text-gray-300 text-base leading-relaxed">{desc}</p>
                        </div>
                        <ChevronRight className={`w-5 h-5 shrink-0 mt-1 ${color} transition-colors`} />
                      </a>
                    </Link>

                    {/* Category quick-jump badges */}
                    <div className="flex gap-2 flex-wrap px-6 py-3 border-t border-white/5">
                      {categoryBadges.map(({ tag, num, color: badgeColor }) => (
                        <button
                          key={tag}
                          data-testid={`badge-${tag.toLowerCase().replace(/\s+/g, "-")}-${href.split("/").pop()}`}
                          onClick={() => {
                            setPendingScroll(`category-${num}`);
                            navigate(href);
                          }}
                          className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer hover-elevate ${badgeColor}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    {/* Pronounced navigation button */}
                    <div className="px-6 pb-6 pt-3">
                      <Link href={href}>
                        <a
                          data-testid={`button-go-${href.split("/").pop()}`}
                          className={`w-full flex items-center justify-center gap-2 rounded-md py-3 font-semibold text-base bg-white/5 border ${borderColor} ${color} hover:bg-white/10 transition-colors`}
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

            {/* Firearm Training */}
            <div className="border-t border-gray-800 pt-8">
              <h2 className="text-2xl font-bold text-white mb-2">Firearm Training</h2>
              <p className="text-gray-300 mb-6">
                Concealed carry, home defense, EDC, dry fire, and pistol fundamentals — detailed training guides for lawful Florida firearm owners.
              </p>
              <div
                className="border border-amber-900/40 bg-amber-900/10 rounded-md overflow-hidden flex flex-col"
              >
                <Link href="/training/firearm">
                  <a
                    data-testid="link-firearm-training"
                    className="group flex items-start justify-between gap-3 p-6 pb-4 hover-elevate block cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-amber-400 shrink-0" />
                        <h3 className="text-2xl font-bold text-amber-400">Firearm Training Hub</h3>
                      </div>
                      <p className="text-gray-300 text-base leading-relaxed">
                        Five core disciplines covered with verified, instructor-sourced fundamentals: Concealed Carry (Florida CWL, legal framework, carry positions), Home Defense (layered strategy, safe rooms, low-light ops), EDC Training (holster selection, ammunition, concealment), Dry Fire (protocols, SIRT pistol, MantisX, drills), and Pistol Fundamentals (grip, stance, trigger control, benchmarks).
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 shrink-0 mt-1 text-amber-400 transition-colors" />
                  </a>
                </Link>

                <div className="flex gap-2 flex-wrap px-6 py-3 border-t border-white/5">
                  {[
                    { tag: "Concealed Carry",     anchor: "concealed-carry" },
                    { tag: "Home Defense",         anchor: "home-defense"   },
                    { tag: "EDC",                  anchor: "edc"            },
                    { tag: "Dry Fire",             anchor: "dry-fire"       },
                    { tag: "Pistol Fundamentals",  anchor: "pistol"         },
                  ].map(({ tag, anchor }) => (
                    <button
                      key={tag}
                      data-testid={`badge-firearm-${anchor}`}
                      onClick={() => navigate(`/training/firearm#${anchor}`)}
                      className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer hover-elevate bg-amber-900/40 text-amber-300 border border-amber-900/60"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="px-6 pb-6 pt-3">
                  <Link href="/training/firearm">
                    <a
                      data-testid="button-go-firearm-training"
                      className="w-full flex items-center justify-center gap-2 rounded-md py-3 font-semibold text-base bg-white/5 border border-amber-900/40 text-amber-400 hover:bg-white/10 transition-colors"
                    >
                      View Firearm Training
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>

            {/* Advanced training resources */}
            <div className="border-t border-gray-800 pt-8">
              <h2 className="text-2xl font-bold text-white mb-2">Advanced Training Resources</h2>
              <p className="text-gray-300 mb-6">
                Curated channels and programs for taking your fitness beyond the baseline. No paid promotion — these are genuinely recommended resources.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {advancedVideos.map((video) => (
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
                      <p className="text-gray-300 text-xs italic">Benefit: {video.benefit}</p>
                      <div className="mt-auto">
                        <Button variant="secondary" size="sm" asChild className="w-full">
                          <a href={video.url} target="_blank" rel="noopener noreferrer" data-testid={`link-video-${video.channel.toLowerCase().replace(/\s+/g, "-")}`}>
                            <ExternalLink className="w-4 h-4 mr-2" />
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
                Standards shown are based on publicly available military and ACSM fitness testing data. Gender-specific ranges reflect physiological differences in testing norms. Individual results vary. Always consult a physician before starting a new exercise program.
              </p>
            </div>

          </div>
        </div>
      </Layout>
    </>
  );
}
