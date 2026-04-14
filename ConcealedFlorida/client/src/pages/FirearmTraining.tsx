import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  ArrowLeft,
  Play,
  ExternalLink,
  Youtube,
  Shield,
  Home,
  Package,
  Target,
  Crosshair,
  ChevronRight,
} from "lucide-react";

/* ─── Resource channel cards ─────────────────────────────────────────────── */
interface ChannelCard {
  title: string;
  channel: string;
  description: string;
  benefit: string;
  url: string;
}

/* ─── Section nav ────────────────────────────────────────────────────────── */
const sections = [
  { id: "concealed-carry",  label: "Concealed Carry",   icon: Shield,    color: "text-amber-400",  borderColor: "border-amber-900/40",  accentBg: "bg-amber-900/10"  },
  { id: "home-defense",     label: "Home Defense",      icon: Home,      color: "text-blue-400",   borderColor: "border-blue-900/40",   accentBg: "bg-blue-900/10"   },
  { id: "edc",              label: "EDC Training",      icon: Package,   color: "text-green-400",  borderColor: "border-green-900/40",  accentBg: "bg-green-900/10"  },
  { id: "dry-fire",         label: "Dry Fire",          icon: Target,    color: "text-purple-400", borderColor: "border-purple-900/40", accentBg: "bg-purple-900/10" },
  { id: "pistol",           label: "Pistol Fundamentals", icon: Crosshair, color: "text-red-400",  borderColor: "border-red-900/40",   accentBg: "bg-red-900/10"    },
];

/* ─── Video placeholder ──────────────────────────────────────────────────── */
function VideoPlaceholder({ label, sectionId, color = "text-amber-400", borderColor = "border-amber-900/40", accentBg = "bg-amber-900/10" }: {
  label: string;
  sectionId?: string;
  color?: string;
  borderColor?: string;
  accentBg?: string;
}) {
  return (
    <>
      <div
        className="w-full rounded-md border border-border bg-secondary flex flex-col items-center justify-center gap-3 mb-4"
        style={{ aspectRatio: "16/9", maxHeight: "420px" }}
        data-testid={`placeholder-video-${label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <div className="w-14 h-14 rounded-full border-2 border-gray-600 flex items-center justify-center">
          <Play className="w-6 h-6 text-gray-500 ml-0.5" />
        </div>
        <p className="text-gray-400 text-sm">{label} — Video coming soon</p>
      </div>
      {sectionId && (
        <a
          href={`/training/videos#${sectionId}`}
          className={`group block w-full mb-6 border ${borderColor} ${accentBg} rounded-md p-5 text-center hover-elevate active-elevate-2 transition-colors`}
          data-testid={`button-training-videos-${sectionId}`}
        >
          <p className={`${color} text-xs font-bold uppercase tracking-widest mb-1`}>Training Video Resources</p>
          <p className="text-white font-bold text-base">Learn More About This Section</p>
          <p className="text-gray-400 text-xs mt-1">Browse curated training videos for this topic</p>
          <div className={`mt-3 flex items-center justify-center gap-2 ${color} text-sm font-semibold`}>
            <Play className="w-4 h-4" />
            View Videos
          </div>
        </a>
      )}
    </>
  );
}

/* ─── Resource card ──────────────────────────────────────────────────────── */
function ResourceCards({ cards }: { cards: ChannelCard[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
      {cards.map((card) => (
        <Card key={card.channel} className="bg-secondary border-border flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-start gap-2">
              <Youtube className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <CardTitle className="text-white text-sm leading-tight">{card.title}</CardTitle>
                <p className="text-gray-400 text-xs mt-0.5">{card.channel}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 gap-2">
            <p className="text-gray-300 text-xs leading-relaxed">{card.description}</p>
            <p className="text-gray-400 text-xs italic">Why it matters: {card.benefit}</p>
            <div className="mt-auto pt-2">
              <Button variant="secondary" size="sm" asChild className="w-full">
                <a
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-resource-${card.channel.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  View Channel
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ─── Section wrapper ────────────────────────────────────────────────────── */
function Section({
  id,
  icon: Icon,
  label,
  color,
  borderColor,
  accentBg,
  children,
}: {
  id: string;
  icon: typeof Shield;
  label: string;
  color: string;
  borderColor: string;
  accentBg: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className={`border ${borderColor} ${accentBg} rounded-md p-6 scroll-mt-24`}
      data-testid={`section-${id}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-6 h-6 shrink-0 ${color}`} />
        <h2 className={`text-2xl font-bold ${color}`}>{label}</h2>
      </div>
      {children}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function FirearmTraining() {
  const [, navigate] = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  return (
    <>
      <SEOHead
        title="Firearm Training | Training | Concealed Florida"
        description="Concealed carry, home defense, EDC, dry fire, and pistol fundamentals — detailed training guides for lawful Florida firearm owners."
        path="/training/firearm"
      />
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">

          {/* Back + Video Resources */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/fitness")}
              data-testid="button-back-training"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Training
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/training/videos")}
              data-testid="button-video-resources-firearm"
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Video Resources
            </Button>
          </div>

          {/* Heading */}
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-3 mt-2"
            data-testid="heading-firearm-training"
          >
            Firearm Training
          </h1>
          <p className="text-gray-300 text-lg mb-6 max-w-3xl">
            A lawfully-armed Floridian is only as effective as their training. This section covers the core disciplines — from earning your Concealed Weapon License to building daily draw speed through dry fire — with verified, instructor-sourced fundamentals and curated learning resources.
          </p>

          {/* Disclaimer */}
          <div className="bg-secondary border border-border rounded-md px-4 py-3 flex gap-3 items-start mb-10 max-w-3xl">
            <AlertCircle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            <p className="text-gray-400 text-xs leading-relaxed">
              This content is for general educational purposes only and does not constitute legal advice, professional firearms instruction, or tactical certification. Florida firearms law is subject to legislative change — always verify current statutes at leg.state.fl.us or consult a licensed Florida attorney. For live training, seek a certified NRA, USCCA, or IDPA-affiliated instructor in your area.
            </p>
          </div>

          {/* Quick-jump nav */}
          <div className="flex flex-wrap gap-2 mb-10">
            {sections.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                data-testid={`jump-${id}`}
                onClick={() =>
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
                }
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium border border-white/10 bg-white/5 ${color} hover-elevate active-elevate-2 cursor-pointer`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </button>
            ))}
          </div>

          {/* ── Sections ── */}
          <div className="space-y-8">

            {/* 1 — Concealed Carry */}
            <Section id="concealed-carry" icon={Shield} label="Concealed Carry Training" color="text-amber-400" borderColor="border-amber-900/40" accentBg="bg-amber-900/10">
              <VideoPlaceholder label="Concealed Carry Training" sectionId="concealed-carry" color="text-amber-400" borderColor="border-amber-900/40" accentBg="bg-amber-900/10" />

              <div className="space-y-5 text-gray-300 text-sm leading-relaxed">
                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Florida Concealed Weapon License (CWL)</h3>
                  <p>Florida is a <span className="text-white font-medium">shall-issue</span> state — if you meet the statutory requirements, the Florida Department of Agriculture and Consumer Services (FDACS) must issue your license. Requirements include being 21 or older (18+ for active military), a US citizen or legal resident alien, and completing an approved firearms safety course with a live-fire component. Common qualifying courses include NRA Basic Pistol, NRA Personal Protection Inside the Home, USCCA Fundamentals of Concealed Carry, or a DD-214 for veterans. The application is submitted online through MyLicenseFL. Processing typically takes 50–90 days. Florida CWL holders enjoy reciprocity in 37+ states.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">The Four Universal Firearm Rules</h3>
                  <ul className="list-none space-y-1 pl-0">
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Rule 1:</span> Treat every firearm as if it is loaded — always.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Rule 2:</span> Never point a firearm at anything you are not willing to destroy.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Rule 3:</span> Keep your finger off the trigger until your sights are on target and you have made the decision to fire.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Rule 4:</span> Know your target and what is beyond it. Bullets penetrate walls, cars, and people.</span></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Florida Legal Framework (Stand Your Ground)</h3>
                  <p>Under Florida Statute 776.013, a person who is lawfully in their home, vehicle, or any place they have a right to be, and reasonably believes that force is necessary to prevent death or great bodily harm, has no duty to retreat. The law presumes a reasonable fear of imminent death or great bodily harm if an intruder unlawfully and forcefully enters your dwelling, residence, or occupied vehicle. This is not a license to shoot in every threatening situation — the standard is an objectively reasonable belief of imminent serious harm. Florida also has <span className="text-white font-medium">no duty to inform</span> law enforcement that you are carrying unless directly asked.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Where You Cannot Carry in Florida</h3>
                  <p className="mb-2">Even with a valid CWL, carry is prohibited in: police stations, detention facilities, courthouses, polling places, government meetings open to the public, schools and school events, college/university campuses (with limited law-passed exceptions), airports beyond the security checkpoint, seaports past secure areas, establishments whose primary business is serving alcohol for on-site consumption, and federal facilities.</p>
                  <p>Always check current statute at leg.state.fl.us or consult your attorney — this list is not exhaustive and law changes. Carry in violation of these provisions carries criminal penalties.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Carry Positions</h3>
                  <ul className="space-y-1.5">
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">AIWB (Appendix Inside Waistband):</span> Front-center carry, fastest draw, requires deliberate reholstering practice. High retention. Excellent for concealment under a T-shirt.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">IWB 3–4 o'clock (Strong Side):</span> Traditional strong-side inside the waistband. Comfortable for sitting, easy to print on smaller frames with larger pistols.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Pocket Carry:</span> Small-frame subcompacts only. Requires a dedicated pocket holster that covers the trigger guard completely and stays in the pocket on the draw.</span></li>
                  </ul>
                </div>
              </div>

              <ResourceCards cards={[
                {
                  title: "Concealed Carry Fundamentals",
                  channel: "USCCA",
                  description: "The US Concealed Carry Association produces structured, state-specific training videos on legal use of force, carry techniques, and mindset.",
                  benefit: "Authoritative, insurance-backed education vetted by active attorneys and firearms instructors.",
                  url: "https://www.youtube.com/@USCCA",
                },
                {
                  title: "Warrior Poet Society — CCW Mindset",
                  channel: "Warrior Poet Society",
                  description: "John Lovell (former Army Ranger and SWAT operator) covers concealed carry mindset, legal frameworks, and the decision-making process under stress.",
                  benefit: "Tactical mindset from someone with real-world lethal force experience, presented clearly for civilians.",
                  url: "https://www.youtube.com/@WarriorPoetSociety",
                },
                {
                  title: "Use-of-Force Case Review",
                  channel: "Active Self Protection",
                  description: "John Correia reviews real-world self-defense incidents from surveillance footage — what went right, what went wrong, and what to learn from each.",
                  benefit: "Empirical study of actual self-defense encounters — the most realistic decision-making training available outside a simulator.",
                  url: "https://www.youtube.com/@ActiveSelfProtection",
                },
              ]} />
            </Section>

            {/* 2 — Home Defense */}
            <Section id="home-defense" icon={Home} label="Home Defense Training" color="text-blue-400" borderColor="border-blue-900/40" accentBg="bg-blue-900/10">
              <VideoPlaceholder label="Home Defense Training" sectionId="home-defense" color="text-blue-400" borderColor="border-blue-900/40" accentBg="bg-blue-900/10" />

              <div className="space-y-5 text-gray-300 text-sm leading-relaxed">
                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Layered Defense — The Correct Mental Model</h3>
                  <p>Home defense is not primarily a shooting problem — it is a layered security problem in which your firearm is the last resort. Each layer you invest in reduces the probability of needing the next. Start from the outside in: perimeter lighting and camera coverage (Ring, Arlo, Reolink), reinforced door frames and Grade 1 deadbolts (a standard kick-in-the-door overcomes most residential locks in seconds), an audible alarm system, and an interior door barricade bar for the safe room door. Your firearm is the final layer if all others are bypassed.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Safe Room Designation</h3>
                  <p>Designate one interior room — typically the master bedroom — as your family's safe room. Characteristics of a good safe room: solid-core door with a deadbolt, a cell phone charging inside at all times, the family's firearms accessible from that room, and all family members know to go there during a home intrusion. The safe room strategy protects against the biggest error civilians make in home defense: searching the house. Searching for an intruder puts you in their environment without knowing their location. Call 911, go to your safe room, and let law enforcement clear the structure.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">The Fatal Funnel</h3>
                  <p>A doorway is called a "fatal funnel" in tactical terminology because anyone moving through it is silhouetted, predictable, and vulnerable. If you must move through your home toward a threat, stay off the centerline of doorways, move quickly through them, and never linger in or just outside a doorway. For most homeowners, the correct answer is staying in the safe room and channeling any threat to come to you — from a position of cover, with a known background behind the threat.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Low-Light Operations</h3>
                  <p>Most home invasions occur at night. A weapon-mounted light (WML) on a dedicated home defense long gun or pistol is not a luxury — it is a requirement for responsible use of force, because you cannot shoot what you cannot positively identify. A standalone handheld flashlight should be in every bedside kit as a backup and for general navigation before you decide to access a firearm. The Surefire G2X, Streamlight Protac HL, and Olight PL-Pro are proven options at varying price points. Train the Harries technique or Rogers/Surefire technique for handheld use alongside your pistol.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Storage vs. Accessibility</h3>
                  <p>A firearm locked in a traditional safe is inaccessible when seconds matter. A loaded firearm on the nightstand is inaccessible to you and accessible to a child or intruder. The solution is a <span className="text-white font-medium">quick-access bedside pistol safe</span> — Vaultek VT20i, Hornady RAPiD, Fort Knox PB1 — that provides authorized access in under 3 seconds while meeting Florida's trigger lock law for homes with minor children. If you have a long gun for home defense (a 12-gauge or 5.56 carbine), store it in a quick-release rifle safe or a vertical rack behind the bedroom door that is not directly accessible to a child but retrievable by an adult in seconds.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Home Defense Long Gun Selection</h3>
                  <ul className="space-y-1.5">
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">12-Gauge Shotgun (00 Buckshot):</span> Maximum stopping power at close range. Pattern spread requires less precise aim under stress. Over-penetration is similar to pistol rounds when loaded with 00 buck. Easy to train new shooters on. 870, Mossberg 500, or Beretta 1301.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">AR-15 / 5.56 Carbine:</span> Higher capacity, more accurate at longer distances, easier for smaller-framed shooters than a 12-gauge. Contrary to popular belief, 5.56 M193 overpenetrates walls significantly less than pistol rounds or buckshot. With a 16" barrel and proper ammunition (77gr OTM or 55gr M193), this is arguably the most effective home defense platform.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">9mm Pistol-Caliber Carbine (PCC):</span> Suppressor-friendly, lower blast in enclosed spaces, greater capacity than a pistol, better ballistics than a pistol. Compatible with Glock magazines. Kel-Tec Sub2000, CMMG Banshee, or Ruger PC Carbine.</span></li>
                  </ul>
                </div>
              </div>

              <ResourceCards cards={[
                {
                  title: "Home Defense Strategy",
                  channel: "Warrior Poet Society",
                  description: "Detailed home defense planning covering safe room setup, family communication plans, and weapon-mounted light usage from a former special operations background.",
                  benefit: "Structured, family-focused home defense thinking from an operator who has cleared real structures.",
                  url: "https://www.youtube.com/@WarriorPoetSociety",
                },
                {
                  title: "Tactical Anatomy — Shot Effectiveness",
                  channel: "Paul Harrell",
                  description: "Methodical, data-based analysis of ammunition performance, barrier penetration, and real-world defensive shooting scenarios. Independently conducted, not sponsored.",
                  benefit: "Unsponsored empirical ballistics testing. Helps you choose the right tool and ammunition for your specific environment.",
                  url: "https://www.youtube.com/@PaulHarrell",
                },
                {
                  title: "Low-Light and WML Fundamentals",
                  channel: "Garand Thumb",
                  description: "Military-experienced trainer covers weapon-mounted lights, handheld light techniques, and home defense setup with real-world equipment reviews.",
                  benefit: "Practical low-light training gaps most civilian-focused programs don't cover in depth.",
                  url: "https://www.youtube.com/@GarandThumb",
                },
              ]} />
            </Section>

            {/* 3 — EDC */}
            <Section id="edc" icon={Package} label="EDC (Every Day Carry) Training" color="text-green-400" borderColor="border-green-900/40" accentBg="bg-green-900/10">
              <VideoPlaceholder label="EDC Training" sectionId="edc" color="text-green-400" borderColor="border-green-900/40" accentBg="bg-green-900/10" />

              <div className="space-y-5 text-gray-300 text-sm leading-relaxed">
                <div>
                  <h3 className="text-white font-semibold text-base mb-1">The Philosophy of Every Day Carry</h3>
                  <p>EDC is a mindset before it is an equipment list. The core principle is consistency: a firearm in the safe provides zero protection when you are not home. The value of carrying is only realized if you carry every day, in every legal environment. This means selecting equipment that works with your wardrobe, body type, and lifestyle rather than selecting what performs best in a theoretical scenario. The best carry gun is the one you will actually carry every day.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Selecting an EDC Firearm</h3>
                  <p className="mb-2">The modern gold standard for EDC is a <span className="text-white font-medium">9mm semi-automatic pistol</span>. FBI testing data (Firearms Training Unit ballistics studies) demonstrates that modern 9mm hollow-point ammunition performs equivalently to .40 S&W and .45 ACP in terminal ballistics, with less recoil, less wear, and significantly more capacity. Common proven EDC platforms:</p>
                  <ul className="space-y-1.5">
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Glock 19 (compact):</span> 15+1 rounds, universal reliability record, massive aftermarket ecosystem. The benchmark against which all others are measured.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Sig Sauer P365 / P365XL:</span> Micro-compact with 10–17 round capacity. Optics-ready. Exceptional for smaller-framed carriers who find a G19 too large.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">S&W Shield Plus:</span> Thin profile, 10–13+1 rounds, excellent for appendix carry under a T-shirt. Very popular in Florida's warm climate.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Walther PDP Compact:</span> Outstanding ergonomics and trigger. Optics-ready from the factory. Excellent choice for new carriers who shoot it better than alternatives.</span></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Holster Selection</h3>
                  <p className="mb-2">A holster must do three things without compromise: cover the trigger guard completely, retain the firearm during physical activity, and have a defined mouth that allows reholstering with one hand safely. Never compromise on any of these. Recommended makers: Tier 1 Concealed, T.Rex Arms, JM Custom Kydex, Vedder Holsters, Tulster.</p>
                  <ul className="space-y-1.5">
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">AIWB (Appendix Inside Waistband):</span> Fastest draw, best concealment under untucked shirts, natural muzzle direction during draw. Requires disciplined reholstering — always look the gun into the holster rather than blindly sweeping behind your back.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">IWB 3–4 o'clock (Strong Side):</span> More comfortable for larger frames and during extended sitting. Slightly slower draw, but more natural for many transitioning from OWB range use.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Pocket Carry:</span> Subcompact only (Shield 9 EZ, Glock 43, Sig P238). Must use a dedicated pocket holster — the Desantis Nemesis is the standard. The holster stays in the pocket; the gun comes out alone.</span></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Defensive Ammunition Selection</h3>
                  <p>Carry hollow-point ammunition specifically designed for terminal performance, not range FMJ (full metal jacket ball). The three best-performing defensive 9mm loads, consistently validated by independent FBI protocol testing: <span className="text-white font-medium">Federal HST 147gr</span>, <span className="text-white font-medium">Speer Gold Dot 124gr +P</span>, and <span className="text-white font-medium">Winchester PDX1 Defender 147gr</span>. Function-test any carry ammunition through at least 200 rounds in your specific firearm before trusting it. A load that doesn't cycle reliably in your gun — regardless of its ballistic performance — is not your defensive load.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Concealment and Printing</h3>
                  <p>In Florida, "printing" — where the outline of a firearm is visible through clothing — does not constitute illegal open carry provided the firearm remains covered. However, it can cause public alarm and draw unwanted attention. Mitigate printing by: wearing an untucked cover garment one size larger than normal, using an AIWB holster with a built-in "wing" or "claw" that levers the grip inward, and choosing a compact or subcompact pistol if your wardrobe requires tighter fits. Florida's warm climate creates a genuine challenge — high-quality moisture-wicking undershirts (Alexo Athletica, 5.11 Traverse) worn beneath a carry garment protect the firearm from sweat corrosion and improve comfort significantly.</p>
                </div>
              </div>

              <ResourceCards cards={[
                {
                  title: "EDC Gear and Concealment",
                  channel: "Lucky Gunner",
                  description: "Ammunition-laboratory-funded channel with independent ballistics testing, EDC gear breakdowns, and caliber-vs-caliber defensive data.",
                  benefit: "The only civilian-accessible ammunition performance data that approaches FBI protocol testing standards.",
                  url: "https://www.youtube.com/@LuckyGunner",
                },
                {
                  title: "Every Day Carry Reviews",
                  channel: "Concealed Nation",
                  description: "EDC setup reviews, holster comparisons, carry position analysis, and Florida-specific carry tips for everyday carriers.",
                  benefit: "Civilian-focused EDC guidance from a community of active carriers rather than sponsored marketing.",
                  url: "https://www.youtube.com/@concealednation",
                },
                {
                  title: "Pistol Selection and Carry Platforms",
                  channel: "Garand Thumb",
                  description: "Detailed, long-form reviews of defensive pistol platforms with durability testing, round-count data, and realistic carry experience reports.",
                  benefit: "Data-driven equipment selection — not based on sponsorships, but round counts and real use.",
                  url: "https://www.youtube.com/@GarandThumb",
                },
              ]} />
            </Section>

            {/* 4 — Dry Fire */}
            <Section id="dry-fire" icon={Target} label="Dry Fire Training" color="text-purple-400" borderColor="border-purple-900/40" accentBg="bg-purple-900/10">
              <VideoPlaceholder label="Dry Fire Training" sectionId="dry-fire" color="text-purple-400" borderColor="border-purple-900/40" accentBg="bg-purple-900/10" />

              <div className="space-y-5 text-gray-300 text-sm leading-relaxed">
                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Why Dry Fire Produces Elite Skills</h3>
                  <p>Dry fire is the deliberate practice of operating a firearm without live ammunition. It is the single highest return-on-investment training method available to a civilian shooter — producing more skill improvement per hour than range time, at zero ammunition cost. Military snipers, competitive IPSC/USPSA shooters, and tactical law enforcement units universally incorporate dry fire as the foundation of their skill development. The primary skills built are trigger control, draw speed, sight alignment, target transitions, and malfunction clearance — all of which transfer directly to live fire performance.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">The Non-Negotiable Safety Protocol</h3>
                  <p className="mb-2">Dry fire negligent discharges occur because people violate the protocol. Follow this sequence every single time without exception:</p>
                  <ul className="space-y-1.5">
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span>Remove the magazine from the firearm.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span>Rack the slide three times while pointing the muzzle in a safe direction.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span>Lock the slide back. Visually inspect the chamber. Physically insert your finger to feel the chamber — confirm empty.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span>Remove all live ammunition from the room — not just the gun, but every round, every magazine, every box.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span>Announce "dry fire in progress" to everyone else in the home.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span>Point your designated dry fire target at a wall with no occupied rooms behind it.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span>When finished, check the chamber again before handling the firearm differently or returning ammo to the room.</span></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Tools</h3>
                  <ul className="space-y-2">
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Snap Caps:</span> Inert dummy rounds (A-ZOOM, ST Action Pro) that protect the firing pin during dry fire and add realism to malfunction drills. Use one per chamber and cycle through them. Not required for modern striker-fired pistols, but recommended for 1911s, revolvers, and rimfire firearms.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">SIRT Pistol (Shot Indicating Resetting Trigger):</span> A dedicated training pistol with a resetting trigger and dual-laser system — a "take-up" laser and a "shot" laser — that shows exactly where the muzzle was at trigger break. The most valuable tool for building trigger discipline. Available in Glock 17/19 size from NextLevel Training.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">MantisX Firearm Training System:</span> A magnetic sensor that attaches to the Picatinny rail and communicates with a phone app via Bluetooth. Tracks muzzle movement during the trigger press, identifies the specific error in your technique (heeling, milking, trigger freeze), and scores each repetition. The most precise feedback tool available under $250.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Shot Timer:</span> PACT Club Timer III or Shotmaxx-2 wristwatch timer. Building speed requires measuring it. Work a draw-to-first-shot baseline and track it over weeks. Competitive shooters consider anything under 1.5 seconds from concealment to first shot on target acceptable for self-defense readiness; under 1.0 seconds is excellent.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Laser Cartridge Systems:</span> LaserHIT, Strikeman, or Coolfire Trainer — chamber-insert cartridges that emit a laser dot on trigger break, tracked by a phone camera. Less data than MantisX but more accessible for smaller budgets.</span></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Core Dry Fire Drills</h3>
                  <ul className="space-y-1.5">
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Draw to First Shot:</span> From concealment, draw, acquire sight picture, press. Timer from beep to "shot." Work this drill 10–15 reps per session. Build to under 1.5 seconds consistently before working speed.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Trigger Reset Drill:</span> Fire, maintain grip and sight picture, release trigger only to the reset click, prep for next shot. Never take your trigger finger fully out of the trigger guard between shots during a string of fire.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Target Transitions:</span> Two or more target points. Draw, engage first target, transition to second, engage. Builds the eye-leading-gun skill that is essential for multi-threat situations.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Emergency Reload:</span> Shoot to slide-lock (simulated), drop the magazine, reload, acquire sight picture. Builds the muscle memory for when your gun goes dry unexpectedly.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Type 1/2/3 Malfunction Clears:</span> Simulate stovepipe (Type 1), double-feed (Type 2), and bolt override (Type 3) malfunctions with snap caps and practice the clearance drills until they are automatic.</span></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Program Recommendation</h3>
                  <p>Ben Stoeger's <em>Dry Fire Training for the Practical Pistol Shooter</em> and Steve Anderson's <em>Refinement and Repetition</em> are the two most widely used structured dry fire programs in competitive shooting. Both are available as physical books and apply directly to defensive handgun work. 15 minutes of focused dry fire 4–5 days per week will produce measurable skill improvement within 30 days.</p>
                </div>
              </div>

              <ResourceCards cards={[
                {
                  title: "Dry Fire Methodology",
                  channel: "Ben Stoeger Pro Shop",
                  description: "Ben Stoeger (USPSA and IPSC world champion) teaches structured dry fire programs, trigger control analysis, and building a systematic daily training routine.",
                  benefit: "World-level competitive shooter teaching the exact dry fire methods that build championship-level trigger control.",
                  url: "https://www.youtube.com/@BenStoeger",
                },
                {
                  title: "MantisX Training Analysis",
                  channel: "Mantis Tech",
                  description: "Official channel for the MantisX training system — drill breakdowns, app tutorials, and technique correction using sensor data from real training sessions.",
                  benefit: "Objective data-driven feedback that replaces guessing about what your technique errors actually are.",
                  url: "https://www.youtube.com/@MantisXTech",
                },
                {
                  title: "Practical Dry Fire Drills",
                  channel: "Practical Shooting Training Group",
                  description: "Chris Tilley (USPSA Grand Master) covers practical dry fire drills designed for defensive shooters, including timer work, AIWB draw practice, and transition training.",
                  benefit: "Structured drills from a Grand Master-level shooter who designs practice specifically around real-world defensive scenarios.",
                  url: "https://www.youtube.com/@PracticalShootingTrainingGroup",
                },
              ]} />
            </Section>

            {/* 5 — Pistol Fundamentals */}
            <Section id="pistol" icon={Crosshair} label="Pistol Fundamentals" color="text-red-400" borderColor="border-red-900/40" accentBg="bg-red-900/10">
              <VideoPlaceholder label="Pistol Fundamentals" sectionId="pistol" color="text-red-400" borderColor="border-red-900/40" accentBg="bg-red-900/10" />

              <div className="space-y-5 text-gray-300 text-sm leading-relaxed">
                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Grip — The Foundation of Everything</h3>
                  <p className="mb-2">Grip is the single most important fundamental — everything else (recoil management, accuracy, speed) flows from a correct grip. The key elements:</p>
                  <ul className="space-y-1.5">
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">High grip:</span> The web of the shooting hand should ride as high as possible under the beavertail or rear of the slide. This minimizes the mechanical leverage the recoiling slide has over your grip and dramatically reduces muzzle flip.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Thumbs-forward grip (semi-auto):</span> Both thumbs point forward along the frame, with the support thumb beneath the shooting thumb. This positions the support hand for maximum contribution to recoil management.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">60/40 pressure:</span> The support hand exerts approximately 60% of total grip pressure; the shooting hand exerts 40%. The support hand does the work. Most new shooters do the opposite — they grip hard with the shooting hand and loosely with the support hand, which allows the gun to torque off-axis during recoil.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Crush grip:</span> Grip as hard as you can without causing the sights to move or your hand to shake. Squeezing harder during recoil is the correct instinct — never loosen your grip to "absorb" recoil.</span></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Stance</h3>
                  <ul className="space-y-1.5">
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Isosceles (recommended for defensive shooting):</span> Square to the target, feet roughly shoulder-width apart with a slight stagger, weight on the balls of the feet, slight forward lean. Arms extend equally, forming a triangle (isosceles). This stance allows natural turns to address threats at different angles and works with body armor and retention holsters.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Weaver (bladed):</span> Non-dominant foot forward, bladed to the target, support arm slightly bent, push-pull tension between hands. Less common in modern defensive training — it blades your body armor away from the threat, creates a narrower stable base, and limits lateral mobility. May appear in older training curricula.</span></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Sight Alignment and Sight Picture</h3>
                  <p className="mb-2">Sight alignment refers to the relationship between the rear sight and the front sight. Sight picture adds the target. For iron sights:</p>
                  <ul className="space-y-1.5">
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Equal height, equal light:</span> The top of the front sight should be level with the top of both rear sight posts, with equal space visible on each side of the front sight within the rear notch.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Hard front sight focus:</span> The front sight should be in sharp focus. The rear sight and the target will be slightly blurred — this is correct. The human eye cannot simultaneously focus at two different distances. Train yourself to focus on the front sight, not the target. This is the most counter-intuitive and most important visual skill in shooting.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Red dot / optic:</span> A pistol-mounted red dot (MRDS) simplifies sight picture by giving you a single focal plane — both the target and the dot can be in focus simultaneously. This dramatically improves speed and accuracy for new and experienced shooters. The learning curve is finding the dot in the window on the draw — training this specifically is essential.</span></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Trigger Control</h3>
                  <p className="mb-2">Trigger control errors are the primary cause of missed shots at any distance. The key principles:</p>
                  <ul className="space-y-1.5">
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Press straight back:</span> The trigger should move directly rearward with no lateral push. Any sideways pressure on the trigger rotates the muzzle left or right before the bullet exits — the shot lands off-axis regardless of how good your sight picture was.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Take up the slack / prep the trigger:</span> Modern striker-fired pistols have a small amount of free travel (slack) before the "wall" — the point of resistance before the break. Pre-loading the trigger to the wall during the draw so the final press is smooth and minimal dramatically improves split times and accuracy.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Trigger reset:</span> After each shot, release the trigger only far enough to feel or hear the reset click, then prep for the next shot. Do not fully release the trigger between shots during a string of fire — this wastes motion and time, and causes many precision errors.</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span><span className="text-white font-medium">Anticipation (flinch):</span> The most common shooting error. The brain anticipates the recoil and the shooter tightens their grip or dips the muzzle just before the shot breaks. Dry fire eliminates anticipation by removing the recoil stimulus entirely. If your shots are consistently low and left (for right-handed shooters), anticipation is almost always the cause.</span></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Breathing and Follow-Through</h3>
                  <p>For slow precision shooting: exhale approximately two-thirds of your breath, pause naturally, and press the trigger during the pause. For defensive speed shooting (2–7 yards, multiple rounds), breathing management is largely irrelevant — the shots are over in under a second. Focus on grip and trigger control instead of breathing. Follow-through means maintaining your sight picture and grip through and after the shot breaks — call your shot (note where your sights were when the gun fired) rather than dropping the gun in anticipation. Consistent follow-through is the difference between knowing why you missed and guessing.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-base mb-1">Recommended Skill Benchmarks</h3>
                  <p className="mb-2">These standards are drawn from USPSA Production division benchmarks and USCCA defensive shooting curricula:</p>
                  <ul className="space-y-1.5">
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span>Draw to first shot on an 8" circle at 7 yards: under 2.0 sec (baseline), under 1.5 sec (proficient), under 1.0 sec (advanced)</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span>Two shots on a B-8 center (5.5" ring) at 7 yards: under 2.5 sec (baseline), under 2.0 sec (proficient)</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span>Five rounds at 25 yards on a B-8 bullseye (4" ring): 4 of 5 hits (baseline), 5 of 5 hits (proficient)</span></li>
                    <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /><span>Emergency reload from slide-lock to first shot: under 3.0 sec (baseline), under 2.0 sec (proficient)</span></li>
                  </ul>
                </div>
              </div>

              <ResourceCards cards={[
                {
                  title: "Fundamentals of Pistol Shooting",
                  channel: "Jerry Miculek",
                  description: "Jerry Miculek (the most decorated competitive shooter in history) covers grip, trigger control, and speed-building with precise mechanical breakdowns of every fundamental.",
                  benefit: "Technical instruction from a record-holder whose shot-calling ability and technique analysis is unmatched in the sport.",
                  url: "https://www.youtube.com/@JerryMiculek",
                },
                {
                  title: "Defensive Handgun Fundamentals",
                  channel: "Langdon Tactical",
                  description: "Ernest Langdon (former USMC and FAST Medal holder) covers defensive pistol fundamentals with an emphasis on the specific skills required for real-world use rather than sport shooting.",
                  benefit: "Translates competition-level fundamentals into the defensive context — the practical bridge between shooting fast and shooting effectively under stress.",
                  url: "https://www.youtube.com/@LangdonTactical",
                },
                {
                  title: "Science of Accurate Shooting",
                  channel: "Brownells",
                  description: "Brownells' training series covers mechanical accuracy, ammunition selection for training vs. carry, and the empirical analysis of common shooting errors.",
                  benefit: "Manufacturer-independent, technically grounded instruction that bridges gunsmithing knowledge with practical shooting fundamentals.",
                  url: "https://www.youtube.com/@Brownells",
                },
              ]} />
            </Section>

            {/* Disclaimer footer */}
            <div className="bg-secondary border border-border rounded-md p-4 flex gap-3 items-start">
              <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <p className="text-gray-400 text-sm leading-relaxed">
                Training content on this page is derived from publicly available NRA, USCCA, FBI Firearms Training Unit, and USPSA educational materials. All legal references are based on Florida statutes current as of publication — laws change. Do not rely on this page as your only source of legal guidance on carry, use of force, or self-defense law. Seek formal instruction from a certified NRA, USCCA, or IDPA-affiliated instructor before carrying a firearm for self-defense.
              </p>
            </div>

          </div>
        </div>
      </Layout>
    </>
  );
}
