import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, AlertTriangle, Droplets, Zap, Users, Wind, MapPin, Backpack, BookOpen, ExternalLink, FileText, Printer } from "lucide-react";

interface Scenario {
  icon: typeof Wind;
  title: string;
  subtitle: string;
  color: string;
  source: string;
  steps: string[];
  fillIns: string[];
}

const scenarios: Scenario[] = [
  {
    icon: Wind,
    title: "Hurricane Season Plan",
    subtitle: "Active June 1 – November 30",
    color: "text-blue-400",
    source: "Based on: FEMA CPG-101, NHC preparedness guidelines, and Florida Division of Emergency Management evacuation protocols",
    steps: [
      "Monitor NHC (nhc.noaa.gov) 5-day cone daily once a named storm forms in your region.",
      "Know your evacuation zone (A–F) — check floridadisaster.org or your county emergency management website.",
      "Pre-plan two evacuation routes: one north, one inland. Test both routes before the season starts.",
      "Fill your fuel tank when the storm is 96 hours out — stations run dry by 72 hours. Never wait.",
      "Deploy WaterBOB or fill all available containers 24–48 hours before expected impact.",
      "Secure all outdoor items: furniture, grills, potted plants, tools — anything that can become a projectile at 120 mph.",
      "Move valuables, documents, medications, and irreplaceable items to the highest interior room.",
      "Identify your interior safe room: interior bathroom or closet with no windows, lowest center of the structure.",
      "Shut off gas if instructed or if you smell gas. Know where your main breaker, water main, and gas meter are.",
      "If evacuating: leave early. The traffic jams are predictable. Early movers reach their destination. Late movers sit in shelters.",
    ],
    fillIns: [
      "My evacuation zone: ___________",
      "My primary evacuation route (Route 1): ___________",
      "My alternate evacuation route (Route 2): ___________",
      "My evacuation destination (address + phone): ___________",
      "My shelter-in-place room location: ___________",
      "My gas meter shutoff location: ___________",
      "My water main shutoff location: ___________",
      "My out-of-area emergency contact (name + number): ___________",
      "Where my go-bag is stored: ___________",
      "My pet's carrier/food storage location: ___________",
    ],
  },
  {
    icon: Droplets,
    title: "Flood & Flash Flood Plan",
    subtitle: "Inland and coastal flooding",
    color: "text-cyan-400",
    source: "Based on: FEMA Flood Zone designation standards, NWS Flash Flood Safety guidelines, Red Cross flood preparedness protocols",
    steps: [
      "Know your FEMA flood zone — check msc.fema.gov. Zone A and AE properties are high-risk. Know your zone before any storm.",
      "Identify high-ground routes from your home — at least two paths that avoid all low-lying and flood-prone roads.",
      "Never drive through standing water: 6 inches moves a person off their feet. 2 feet floats any car. Turn Around Don't Drown.",
      "Move valuables, electronics, and critical documents to upper floors before any forecasted heavy rain event.",
      "Keep waterproof dry bags in your vehicle, go-bag, and accessible in your home.",
      "If caught in a flash flood on foot: move perpendicular to the current toward high ground — never try to outrun it downstream.",
      "After flooding: do not return until officials clear the area. Floodwater is classified as sewage-contaminated.",
      "Wear N95 masks and gloves during any flood cleanup — mold begins growing within 24–48 hours in Florida's humidity.",
    ],
    fillIns: [
      "My FEMA flood zone designation: ___________",
      "My flood zone source checked at (URL): msc.fema.gov — date checked: ___________",
      "My high-ground evacuation route (primary): ___________",
      "My high-ground evacuation route (alternate): ___________",
      "Location of my elevated safe storage (for documents, medications): ___________",
      "Location of my dry bags: ___________",
      "My county emergency management website: ___________",
      "My flood insurance policy number (if applicable): ___________",
    ],
  },
  {
    icon: Zap,
    title: "Extended Power Outage Plan",
    subtitle: "Grid failure, storm damage, infrastructure attack",
    color: "text-yellow-400",
    source: "Based on: FEMA extended power outage preparedness guide, CDC heat-related illness prevention, CPSC generator safety guidelines",
    steps: [
      "Keep refrigerator closed — safe for 4 hours sealed; freezer for 48 hours when full and sealed.",
      "Never run a generator, grill, or camp stove indoors or in a garage — carbon monoxide is odorless and kills within minutes.",
      "Place generator 20+ feet from any window or door, downwind. Install a battery-powered CO detector.",
      "Keep treated gasoline (Sta-Bil added) in approved containers — enough for 7 days of generator runtime minimum.",
      "Have battery-powered or hand-crank NOAA weather radio — do not rely on cell towers during extended grid failures.",
      "Charge all devices, power banks, and medical equipment the moment a warning is issued — before power goes out.",
      "If on oxygen, CPAP, or other medical equipment: register with your utility provider for Priority Restoration status NOW.",
      "After 72 consecutive hours without power in Florida summer heat: identify your nearest cooling center before you need it.",
    ],
    fillIns: [
      "My generator model + wattage: ___________",
      "My generator storage location: ___________",
      "My fuel storage location + quantity: ___________",
      "Number of fuel cans + last treated date: ___________",
      "My nearest cooling center (address): ___________",
      "My medical equipment backup plan: ___________",
      "Utility provider priority restoration status (registered Y/N): ___________",
      "CO detector location: ___________",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Civil Unrest Plan",
    subtitle: "Riots, protests, social breakdown",
    color: "text-red-400",
    source: "Based on: FEMA shelter-in-place guidance, DHS guidance on civil unrest, Florida Statutes Ch. 776 (Justifiable Use of Force)",
    steps: [
      "Shelter in place is almost always the correct decision unless your immediate area is directly, actively threatened.",
      "Harden your home before an event: reinforce door frames and deadbolts, lock gates, keep vehicles inside or in garage.",
      "Fill fuel tanks, withdraw cash in small bills, and complete any essential shopping 48–72 hours before anticipated unrest.",
      "Stay off social media during active events — misinformation accelerates faster than events on the ground.",
      "Communicate only with trusted, pre-identified contacts. Establish a set check-in schedule with specific times.",
      "Know Florida law: Castle Doctrine provides legal protection for use of force in defense of your home.",
      "Maintain a low profile. Do not display weapons, flags, or any signage that could make your home a target.",
      "Have 7-day shelter-in-place supply of food, water, and medications. Do not venture out unnecessarily.",
    ],
    fillIns: [
      "My shelter-in-place duration supply (days): ___________",
      "Cash on hand in small bills: ___________",
      "My trusted check-in contact list (name + number): ___________",
      "My check-in schedule: ___________",
      "Door reinforcement completed (Y/N): ___________",
      "My home entry points inventory (doors, garage): ___________",
      "My local sheriff non-emergency line: ___________",
    ],
  },
  {
    icon: Users,
    title: "Family Communication Plan",
    subtitle: "When phones fail and family is separated",
    color: "text-green-400",
    source: "Based on: FEMA Ready.gov Family Emergency Communication Plan, Red Cross emergency preparedness family templates",
    steps: [
      "Designate one out-of-state contact that all family members call or text to check in with. Out-of-area lines often work when local infrastructure is overwhelmed.",
      "Every family member — including children — memorizes two phone numbers: the out-of-state contact and one local backup.",
      "Establish two physical meeting points: one close to home, one outside the immediate neighborhood.",
      "Write your family plan on paper and post it physically — on the refrigerator, in go-bags, and in vehicles.",
      "If children are in school: know the school's emergency release protocol. Pre-authorize a backup pickup person in writing.",
      "Establish a simple check-in code word for text messages — useful when only partial messages transmit.",
      "Consider a household group chat with all members, plus a backup radio channel for extended outages.",
    ],
    fillIns: [
      "Out-of-state contact name: ___________",
      "Out-of-state contact number: ___________",
      "Local backup contact name + number: ___________",
      "Meeting Point #1 (near home): ___________",
      "Meeting Point #2 (outside neighborhood): ___________",
      "Children's school emergency contact: ___________",
      "Authorized backup pickup person for children: ___________",
      "Family check-in code word: ___________",
      "Family group chat platform: ___________",
    ],
  },
  {
    icon: Backpack,
    title: "Go-Bag / Bug Out Plan",
    subtitle: "72-hour rapid departure kit — grab and go in under 5 minutes",
    color: "text-orange-400",
    source: "Based on: FEMA 'Build A Kit' guidelines, Red Cross Emergency Preparedness checklist, DHS 72-hour kit recommendations",
    steps: [
      "Your go-bag must sustain one person for 72 hours without resupply from any external source.",
      "Essentials (per person): 3L water minimum, 3,000 calorie food supply, first aid kit, copies of IDs and insurance cards, cash in small bills, 30-day medications supply, phone charger and power bank, headlamp with fresh batteries, rain poncho, N95 masks.",
      "Store your bag in the same location always — nearest exit. 5-second grab and walk out the door.",
      "Review and rotate consumables every 6 months — food, water, medications, and batteries.",
      "Know your destination before you leave. Never go mobile without a plan for where you are going.",
      "Pets require their own kit: 3-day food and water supply, medical records and vaccination certificates, carrier or leash.",
      "Ensure at least one paper copy of all critical documents — digital copies are inaccessible when phones die.",
    ],
    fillIns: [
      "My go-bag storage location: ___________",
      "My go-bag destination primary: ___________",
      "My go-bag destination alternate: ___________",
      "Last review date: ___________",
      "Medications included (list): ___________",
      "Pet kit storage location: ___________",
      "Document copies stored in (location): ___________",
      "Go-bag weight when full (should be under 30 lbs): ___ lbs",
    ],
  },
];

const planningStandards = [
  {
    acronym: "PACE",
    fullName: "Primary — Alternate — Contingency — Emergency",
    color: "text-blue-400",
    bg: "bg-blue-900/15 border-blue-800/40",
    description: "A military planning framework that ensures you never rely on a single method for any critical capability. Developed by US Special Operations Forces for mission-critical communications — now widely used by preppers and emergency planners for all critical systems.",
    application: "Apply it to every critical capability in your plan: How will we communicate? How will we evacuate? How will we get water?",
    example: [
      { tier: "Primary", detail: "Cell phone — works when infrastructure is intact" },
      { tier: "Alternate", detail: "Text messaging — often works when voice calls fail" },
      { tier: "Contingency", detail: "Ham radio — works when cell towers are down" },
      { tier: "Emergency", detail: "Physical meeting point — works when all electronics fail" },
    ],
  },
  {
    acronym: "SMEAC",
    fullName: "Situation — Mission — Execution — Administration — Command",
    color: "text-yellow-400",
    bg: "bg-yellow-900/15 border-yellow-800/40",
    description: "The US Marine Corps five-paragraph order format used to brief any operation or plan. Forces clarity by requiring each element to be explicitly addressed. Use this format when briefing your family or group on an emergency plan — it prevents confusion and omissions.",
    application: "Use when activating a plan with multiple people. Walk through each element out loud before executing.",
    example: [
      { tier: "Situation", detail: "Hurricane Cat 3, landfall in 18 hours. Mandatory evacuation issued for Zone B." },
      { tier: "Mission", detail: "Our family will evacuate to Aunt Maria's home in Gainesville by 6pm today." },
      { tier: "Execution", detail: "John loads vehicles. Maria gets documents. Kids load pets. We leave at 2pm on Route 75 north." },
      { tier: "Administration", detail: "Each person carries their go-bag. Vehicles have full tanks. $300 cash on hand." },
      { tier: "Command", detail: "John is in charge. If separated, call the out-of-state contact and meet at the Gainesville Walmart on NW 13th Street." },
    ],
  },
  {
    acronym: "1/3 — 2/3 RULE",
    fullName: "Planning Time vs. Execution Time",
    color: "text-green-400",
    bg: "bg-green-900/15 border-green-800/40",
    description: "A US Army time management principle: never spend more than 1/3 of your available time planning. Give the people executing the plan at least 2/3 of available time to prepare and act. In emergencies, over-planning delays execution. Good-enough plans executed now beat perfect plans executed too late.",
    application: "If you have 6 hours until a mandatory evacuation takes effect: spend no more than 2 hours deciding and planning. Spend 4 hours actually loading vehicles, securing the home, and driving.",
    example: [
      { tier: "Total Time Available", detail: "6 hours until mandatory evacuation" },
      { tier: "Planning (1/3)", detail: "2 hours — decide destination, route, what to take" },
      { tier: "Execution (2/3)", detail: "4 hours — pack, secure home, load vehicles, drive" },
      { tier: "Key Lesson", detail: "A good plan now beats a perfect plan in two hours" },
    ],
  },
  {
    acronym: "STOP",
    fullName: "Stop — Think — Observe — Plan",
    color: "text-orange-400",
    bg: "bg-orange-900/15 border-orange-800/40",
    description: "A wilderness survival framework taught by the US Army Survival Manual (FM 21-76) and adopted by SAR teams worldwide. Used in any sudden crisis to prevent panic-driven bad decisions. When a situation rapidly changes and you feel overwhelmed — STOP.",
    application: "The moment you feel panic rising: physically stop moving. Think before acting. Observe your full situation. Then plan your next action.",
    example: [
      { tier: "Stop", detail: "Halt. Do not run. Do not react instinctively. Get physically still." },
      { tier: "Think", detail: "'What do I know for certain right now? What are my immediate threats?'" },
      { tier: "Observe", detail: "Survey 360 degrees. What resources do I have? Who is with me? Where are exits?" },
      { tier: "Plan", detail: "Make one specific decision and act on it. Reassess after execution." },
    ],
  },
];

function generateDownloadContent(scenario: Scenario): string {
  const line = "=".repeat(60);
  const thin = "-".repeat(60);
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return `${line}
CONCEALED FLORIDA — Emergency Action Plan Template
${scenario.title.toUpperCase()}
${line}

This is an editable template. Fill in the bracketed sections
with your specific information. Review and update every 6 months.

Template Created: ${date}
Last Updated: ___________
Household Members Covered: ___________

Source Standard: ${scenario.source}

${thin}
SECTION 1: SITUATION OVERVIEW
${thin}

Scenario: ${scenario.subtitle}

My assessment of my personal risk for this scenario:
  Risk Level (High / Medium / Low): ___________
  Primary reason for my risk level: ___________
  Date of last review with family: ___________

${thin}
SECTION 2: STEP-BY-STEP ACTION PLAN
${thin}

${scenario.steps.map((step, i) => `${String(i + 1).padStart(2, "0")}. ${step}
    My specific action: ___________
    My specific resource/location: ___________
`).join("\n")}

${thin}
SECTION 3: MY SPECIFIC INFORMATION (Fill In)
${thin}

${scenario.fillIns.map((fi) => fi).join("\n")}

${thin}
SECTION 4: APPLY THE PACE FRAMEWORK TO THIS PLAN
${thin}

For each critical capability in this plan, identify 4 levels of backup.

COMMUNICATION:
  Primary:     ___________
  Alternate:   ___________
  Contingency: ___________
  Emergency:   ___________

EVACUATION ROUTE:
  Primary:     ___________
  Alternate:   ___________
  Contingency: ___________
  Emergency:   ___________

WATER SOURCE:
  Primary:     ___________
  Alternate:   ___________
  Contingency: ___________
  Emergency:   ___________

${thin}
SECTION 5: BRIEF YOUR HOUSEHOLD — SMEAC FORMAT
${thin}

Use this format to brief everyone in your household when you
activate this plan. Walk through it verbally before an emergency.

SITUATION (What is happening):
  ___________

MISSION (What we are doing):
  ___________

EXECUTION (Step by step, who does what):
  ___________

ADMINISTRATION/LOGISTICS (Supplies, vehicles, money on hand):
  ___________

COMMAND (Who is in charge; what happens if they are unavailable):
  ___________

${thin}
SECTION 6: EMERGENCY CONTACTS
${thin}

911:                              (always first for life threats)
Out-of-state contact name/number: ___________
Local backup contact name/number: ___________
FEMA Disaster Assistance:         1-800-621-3362
211 Florida (local resources):    2-1-1
Red Cross:                        1-800-733-2767
Florida Disaster:                 FloridaDisaster.org
My county emergency management:   ___________
My nearest shelter address:       ___________

${thin}
SECTION 7: SUPPLIES CHECKLIST FOR THIS SCENARIO
${thin}

Mark each item:  [ ] Not Started  [P] Partial  [X] Complete

[ ] 14-day water supply stored
[ ] 30-day food supply stored
[ ] Go-bags packed and near exit
[ ] Fuel tank full / fuel cans treated
[ ] Documents copied and accessible
[ ] Medications (30+ day supply) in go-bag
[ ] NOAA radio programmed
[ ] Family plan reviewed and rehearsed
[ ] Out-of-state contact informed of plan
[ ] ___________
[ ] ___________

${thin}
SECTION 8: NOTES & ADDITIONAL PLANNING
${thin}

Use this space for anything specific to your household, neighborhood,
or situation not covered above:

___________
___________
___________
___________
___________

${line}
CONCEALED FLORIDA — ConcealedFlorida.com
We are ready. We are watching. We are hiding in plain sight. We are Concealed Florida.
Template Version 1.0 | Reviewed against FEMA CPG-101
${line}
`;
}

function downloadPlanAsTxt(scenario: Scenario) {
  const content = generateDownloadContent(scenario);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `CF_${scenario.title.replace(/[^a-z0-9]+/gi, "_")}_Plan_Template.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadPlanAsWord(scenario: Scenario) {
  const raw = generateDownloadContent(scenario);
  const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = `<html><head><meta charset="utf-8"><title>${scenario.title}</title></head><body style="font-family:Arial,sans-serif;max-width:800px;margin:20px auto;line-height:1.7;white-space:pre-wrap;font-size:12pt">${escaped}</body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `CF_${scenario.title.replace(/[^a-z0-9]+/gi, "_")}_Plan_Template.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function printPlanAsPdf(scenario: Scenario) {
  const raw = generateDownloadContent(scenario);
  const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<html><head><title>${scenario.title} — Concealed Florida</title><style>body{font-family:monospace;font-size:11pt;white-space:pre-wrap;margin:24px;line-height:1.6}@media print{body{margin:12px}}</style></head><body>${escaped}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 400);
}

function DownloadMenu({ scenario }: { scenario: Scenario }) {
  return (
    <div className="relative group shrink-0" data-testid={`download-menu-${scenario.title.toLowerCase().replace(/\s+/g, "-").slice(0, 20)}`}>
      <Button
        variant="secondary"
        size="sm"
        className="flex items-center gap-2"
        data-testid={`button-download-${scenario.title.toLowerCase().replace(/\s+/g, "-").slice(0, 20)}`}
      >
        <Download className="w-3.5 h-3.5" />
        Download Template
      </Button>
      <div
        className="absolute top-full right-0 mt-0 w-44 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50
          invisible opacity-0 group-hover:visible group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto
          transition-opacity duration-100"
      >
        <button
          onClick={() => downloadPlanAsTxt(scenario)}
          data-testid="button-format-txt"
          className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-gray-500" />
          Text (.txt)
        </button>
        <button
          onClick={() => downloadPlanAsWord(scenario)}
          data-testid="button-format-word"
          className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          Word (.doc)
        </button>
        <button
          onClick={() => printPlanAsPdf(scenario)}
          data-testid="button-format-pdf"
          className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-red-400" />
          PDF (Print/Save)
        </button>
      </div>
    </div>
  );
}

export default function PlanningPage() {
  const [, navigate] = useLocation();

  return (
    <>
      <SEOHead
        title="Planning | Preparedness | Concealed Florida"
        description="Step-by-step emergency action plans with downloadable editable templates for hurricanes, floods, power outages, civil unrest, and family communication."
        path="/preparedness/planning"
      />
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/preparedness")}
            data-testid="button-back-preparedness"
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Preparedness
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 mt-2" data-testid="heading-planning">
            Planning
          </h1>
          <p className="text-gray-300 text-lg mb-3 max-w-3xl">
            The best time to make a plan is before you need one. These scenario-specific action plans walk you through exactly what to do — and include editable templates you can download, customize, and store with your go-bag.
          </p>
          <p className="text-gray-400 text-sm mb-10 max-w-3xl">
            Each plan downloads as a text file you can open and edit in any program — Word, Notes, Google Docs. Fill in your personal details, print it out, and keep one copy with your go-bag, one in your vehicle, and one somewhere visible at home.
          </p>

          {/* Military Planning Standards */}
          <section className="mb-14" data-testid="section-planning-standards">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Military Planning Standards</h2>
            </div>
            <p className="text-gray-300 text-sm mb-5">
              Military and special operations forces have developed planning frameworks over decades of high-stakes operations. These acronyms are included in every downloadable plan template — understand them before you need them.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {planningStandards.map((std) => (
                <Card key={std.acronym} className={`border ${std.bg}`} data-testid={`card-standard-${std.acronym.toLowerCase()}`}>
                  <CardHeader className="pb-2">
                    <div>
                      <CardTitle className={`${std.color} text-xl font-bold tracking-wider`}>{std.acronym}</CardTitle>
                      <p className="text-white text-sm font-semibold mt-0.5">{std.fullName}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">{std.description}</p>
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">Application</p>
                    <p className="text-gray-300 text-xs leading-relaxed mb-3">{std.application}</p>
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">Example</p>
                    <div className="space-y-1.5">
                      {std.example.map((ex) => (
                        <div key={ex.tier} className="flex items-start gap-2">
                          <span className={`text-xs font-bold ${std.color} w-24 shrink-0`}>{ex.tier}:</span>
                          <span className="text-gray-300 text-xs">{ex.detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Scenario Plans */}
          <section className="mb-14" data-testid="section-scenario-plans">
            <h2 className="text-2xl font-bold text-white mb-2">Emergency Action Plans</h2>
            <p className="text-gray-300 text-sm mb-6">
              Each plan below includes step-by-step actions, fill-in sections for your personal details, and the PACE and SMEAC frameworks pre-structured for your scenario. Download, customize, and store.
            </p>
            <div className="space-y-6">
              {scenarios.map((scenario) => {
                const Icon = scenario.icon;
                return (
                  <Card key={scenario.title} className="bg-secondary border-secondary" data-testid={`card-scenario-${scenario.title.toLowerCase().replace(/\s+/g, "-").slice(0, 25)}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${scenario.color} shrink-0`} />
                          <div>
                            <CardTitle className="text-white text-lg">{scenario.title}</CardTitle>
                            <p className="text-gray-400 text-xs mt-0.5">{scenario.subtitle}</p>
                            <p className="text-gray-500 text-xs mt-0.5 italic">{scenario.source}</p>
                          </div>
                        </div>
                        <DownloadMenu scenario={scenario} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">Step-by-Step Actions</p>
                      <ol className="space-y-2.5 mb-5">
                        {scenario.steps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className={`text-xs font-bold ${scenario.color} mt-0.5 shrink-0 w-5 text-right`}>
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                          </li>
                        ))}
                      </ol>
                      <div className="border-t border-gray-800 pt-4">
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">Key Fill-In Items (in your downloaded template)</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                          {scenario.fillIns.slice(0, 6).map((fi, i) => (
                            <p key={i} className="text-gray-500 text-xs">{fi}</p>
                          ))}
                        </div>
                        {scenario.fillIns.length > 6 && (
                          <p className="text-gray-600 text-xs mt-1">+{scenario.fillIns.length - 6} more fields in the downloaded template</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Resources */}
          <section className="mb-10" data-testid="section-resources">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <h2 className="text-xl font-bold text-white">Official Planning Resources</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: "FEMA Ready.gov — Individual Preparedness", detail: "The federal government's primary preparedness resource. Family communication plan templates, supply lists, and shelter-in-place guides.", url: "https://www.ready.gov" },
                { label: "Florida Division of Emergency Management", detail: "Evacuation zones, shelter locator, county emergency management contacts, and official disaster declarations for Florida.", url: "https://www.floridadisaster.org" },
                { label: "National Hurricane Center", detail: "NHC.NOAA.gov — 5-day storm track forecasts, evacuation guidance, and real-time storm data. Monitor during hurricane season.", url: "https://www.nhc.noaa.gov" },
                { label: "Know Your Zone — Florida", detail: "Official Florida evacuation zone lookup by address. Find your zone before the storm — not during it.", url: "https://www.floridadisaster.org/knowyourzone/" },
                { label: "FEMA Flood Map Service Center", detail: "MSC.FEMA.gov — official flood zone maps by address. Know your Zone A or AE status before buying or renting property in Florida.", url: "https://msc.fema.gov/portal/home" },
                { label: "American Red Cross Preparedness", detail: "Free family emergency plan templates, supply checklists, and first aid training course locator.", url: "https://www.redcross.org/get-help/how-to-prepare-for-emergencies.html" },
                { label: "FEMA CPG-101 — Comprehensive Preparedness Guide", detail: "The federal government's official framework for emergency operations planning. The same standard used by professional emergency managers.", url: "https://www.fema.gov/emergency-managers/national-preparedness/plan" },
                { label: "US Army Survival Manual FM 21-76", detail: "Free PDF from the Department of Defense. Covers survival psychology, shelter, water, fire, food, navigation, and signaling for rescue.", url: "https://archive.org/details/the-us-army-survival-manual-fm-21-76" },
              ].map((r) => (
                <Card key={r.label} className="bg-secondary border-secondary" data-testid={`card-resource-${r.label.toLowerCase().replace(/\s+/g, "-").slice(0, 25)}`}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm">{r.label}</p>
                        <p className="text-gray-300 text-xs leading-relaxed mt-0.5">{r.detail}</p>
                      </div>
                      <Button variant="secondary" size="sm" asChild className="shrink-0">
                        <a href={r.url} target="_blank" rel="noopener noreferrer" data-testid={`link-resource-${r.label.toLowerCase().replace(/\s+/g, "-").slice(0, 15)}`}>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <div className="bg-secondary border border-secondary rounded-lg p-4 flex gap-3 items-start">
            <AlertTriangle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <p className="text-gray-300 text-sm leading-relaxed">
              A plan in a drawer that no one has read is not a plan. Walk your household through each scenario at least once per year — ideally at the start of hurricane season (June 1). A 30-minute family review of these plans will do more good than any amount of gear purchased but never practiced.
            </p>
          </div>

        </div>
      </Layout>
    </>
  );
}
