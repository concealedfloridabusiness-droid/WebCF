import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ShieldAlert, Users, Brain, MapPin, CheckCircle, ArrowLeft, Play, Globe, Plane, ExternalLink, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const cooperColors = [
  {
    level: "White",
    label: "Unaware",
    tailwind: "bg-white text-black",
    border: "border-white/30",
    description:
      "Completely relaxed and unaware of your surroundings. Appropriate only in truly safe environments like your home — never in public. Most victims of violent crime are in Condition White.",
    indicators: ["Distracted by phone", "Earbuds in both ears", "Head down", "Zoned out"],
  },
  {
    level: "Yellow",
    label: "Relaxed Alert",
    tailwind: "bg-yellow-400 text-black",
    border: "border-yellow-400/30",
    description:
      "Your default state in public. Relaxed but aware. You are not looking for trouble, but you are taking in your environment — exits, people, unusual behavior. You can maintain this state indefinitely without fatigue.",
    indicators: ["Eyes up and scanning", "Aware of exits", "Noting people around you", "Calm and natural"],
  },
  {
    level: "Orange",
    label: "Specific Alert",
    tailwind: "bg-orange-500 text-white",
    border: "border-orange-500/30",
    description:
      "Something specific has caught your attention as a potential threat. You have identified a person, situation, or behavior that warrants focus. You are now pre-planning a response. You have not decided to act — but you are ready.",
    indicators: ["Identified a specific threat", "Pre-planning a response", "Watching closely", "Ready to move"],
  },
  {
    level: "Red",
    label: "Action",
    tailwind: "bg-red-600 text-white",
    border: "border-red-600/30",
    description:
      "The threat has materialized. You are now executing your pre-planned response. The mental trigger you set in Condition Orange has been crossed. Hesitation here costs lives.",
    indicators: ["Trigger condition met", "Executing response", "No hesitation", "Committed to action"],
  },
];

const publicTips = [
  {
    location: "Parking Lots",
    icon: MapPin,
    tips: [
      "Approach your vehicle with keys ready — do not dig through a bag at your car door.",
      "Scan under and around your vehicle before approaching.",
      "Park near light sources and high foot traffic when possible.",
      "Back into parking spaces for a faster exit.",
      "Never sit in a parked car for extended periods — move or go inside.",
    ],
  },
  {
    location: "Restaurants & Indoor Spaces",
    icon: Eye,
    tips: [
      "Choose a seat with your back to a wall and a clear view of the entrance.",
      "Identify at least two exits before you order.",
      "Note the staff and who else is in the space when you arrive.",
      "Avoid restaurants with limited sightlines or single-exit layouts when possible.",
      "Stay aware of sudden changes in noise level or crowd behavior.",
    ],
  },
  {
    location: "Crowds & Public Events",
    icon: Users,
    tips: [
      "Establish a meeting point with your group before entering.",
      "Stay near edges of crowds — avoid the densest areas when possible.",
      "Identify exits immediately upon entering any venue.",
      "Watch for sudden crowd directional shifts — they signal something.",
      "Trust your instincts. If something feels wrong, leave.",
    ],
  },
  {
    location: "Airports & Transit Hubs",
    icon: Plane,
    tips: [
      "Treat airport terminals like any other public space — stay in Condition Yellow from arrival.",
      "Identify all exit points, including gates you are not using, as secondary escape routes.",
      "Avoid clustered areas with no sightlines (kiosks, narrow retail corridors) when the terminal is crowded.",
      "Watch for individuals who are overdressed for the weather, sweating despite the A/C, or behaving unusually around trash cans or luggage.",
      "If you are at an international terminal, note the difference between secure and non-secure zones — most incidents occur in unsecured arrival areas.",
      "Never leave your luggage unattended. Report unattended bags immediately to airport security.",
    ],
  },
  {
    location: "ATMs & Banking",
    icon: ShieldAlert,
    tips: [
      "Use ATMs inside banks or well-lit, high-traffic lobbies whenever possible — especially at night.",
      "Shield the keypad when entering your PIN — even if no one appears to be watching.",
      "Scan behind you before inserting your card. Leave if anyone is loitering nearby.",
      "Complete your transaction quickly and put cash away before moving away from the machine.",
      "If followed after an ATM withdrawal, go to a busy public place — not your car.",
      "Skimming devices are installed in seconds. If the card reader feels loose or unusually bulky, do not use it.",
    ],
  },
  {
    location: "Vehicles & Roadways",
    icon: MapPin,
    tips: [
      "Keep at least one car length of space in front of you at stoplights — enough to pull out without three-point turning.",
      "If you believe you are being followed, do not drive home. Drive to a police station.",
      "Keep doors locked and windows up in slow traffic or unfamiliar areas.",
      "Be aware of staged accidents (bump-and-rob) — if you are rear-ended in an isolated area, drive to a safe public location before stopping.",
      "Avoid getting out of your vehicle to confront another driver — road rage incidents escalate rapidly.",
      "Know your route before you leave. A driver who is uncertain about their route is more vulnerable.",
    ],
  },
  {
    location: "Nightlife & Bars",
    icon: Eye,
    tips: [
      "Designate a sober person in your group to maintain Condition Yellow throughout the night.",
      "Agree on an exit plan and meeting point before entering a venue.",
      "Watch your drink at all times — never accept a drink you did not personally receive from the bartender.",
      "Escalating verbal confrontations in bars rarely stop at words. Disengage and leave before it reaches physical violence.",
      "Know where your vehicle is parked and plan your route to it before you leave the venue.",
      "Inform someone you trust of your location and expected return time.",
    ],
  },
];

const embassySteps = [
  {
    step: 1,
    title: "Check the State Department Travel Advisory",
    detail: "Before booking, visit travel.state.gov and search your destination country. Advisories range from Level 1 (exercise normal precautions) to Level 4 (do not travel). Understand exactly why the advisory is at its current level — crime, terrorism, civil unrest, health, or natural disaster.",
    url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html/",
    urlLabel: "travel.state.gov — Travel Advisories",
  },
  {
    step: 2,
    title: "Enroll in the STEP Program Before You Depart",
    detail: "STEP (Smart Traveler Enrollment Program) is a free service that registers your trip with the nearest US Embassy or Consulate. Enrollment means the Embassy can contact you in an emergency (natural disaster, civil unrest, terrorist attack), can assist in an evacuation, and can notify your emergency contacts at home if something happens to you.",
    url: "https://step.state.gov",
    urlLabel: "step.state.gov — Smart Traveler Enrollment",
  },
  {
    step: 3,
    title: "Locate the US Embassy or Consulate for Your Destination",
    detail: "Find the exact address, phone number, and after-hours emergency number for the US Embassy or Consulate in every city you plan to visit. Save these contacts in your phone and write them on a physical card in your wallet. The general US Embassy emergency number format is the country code + embassy main line.",
    url: "https://www.usembassy.gov",
    urlLabel: "usembassy.gov — Find Your Embassy",
  },
  {
    step: 4,
    title: "Send an Arrival Notification Email to the Embassy",
    detail: "Within 24 hours of arriving in-country, send a brief email to the American Citizens Services section of the Embassy. The ACS email address is listed on each Embassy's official website (usembassy.gov). Before sending: verify you are using the official .gov email domain — scam websites impersonating embassies exist. Include only what is necessary: your name, general travel dates, and accommodation. Do not include your full passport number in the email body — your STEP enrollment already links your passport to your record. If the Embassy specifically requests your passport number, provide only your passport number and no other document numbers in that exchange.",
  },
  {
    step: 5,
    title: "Sample Embassy Notification Email",
    isTemplate: true,
    detail: `Subject: American Citizen Arrival Notification — [Your Name] — [Country]

To the American Citizens Services Team,

My name is [Full Name]. I am a US citizen currently traveling in [City, Country]. I arrived on [Date] and plan to depart on [Date].

I am staying at: [Hotel Name and general area/neighborhood — no need to include your full room number]
Local contact: [Local/SIM number if you have one, or "no local number at this time"]
US emergency contact: [First name + last name, relationship, US phone number]

I have enrolled in the STEP program at step.state.gov under this email address.

Please note my presence in-country. I understand I should contact this office in the event of an emergency or if I require consular assistance.

Respectfully,
[Full Name]
[Your Email Address]

---
NOTE BEFORE SENDING:
- Verify the recipient email ends in .gov or a verified country-code domain
  for that specific embassy (e.g., .gov.xx). Never send personal information
  to an unverified address.
- Do not include your passport number, Social Security number, or date of
  birth in this email. Your STEP enrollment already contains this information.
- If you receive a reply requesting financial information or fees, that is a
  scam. US embassies do not charge for American Citizen Services notifications.`,
  },
  {
    step: 6,
    title: "Know When and How to Contact the Embassy",
    detail: "Contact the Embassy immediately if you: witness or are involved in a serious crime, are arrested or detained by local authorities, lose your passport, experience a medical emergency requiring evacuation, or if civil unrest or a natural disaster occurs near your location. The Embassy cannot get you out of legal trouble for crimes you committed, but can provide a list of local attorneys, ensure you receive fair treatment, and contact your family.",
  },
  {
    step: 7,
    title: "Monitor the STEP Alert System During Your Stay",
    detail: "Once enrolled in STEP, you will receive Security and Emergency Messages from the Embassy covering demonstrations, travel disruptions, natural events, and security incidents near your location. Read every alert. If an alert says 'avoid the area around [location]' — avoid it, even if it is inconvenient. Embassies do not issue alerts unless they have credible information.",
  },
];

const deEscalationTips = [
  "Use a calm, low, and slow voice — never match an aggressor's emotional pitch.",
  "Keep open, non-threatening body language: hands visible, slightly sideways stance.",
  "Validate the other person's emotion without agreeing to their behavior: 'I understand you're frustrated.'",
  "Offer a way out that lets the other person save face — most confrontations are ego-driven.",
  "Distance is your friend. Create space and reduce physical proximity whenever possible.",
  "Never issue ultimatums or corner someone verbally — it removes their options and escalates.",
  "If words are failing, disengage. Leave. Your ego is not worth your life or your freedom.",
  "Know when de-escalation is over — if physical violence begins, act decisively.",
];

const mindsetHabits = [
  { habit: "Debrief your day", detail: "At the end of each day, recall one moment where your awareness was low. Identify why and what you would do differently." },
  { habit: "Run mental scenarios", detail: "Ask yourself 'what would I do if...' in every new environment. Pre-programming your mind reduces reaction time under stress." },
  { habit: "Limit tunnel focus", detail: "Phones, entertainment, and earbuds are awareness killers. Time them deliberately. Never both earbuds in public." },
  { habit: "Practice observation", detail: "When sitting in a restaurant or waiting room, quietly count the number of people around you and note one distinctive detail about each." },
  { habit: "Control your baseline", detail: "Know what normal looks like so you instantly recognize the abnormal. Study the environment, not just individual threats." },
  { habit: "Physical fitness matters", detail: "Situational awareness without the ability to act is incomplete. Fitness is part of the preparation." },
];

const awarenessResources = [
  {
    title: "The Gift of Fear — Gavin de Becker",
    type: "Book",
    description: "The definitive book on reading pre-attack indicators and trusting your instincts. Required reading for anyone serious about personal safety. De Becker explains why we ignore the signals that precede violence — and how to stop.",
    url: "https://www.amazon.com/Gift-Fear-Gavin-Becker/dp/0440508835",
    color: "text-blue-400",
    borderColor: "border-blue-900/40",
    accentBg: "bg-blue-900/10",
  },
  {
    title: "Left of Bang — Patrick Van Horne",
    type: "Book",
    description: "Marine Combat Hunter Program developed for identifying threats before violence occurs. Covers behavioral analysis, baseline disruption, and pre-incident indicators. Highly applicable to civilian environments.",
    url: "https://www.amazon.com/Left-Bang-Marine-Program-Reduce/dp/1936891301",
    color: "text-green-400",
    borderColor: "border-green-900/40",
    accentBg: "bg-green-900/10",
  },
  {
    title: "US State Department — STEP Program",
    type: "Official Resource",
    description: "The Smart Traveler Enrollment Program — free embassy registration for any US citizen traveling or living abroad. Essential for anyone leaving the country.",
    url: "https://step.state.gov",
    color: "text-yellow-400",
    borderColor: "border-yellow-900/40",
    accentBg: "bg-yellow-900/10",
  },
  {
    title: "State Dept Country Information",
    type: "Official Resource",
    description: "Travel advisories, country-specific safety and security conditions, entry requirements, and local law information for every country in the world. Check before every international trip.",
    url: "https://travel.state.gov",
    color: "text-yellow-400",
    borderColor: "border-yellow-900/40",
    accentBg: "bg-yellow-900/10",
  },
  {
    title: "ASIS International",
    type: "Training",
    description: "The world's largest security professional organization. Offers training courses in personal protection, threat assessment, and executive protection. Some courses are open to the public.",
    url: "https://www.asisonline.org",
    color: "text-red-400",
    borderColor: "border-red-900/40",
    accentBg: "bg-red-900/10",
  },
  {
    title: "Active Self Protection — YouTube",
    type: "Video Channel",
    description: "Real-world incident breakdowns with after-action analysis from a law enforcement and civilian perspective. Thousands of real situations reviewed to extract tactical lessons.",
    url: "https://www.youtube.com/@ActiveSelfProtection",
    color: "text-purple-400",
    borderColor: "border-purple-900/40",
    accentBg: "bg-purple-900/10",
  },
];

export default function AwarenessPage() {
  const [, navigate] = useLocation();
  return (
    <>
      <SEOHead
        title="Situational Awareness | We Are Watching | Concealed Florida"
        description="The Cooper Color Code, practical public awareness tips, international travel safety, embassy registration, de-escalation techniques, and mindset habits."
        path="/we-are-watching/awareness"
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-5xl">

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/we-are-watching")}
            data-testid="button-back-we-are-watching"
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            We Are Watching
          </Button>

          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" data-testid="heading-awareness">
              Situational Awareness
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
              Awareness is the first line of defense. These principles, developed by combat veterans and law enforcement professionals, apply to every environment you move through — at home, abroad, and everywhere in between.
            </p>
            <div className="mt-6 bg-secondary border border-border rounded-md px-4 py-3 flex gap-3 items-start max-w-3xl">
              <AlertCircle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              <p className="text-gray-400 text-xs leading-relaxed">
                This content is for general educational purposes only. It does not constitute legal advice, tactical training certification, medical guidance, or security consultation. For legal questions related to self-defense, use of force, or firearms carry, consult a licensed attorney who specializes in your state's self-defense law. For tactical or personal protection training, seek a certified and licensed instructor. For any medical concerns, consult a licensed healthcare professional.
              </p>
            </div>
          </div>

          {/* Video placeholder */}
          <div className="mb-16">
            <div
              className="w-full rounded-lg border border-border bg-secondary flex flex-col items-center justify-center gap-4"
              style={{ aspectRatio: "16/9", maxHeight: "480px" }}
              data-testid="placeholder-video-awareness"
            >
              <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center">
                <Play className="w-7 h-7 text-gray-500 ml-1" />
              </div>
              <p className="text-gray-400 text-sm">Video coming soon</p>
            </div>
          </div>

          {/* Cooper Color Code */}
          <section id="cooper-code" className="mb-20 scroll-mt-24">
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="w-5 h-5 text-gray-400" />
              <h2 className="text-2xl font-bold text-white">The Cooper Color Code</h2>
            </div>
            <p className="text-gray-300 text-sm mb-8 ml-8">
              Developed by Lt. Col. Jeff Cooper — the standard framework for mental alertness states.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cooperColors.map((c) => (
                <Card key={c.level} className={`bg-secondary ${c.border} border`} data-testid={`card-cooper-${c.level.toLowerCase()}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Badge className={`${c.tailwind} no-default-active-elevate text-xs font-bold px-3 py-1`}>
                        {c.level}
                      </Badge>
                      <CardTitle className="text-white text-base">{c.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm leading-relaxed">{c.description}</p>
                    <ul className="space-y-1">
                      {c.indicators.map((ind, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-3 h-3 shrink-0 text-gray-500" />
                          {ind}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Mindset & Daily Habits */}
          <section className="mb-20 scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
              <Brain className="w-5 h-5 text-gray-400" />
              <h2 className="text-2xl font-bold text-white">Mindset & Daily Habits</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mindsetHabits.map((item) => (
                <Card key={item.habit} className="bg-secondary border-secondary" data-testid={`card-habit-${item.habit.toLowerCase().replace(/\s+/g, "-")}`}>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-white text-sm font-semibold">{item.habit}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Public Awareness Tips */}
          <section id="environment-tips" className="mb-20 scroll-mt-24">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-gray-400" />
              <h2 className="text-2xl font-bold text-white">Practical Awareness by Environment</h2>
            </div>
            <p className="text-gray-300 text-sm mb-8 ml-8">
              Awareness looks different in different environments. Here is how to apply it where it counts most.
            </p>

            <div className="space-y-6">
              {publicTips.map((env) => {
                const Icon = env.icon;
                return (
                  <Card key={env.location} className="bg-secondary border-secondary" data-testid={`card-env-${env.location.toLowerCase().replace(/\s+/g, "-")}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <CardTitle className="text-white text-base">{env.location}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {env.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-gray-400 font-mono mt-0.5 shrink-0">{i + 1}.</span>
                            <span className="text-gray-300 leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* De-escalation */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Users className="w-5 h-5 text-gray-400" />
              <h2 className="text-2xl font-bold text-white">De-escalation Principles</h2>
            </div>

            <Card className="bg-secondary border-secondary" data-testid="card-deescalation">
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {deEscalationTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-gray-400 font-bold text-xs mt-1 shrink-0 w-5">{i + 1}.</span>
                      <span className="text-gray-300 leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* International Travel & Embassy Registration */}
          <section id="embassy-guide" className="mb-20 scroll-mt-24">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-5 h-5 text-gray-400" />
              <h2 className="text-2xl font-bold text-white">International Travel — Contact Your Embassy</h2>
            </div>
            <p className="text-gray-300 text-sm mb-3 ml-8">
              When traveling outside the US, your single most important safety action costs nothing and takes 10 minutes: register with your embassy and let them know you are in-country. In a crisis — civil unrest, natural disaster, terrorism, medical emergency — the Embassy is your lifeline to evacuation assistance, legal help, and family notification.
            </p>
            <div className="bg-yellow-950/30 border border-yellow-800/40 rounded-md px-4 py-3 flex gap-3 items-start mb-8 ml-8">
              <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-yellow-200 text-xs leading-relaxed">
                The Embassy cannot override local law, get you out of legal trouble for crimes you committed, or pay your bills. What it <span className="font-semibold">can</span> do: provide emergency contact for your family, give you a list of local attorneys, arrange emergency passport replacement, assist in evacuation during civil emergencies, and ensure you receive humane treatment if detained.
              </p>
            </div>

            <div className="space-y-4">
              {embassySteps.map((item) => (
                <div
                  key={item.step}
                  className="bg-secondary border border-secondary rounded-md overflow-hidden"
                  data-testid={`card-embassy-step-${item.step}`}
                >
                  <div className="flex items-start gap-4 p-5">
                    <div className="w-8 h-8 rounded-md bg-blue-900/40 border border-blue-900/60 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-blue-400 text-sm font-bold">{item.step}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm mb-2">{item.title}</p>
                      {(item as { isTemplate?: boolean }).isTemplate ? (
                        <pre className="text-gray-300 text-xs leading-relaxed bg-black/30 border border-white/10 rounded p-3 whitespace-pre-wrap font-mono overflow-x-auto">
                          {item.detail}
                        </pre>
                      ) : (
                        <p className="text-gray-300 text-sm leading-relaxed">{item.detail}</p>
                      )}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs mt-2 transition-colors"
                          data-testid={`link-embassy-step-${item.step}`}
                        >
                          <ExternalLink className="w-3 h-3" />
                          {item.urlLabel}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Resources */}
          <section id="resources" className="mb-10 scroll-mt-24">
            <div className="flex items-center gap-3 mb-2">
              <ExternalLink className="w-5 h-5 text-gray-400" />
              <h2 className="text-2xl font-bold text-white">Resources to Learn More</h2>
            </div>
            <p className="text-gray-300 text-sm mb-6 ml-8">
              Situational awareness is a skill built through study and deliberate practice. These are the most respected resources across books, official programs, and video channels.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {awarenessResources.map((r) => (
                <a
                  key={r.title}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block border ${r.borderColor} ${r.accentBg} rounded-md p-4 hover-elevate cursor-pointer`}
                  data-testid={`card-resource-awareness-${r.title.toLowerCase().replace(/\s+/g, "-").slice(0, 20)}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white font-semibold text-sm">{r.title}</p>
                        <span className={`text-[10px] border rounded px-1.5 py-0.5 shrink-0 ${r.color} border-current opacity-70`}>{r.type}</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">{r.description}</p>
                    </div>
                    <ExternalLink className={`w-3.5 h-3.5 ${r.color} shrink-0 mt-0.5`} />
                  </div>
                </a>
              ))}
            </div>
          </section>

          <div className="p-6 bg-secondary rounded-lg border border-secondary">
            <p className="text-gray-300 text-sm italic text-center">
              Situational awareness is a perishable skill. Train it deliberately and consistently — in every environment, every day, and in every country you enter.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}
