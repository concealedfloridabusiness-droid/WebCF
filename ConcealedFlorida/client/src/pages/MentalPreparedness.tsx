import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Play } from "lucide-react";

const mentalPillars = [
  {
    title: "Stress Inoculation",
    description:
      "Deliberately exposing yourself to controlled stress through training scenarios builds mental resilience. Practice decision-making under pressure so that when real emergencies happen, your mind stays clear and your body executes.",
  },
  {
    title: "Situational Pre-Planning",
    description:
      "Walk into every room with a plan. Identify exits, assess who is around you, and have a mental response ready for various threats. This isn't paranoia — it's preparation. The mind that has rehearsed survives.",
  },
  {
    title: "Controlled Breathing",
    description:
      "Tactical breathing (box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s) immediately lowers heart rate and restores fine motor function. Practice it daily so it becomes automatic in high-stress situations.",
  },
  {
    title: "Mindset: Protector Identity",
    description:
      "Adopt the identity of a protector — not a victim. This means accepting responsibility for your safety and the safety of those around you. The prepared mindset is proactive, not reactive. You have already decided to act before the threat arrives.",
  },
  {
    title: "After-Action Recovery",
    description:
      "Mental preparedness doesn't end when the threat does. Understand that post-incident stress is real. Have a plan for decompression, trusted contacts, and if needed, professional support. Mental fitness is physical fitness.",
  },
];

export default function MentalPreparedness() {
  const [, navigate] = useLocation();
  return (
    <>
      <SEOHead
        title="Mental Preparedness | We Are Ready | Concealed Florida"
        description="The mental pillars of readiness — stress inoculation, situational awareness, tactical breathing, and the protector mindset."
        path="/mental-preparedness"
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

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 mt-2" data-testid="heading-mental-preparedness">
            Mental Preparedness
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-3xl">
            The body follows the mind. No amount of physical training or gear compensates for a mind that freezes under pressure. These are the core mental pillars of true readiness.
          </p>

          {/* Video placeholder */}
          <div className="mb-12">
            <div
              className="w-full rounded-lg border border-border bg-secondary flex flex-col items-center justify-center gap-4"
              style={{ aspectRatio: "16/9", maxHeight: "480px" }}
              data-testid="placeholder-video-mental"
            >
              <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center">
                <Play className="w-7 h-7 text-gray-500 ml-1" />
              </div>
              <p className="text-gray-600 text-sm">Video coming soon</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentalPillars.map((pillar, i) => (
                <Card key={pillar.title} className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-bold text-2xl">{String(i + 1).padStart(2, "0")}</span>
                      <CardTitle className="text-white text-base">{pillar.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm leading-relaxed">{pillar.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="border-t border-gray-800 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Box Breathing — Tactical Reset</h2>
              <Card className="bg-gray-900 border-gray-800 max-w-lg">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    {[
                      { step: "Inhale", duration: "4 seconds" },
                      { step: "Hold", duration: "4 seconds" },
                      { step: "Exhale", duration: "4 seconds" },
                      { step: "Hold", duration: "4 seconds" },
                    ].map((s) => (
                      <div key={s.step + s.duration} className="bg-gray-800 rounded-lg p-4">
                        <p className="text-white font-semibold">{s.step}</p>
                        <p className="text-gray-400 text-sm">{s.duration}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm mt-4 text-center">
                    Repeat 4–6 cycles. Used by Navy SEALs, first responders, and military operators to regain composure under extreme stress.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex gap-3 items-start">
              <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <p className="text-gray-500 text-sm">
                Mental readiness is a lifelong practice. If you are dealing with PTSD, trauma, or chronic stress, please seek support from a licensed mental health professional. The techniques described here are training tools, not medical treatment.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
