import { Fragment, useEffect } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, Play } from "lucide-react";
import { fitnessCategories, femaleStandards, ageGroups } from "@/data/fitnessData";
import { consumePendingScroll } from "@/lib/pendingScroll";
import FitnessDownloadBar from "@/components/FitnessDownloadBar";

export default function FitnessFemale() {
  useEffect(() => {
    const id = consumePendingScroll() || window.location.hash.replace("#", "");
    if (id) {
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      }
    }
  }, []);

  return (
    <>
      <SEOHead
        title="Women's Fitness Standards by Age | Concealed Florida"
        description="Detailed women's fitness standards across 7 categories — cardio, strength, endurance, flexibility, grip, body composition, and neuromotor — for every age group."
        path="/fitness/female"
      />
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-8">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/fitness" data-testid="link-back-fitness-female">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Training
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/training/videos" data-testid="link-video-resources-female">
                <Play className="w-4 h-4 mr-2" />
                Video Resources
              </Link>
            </Button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" data-testid="heading-fitness-female">
            Women's Fitness Standards
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            Detailed standards across 7 fitness categories, by age group.
          </p>
          <p className="text-gray-600 text-sm mb-4">
            Sources: ACSM health norms, Army ACFT, USMC PFT, Navy PRT, and exercise science benchmarks. No single U.S. government civilian standard exists — these are compiled reference ranges.
          </p>
          <div className="bg-gray-900/60 border border-gray-800 rounded-md px-4 py-3 mb-10">
            <p className="text-gray-400 text-xs leading-relaxed">
              Each section below includes three downloadable guides: a <span className="text-blue-400 font-semibold">Civilian Guide</span> (ACSM / exercise science standards — step-by-step training to reach the baseline), a <span className="text-green-400 font-semibold">Military Guide</span> (Army FM 7-22 / ACFT / USMC protocols — training to reach the military standard), and an <span className="text-yellow-400 font-semibold">Assessment Sheet</span> (self-test checklist with scoring table to verify achievement). Available in Word, Excel, TXT, and PDF.
            </p>
          </div>

          <div className="space-y-14">
            {fitnessCategories.map((cat) => (
              <section key={cat.num} id={`category-${cat.num}`}>
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-gray-700 font-bold text-4xl leading-none mt-1 w-10 shrink-0">{String(cat.num).padStart(2, "0")}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{cat.name}</h2>
                    <p className="text-gray-500 text-sm mt-0.5">{cat.test}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">{cat.why}</Badge>
                  </div>
                </div>

                {/* Video placeholder */}
                <div
                  className="w-full rounded-lg border border-border bg-secondary flex flex-col items-center justify-center gap-3 mb-4"
                  style={{ aspectRatio: "16/9", maxHeight: "320px" }}
                  data-testid={`placeholder-video-${cat.num}`}
                >
                  <div className="w-12 h-12 rounded-full border-2 border-gray-600 flex items-center justify-center">
                    <Play className="w-5 h-5 text-gray-500 ml-0.5" />
                  </div>
                  <p className="text-gray-600 text-sm">Video coming soon</p>
                </div>
                <a
                  href={`/training/videos#fitness-${cat.num}`}
                  className="group block w-full mb-6 border border-green-900/40 bg-green-900/10 rounded-md p-5 text-center hover-elevate active-elevate-2 transition-colors"
                  data-testid={`button-training-videos-fitness-${cat.num}`}
                >
                  <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">Training Video Resources</p>
                  <p className="text-white font-bold text-base">Learn More About This Section</p>
                  <p className="text-gray-400 text-xs mt-1">Browse curated training videos for {cat.name}</p>
                  <div className="mt-3 flex items-center justify-center gap-2 text-green-400 text-sm font-semibold">
                    <ChevronRight className="w-4 h-4" />
                    View Videos
                  </div>
                </a>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="bg-secondary border-secondary">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-sm font-semibold uppercase tracking-wide">How to Perform the Test</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-sm leading-relaxed">{cat.howToTest}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary border-secondary">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-sm font-semibold uppercase tracking-wide">How to Improve</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {cat.improve.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <ChevronRight className="w-3.5 h-3.5 text-gray-600 mt-0.5 shrink-0" />
                            <span className="text-gray-400 leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary">
                        <th className="text-left py-3 px-4 text-gray-100 font-semibold w-36">Age Group</th>
                        <th className="text-center py-3 px-3 text-gray-300 font-medium w-28">Tier</th>
                        <th className="text-center py-3 px-4 text-gray-100 font-semibold">{cat.name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ageGroups.map((ag, i) => (
                        <Fragment key={ag.key}>
                          <tr className="border-b border-gray-800/60 bg-black/20">
                            <td className="py-3 px-4 text-white font-medium" rowSpan={2}>{ag.label}</td>
                            <td className="py-2 px-3 text-center">
                              <Badge variant="secondary" className="text-xs">Baseline</Badge>
                            </td>
                            <td className="py-3 px-4 text-center text-gray-200">
                              {femaleStandards[ag.key].baseline[cat.key]}
                            </td>
                          </tr>
                          <tr className={i < ageGroups.length - 1 ? "border-b border-gray-700" : ""}>
                            <td className="py-2 px-3 text-center">
                              <Badge className="text-xs bg-gray-600 text-white">Military</Badge>
                            </td>
                            <td className="py-3 px-4 text-center text-white font-medium">
                              {femaleStandards[ag.key].military[cat.key]}
                            </td>
                          </tr>
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                <FitnessDownloadBar catKey={cat.key} gender="female" catNum={cat.num} />
              </section>
            ))}
          </div>

          <div className="mt-14 pt-8 border-t border-gray-800">
            <p className="text-gray-600 text-sm mb-6">
              Standards are reference ranges derived from publicly available military fitness assessments and ACSM health norms. Individual results vary. Consult a physician before beginning a new exercise program.
            </p>
            <Button variant="secondary" asChild>
              <Link href="/fitness" data-testid="link-back-bottom-female">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Training
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    </>
  );
}
