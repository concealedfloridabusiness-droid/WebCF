import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Brain, Heart, Phone, Radio, MessageSquare,
  AlertCircle, ExternalLink, ChevronRight, Eye, Compass, MousePointer, Zap, Play, Download, Printer
} from "lucide-react";

const commsRules = [
  {
    rule: "Say Only What Matters",
    detail: "In an emergency, every word costs time. Stick to four things: Who you are. What happened. Where you are. What you need. Nothing else. Save the details for after help arrives. Practice this out loud before you ever need it.",
  },
  {
    rule: "Speak Slowly and Clearly",
    detail: "Adrenaline speeds up speech. Consciously slow down — you will feel like you're speaking too slowly, and you will actually be speaking at the right pace. Enunciate every syllable. On radio especially: the other person cannot ask you to repeat yourself in a true emergency.",
  },
  {
    rule: "Confirm Receipt",
    detail: "Never assume your message was received. Wait for an acknowledgment — 'Copy,' 'Understood,' or a repeat-back. If none comes, repeat your message. On radio protocol: 'Station receiving, please acknowledge.' Unacknowledged messages may as well not have been sent.",
  },
  {
    rule: "No Emotional Content on Radio",
    detail: "Fear, panic, and argument slow down emergency response and compromise the channel for others. State facts only: location, number of people, nature of injuries, resources needed. Emotional content belongs in face-to-face conversation — never on emergency frequencies.",
  },
  {
    rule: "Priority Traffic — 'Break Break Break'",
    detail: "On amateur or CB radio, 'Break break break' (said three times) signals urgent priority traffic that interrupts any ongoing conversation. Follow immediately with your call sign and nature of emergency. Use this only for genuine life-safety communication — never casually.",
  },
  {
    rule: "SMEAC for Group Briefings",
    detail: "When briefing a group under stress, use the military-standard SMEAC format: Situation (what is happening), Mission (what we are doing), Execution (how we are doing it step by step), Administration/Logistics (supplies, communications plan), Command (who is in charge and succession). This structure forces clarity and prevents critical omissions.",
  },
  {
    rule: "The Four W's — Your Emergency Script",
    detail: "Memorize this sequence for any emergency call: WHO (your name), WHAT (what happened — one sentence), WHERE (exact address or cross-streets), WHEN/HOW MANY (when it happened, how many people are involved). Then stop talking and answer questions. First responders are trained to extract information from a calm structured caller.",
  },
  {
    rule: "Designate One Speaker Per Group",
    detail: "In a group emergency, multiple people talking simultaneously creates radio chaos. Designate one person to communicate externally. Everyone else focuses on physical tasks. Rotate roles only when necessary and with a clear handoff. 'John is now handling comms' — then John confirms.",
  },
];

const helpResources = [
  {
    category: "Life-Threatening Emergency",
    resources: [
      { label: "911", detail: "Police, Fire, EMS — always your first call for any immediate life threat. Stay on the line. Follow dispatcher instructions exactly.", link: null },
    ],
  },
  {
    category: "Federal Disaster Assistance",
    resources: [
      { label: "FEMA Disaster Assistance", detail: "1-800-621-3362 | DisasterAssistance.gov — apply for housing, utilities, and financial aid after a federally declared disaster. Apply as soon as possible — aid is first-come, first-served.", link: "https://www.disasterassistance.gov" },
      { label: "FEMA National Flood Insurance Program", detail: "1-877-336-2627 — flood insurance claims, policy questions, and coverage verification", link: "https://www.fema.gov/flood-insurance" },
      { label: "FEMA Ready.gov", detail: "Federally curated preparedness resources. Emergency plans, supply lists, family communication templates.", link: "https://www.ready.gov" },
    ],
  },
  {
    category: "Florida State Emergency Resources",
    resources: [
      { label: "Florida Division of Emergency Management", detail: "FloridaDisaster.org — official evacuation zones, shelter locator, county emergency contacts, and real-time disaster updates", link: "https://www.floridadisaster.org" },
      { label: "211 Florida", detail: "Dial 2-1-1 or text your zip code to 898-211 — connects you to local food, shelter, utilities assistance, and mental health services. Free, 24/7.", link: "https://www.211florida.org" },
      { label: "Florida Health Emergency", detail: "FloridaHealth.gov — public health emergencies, disease outbreaks, heat advisories, county health department contacts", link: "https://www.floridahealth.gov" },
      { label: "Know Your Zone Florida", detail: "KnowYourZone.com — find your official evacuation zone and know when mandatory orders apply to you", link: "https://www.floridadisaster.org/knowyourzone/" },
    ],
  },
  {
    category: "American Red Cross",
    resources: [
      { label: "Red Cross Emergency Line", detail: "1-800-733-2767 | RedCross.org — shelter locations, emergency food and water, emergency supplies, disaster mental health counselors", link: "https://www.redcross.org" },
      { label: "Red Cross Safe & Well Registry", detail: "Register yourself as safe after a disaster, or search for family members. Used by first responders and emergency managers.", link: "https://www.redcross.org/get-help/disaster-relief-and-recovery-services/contact-and-locate-loved-ones.html" },
    ],
  },
  {
    category: "Salvation Army & Community Aid",
    resources: [
      { label: "Salvation Army Emergency Services", detail: "1-800-725-2769 — disaster relief, mobile feeding units, emotional and spiritual care, emergency financial assistance", link: "https://www.salvationarmyusa.org" },
      { label: "National VOAD", detail: "NVOAD.org — Voluntary Organizations Active in Disaster. Coordinates over 80 national organizations providing disaster recovery services.", link: "https://www.nvoad.org" },
    ],
  },
  {
    category: "Mental Health Crisis",
    resources: [
      { label: "988 Suicide & Crisis Lifeline", detail: "Call or text 988 — 24/7 crisis support staffed by trained counselors. Includes disaster-related trauma, grief, and acute stress.", link: "https://988lifeline.org" },
      { label: "SAMHSA Disaster Distress Helpline", detail: "1-800-985-5990 — specifically for emotional distress related to disasters. Call or text 'TalkWithUs' to 66746. Free, multilingual, 24/7.", link: "https://www.samhsa.gov/find-help/disaster-distress-helpline" },
      { label: "Crisis Text Line", detail: "Text HOME to 741741 — confidential crisis support by text. Useful when voice calls are difficult.", link: "https://www.crisistextline.org" },
    ],
  },
];

const noaaFrequencies = [
  { freq: "162.400 MHz", coverage: "WX1 — Primary (most reliable statewide/nationwide)" },
  { freq: "162.425 MHz", coverage: "WX2 — Secondary — coastal and central FL" },
  { freq: "162.450 MHz", coverage: "WX3 — South Florida and Florida Keys" },
  { freq: "162.475 MHz", coverage: "WX4 — North Florida and panhandle" },
  { freq: "162.500 MHz", coverage: "WX5 — Primary Gulf Coast coverage" },
  { freq: "162.525 MHz", coverage: "WX6 — Central and east coast coverage" },
  { freq: "162.550 MHz", coverage: "WX7 — Backup multi-region (all 7 are used nationwide)" },
];

const hamFrequencies = [
  { freq: "146.520 MHz", label: "National 2m VHF Simplex Calling Frequency — monitor here first for emergency contact initiation" },
  { freq: "146.400–146.580 MHz", label: "2m simplex working band — move here after initial contact on 146.520 to free up the calling frequency" },
  { freq: "446.000 MHz", label: "National 70cm UHF Simplex Calling Frequency — shorter range than 2m but better in urban/dense areas" },
  { freq: "ARES/RACES County Nets", label: "Each county operates its own Amateur Radio Emergency Service net. FL: FloridaARES.org — find your county net" },
  { freq: "SKYWARN Spotters", label: "NWS-coordinated severe weather spotting program. SKYWARN nets activate during tropical and severe weather events" },
];

const nationalFrequencies = [
  {
    category: "Marine VHF",
    color: "text-blue-400",
    entries: [
      { freq: "Ch. 16 — 156.800 MHz", label: "INTERNATIONAL DISTRESS & CALLING — monitored 24/7 by US Coast Guard and all vessels. Your first call on water." },
      { freq: "Ch. 22A — 157.100 MHz", label: "US Coast Guard working channel — switch here after initial contact on Channel 16" },
      { freq: "Ch. 9 — 156.450 MHz", label: "Recreational boater calling channel — used by boaters not listening on Ch. 16" },
    ],
  },
  {
    category: "CB Radio (No License Required)",
    color: "text-yellow-400",
    entries: [
      { freq: "Ch. 9 — 27.065 MHz", label: "NATIONAL EMERGENCY CHANNEL — monitored by REACT International and many law enforcement agencies. First CB call for emergency." },
      { freq: "Ch. 19 — 27.185 MHz", label: "National truckers' channel — road conditions, accidents, and traffic. Extremely active on major highways." },
      { freq: "Ch. 17 — 27.165 MHz", label: "Backup truckers' channel — used on I-5 West and in western states" },
    ],
  },
  {
    category: "FRS / GMRS (Family Radio)",
    color: "text-green-400",
    entries: [
      { freq: "Ch. 1 — 462.5625 MHz", label: "Most commonly used FRS channel. No license required for FRS (0.5W). GMRS requires FCC license ($35 for 10 years, covers family)." },
      { freq: "Ch. 3 — 462.6125 MHz", label: "Second most common FRS channel — good backup if Ch. 1 is busy" },
      { freq: "Ch. 20 — 462.6500 MHz", label: "GMRS simplex calling channel — widely used by prepared families" },
    ],
  },
  {
    category: "MURS (Multi-Use Radio Service)",
    color: "text-purple-400",
    entries: [
      { freq: "151.820 MHz", label: "MURS Ch. 1 — No license required. 2W max power. Better range than FRS. Used by farms, ranches, and preparedness groups." },
      { freq: "151.880 MHz", label: "MURS Ch. 2" },
      { freq: "151.940 MHz", label: "MURS Ch. 3" },
      { freq: "154.570 MHz", label: "MURS Ch. 4" },
      { freq: "154.600 MHz", label: "MURS Ch. 5" },
    ],
  },
  {
    category: "Aviation & Military Guard",
    color: "text-red-400",
    entries: [
      { freq: "121.500 MHz", label: "INTERNATIONAL AERONAUTICAL DISTRESS — monitored by all commercial aircraft, military aircraft, and air traffic control 24/7. ELT (Emergency Locator Transmitter) transmits here." },
      { freq: "243.000 MHz", label: "Military UHF Guard frequency — monitored by all military aircraft and installations. Civilian ELTs also broadcast here on 406 MHz." },
    ],
  },
  {
    category: "Satellite & Digital",
    color: "text-cyan-400",
    entries: [
      { freq: "406 MHz", label: "EPIRB / PLB / ELT distress beacon frequency — detected by COSPAS-SARSAT satellite network. Registered beacons trigger search and rescue." },
      { freq: "Iridium Network", label: "Satellite phones and Garmin inReach use Iridium — 66 satellites, global coverage. Works anywhere on Earth." },
    ],
  },
];

function generateRadioReferenceDownload(): string {
  const line = "=".repeat(65);
  const thin = "-".repeat(65);
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return `${line}
CONCEALED FLORIDA — Emergency Radio Frequency Reference Card
Printed/Downloaded: ${date}
ConcealedFlorida.com
${line}

PROGRAM THESE INTO YOUR RADIO BEFORE AN EMERGENCY.
This reference covers Florida-specific and national/international
emergency frequencies for all radio types.

${thin}
SECTION 1: NOAA WEATHER RADIO (ALL 7 ARE USED NATIONWIDE)
${thin}

Program ALL of these into your emergency weather radio.
NOAA broadcasts 24/7 weather alerts, warnings, and watches.

  WX1   162.400 MHz   Primary — most reliable, statewide/nationwide
  WX2   162.425 MHz   Secondary — coastal and central FL
  WX3   162.450 MHz   South Florida and Florida Keys
  WX4   162.475 MHz   North Florida and panhandle
  WX5   162.500 MHz   Primary Gulf Coast
  WX6   162.525 MHz   Central and east coast FL
  WX7   162.550 MHz   Backup — multi-region

SAME Code: Program your county's SAME code for local-only alerts.
Find your code at: weather.gov/nwr/counties

${thin}
SECTION 2: AMATEUR (HAM) RADIO — CALLING FREQUENCIES
${thin}

License required to transmit (Technician class, one day to study).
Anyone can LISTEN on these frequencies without a license.

  146.520 MHz      National 2m VHF Simplex Calling Frequency
                   MONITOR HERE FIRST. Make initial contact, then
                   move to a working frequency (146.400-146.580 MHz).

  446.000 MHz      National 70cm UHF Simplex Calling Frequency
                   Better in urban/dense areas. Shorter range than 2m.

  ARES/RACES Nets  Each county has an emergency net frequency.
                   FL: FloridaARES.org — find your county.

  SKYWARN          NWS severe weather spotter nets — active during
                   tropical and severe weather events.

Get licensed: arrl.org/getting-licensed ($15 exam fee)
Study free: HamStudy.org (most pass after 1–2 weeks of study)

${thin}
SECTION 3: MARINE VHF (BOATS & WATERWAYS)
${thin}

  Ch. 16  156.800 MHz   INTERNATIONAL DISTRESS & CALLING
                         Monitored 24/7 by US Coast Guard and all vessels.
                         FIRST CALL FOR ANY MARITIME EMERGENCY.
                         Say "MAYDAY MAYDAY MAYDAY" for life-threatening.
                         Say "PAN-PAN PAN-PAN PAN-PAN" for urgent, non-life.

  Ch. 22A 157.100 MHz   US Coast Guard working channel
                         Switch here after initial contact on Ch. 16.

  Ch. 9   156.450 MHz   Recreational boater calling channel

${thin}
SECTION 4: CB RADIO (NO LICENSE REQUIRED — 40 CHANNELS)
${thin}

  Ch. 9   27.065 MHz    NATIONAL EMERGENCY CHANNEL
                         Monitored by REACT International and law enforcement.
                         Say: "EMERGENCY — [your location] — [what you need]"

  Ch. 19  27.185 MHz    National truckers' channel
                         Road conditions, accidents, traffic on major highways.

  Ch. 17  27.165 MHz    Backup truckers' channel (western US primary)

${thin}
SECTION 5: FRS / GMRS (FAMILY RADIOS)
${thin}

FRS (0.5W max): No license required. Short range (0.5–3 miles).
GMRS (5W+): Requires FCC license — $35 for 10 years, covers family.

  Ch. 1   462.5625 MHz  Most commonly used. Good for neighborhood comms.
  Ch. 3   462.6125 MHz  Common backup channel
  Ch. 20  462.6500 MHz  GMRS simplex calling channel

TIP: Agree on a channel + privacy code with your family BEFORE
     any emergency. Test range at your home.

${thin}
SECTION 6: MURS (NO LICENSE REQUIRED — 2W, BETTER RANGE)
${thin}

  MURS Ch. 1  151.820 MHz
  MURS Ch. 2  151.880 MHz
  MURS Ch. 3  151.940 MHz
  MURS Ch. 4  154.570 MHz
  MURS Ch. 5  154.600 MHz

Used by farms, ranches, and preparedness communities.
Better range and less interference than FRS.

${thin}
SECTION 7: AVIATION & MILITARY (DISTRESS ONLY)
${thin}

  121.500 MHz   INTERNATIONAL AERONAUTICAL DISTRESS (GUARD)
                Monitored by ALL commercial and military aircraft,
                and ATC worldwide. ELT beacons transmit here.

  243.000 MHz   Military UHF Guard — monitored by military aircraft
                and installations worldwide.

${thin}
SECTION 8: SATELLITE DISTRESS SIGNALS
${thin}

  406 MHz       EPIRB, PLB, and ELT distress beacon frequency.
                Detected by COSPAS-SARSAT satellite network globally.
                Register your beacon at: beaconregistration.noaa.gov

  Iridium       Garmin inReach, Iridium satellite phones.
                Works anywhere on Earth. Requires subscription.

${thin}
SECTION 9: YOUR LOCAL FREQUENCIES (FILL IN)
${thin}

  My county ARES/RACES net: ____________________________
  My county NOAA SAME code: ____________________________
  My family FRS channel + code: ________________________
  My neighborhood/group frequency: _____________________
  Local repeater (if licensed ham): ___________________

${thin}
SECTION 10: EMERGENCY RADIO PROTOCOL
${thin}

  MAYDAY          Life-threatening emergency (3x before message)
  PAN-PAN         Urgent situation, not immediately life-threatening
  BREAK BREAK     Priority traffic on amateur/CB radio (interrupt)
  ROGER           Message received and understood
  WILCO           Will comply with instruction
  SAY AGAIN       Repeat your last message
  OVER            My transmission is complete, reply expected
  OUT             Conversation is complete, no reply expected

  Format for any emergency call:
  1. MAYDAY/PAN-PAN (x3)
  2. Your ID (name or call sign)
  3. Your LOCATION (be specific — address, GPS, landmarks)
  4. Nature of EMERGENCY
  5. Number of people / injuries
  6. Resources needed (medical, rescue, fire)

${line}
CONCEALED FLORIDA — ConcealedFlorida.com
"Always Ready, Always Watching, Never Hidden"
Sources: NOAA NWS, FCC, USCG, ARRL, REACT International
${line}
`;
}

function generateHelpResourcesDownload(): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const lines: string[] = [
    "CONCEALED FLORIDA — Emergency Help Resources Reference",
    "======================================================",
    "ConcealedFlorida.com | Know before you need it.",
    `Downloaded: ${date}`,
    "",
    "MEMORIZE THESE NUMBERS:",
    "  911            — Police / Fire / EMS (all life-threatening emergencies)",
    "  211            — Local services, shelter, food, utilities (24/7, free)",
    "  988            — Suicide & Crisis Lifeline (call or text, 24/7)",
    "  1-800-621-3362 — FEMA Disaster Assistance",
    "  1-800-733-2767 — American Red Cross",
    "  1-800-985-5990 — SAMHSA Disaster Distress Helpline",
    "",
  ];
  for (const group of helpResources) {
    lines.push("────────────────────────────────────────────────────");
    lines.push(group.category.toUpperCase());
    lines.push("────────────────────────────────────────────────────");
    for (const r of group.resources) {
      lines.push(`  ${r.label}`);
      lines.push(`  ${r.detail}`);
      if (r.link) lines.push(`  Link: ${r.link}`);
      lines.push("");
    }
  }
  lines.push("────────────────────────────────────────────────────");
  lines.push("Program numbers into your phone today. Store a printed copy");
  lines.push("in your go-bag, vehicle glove box, and home emergency kit.");
  lines.push("────────────────────────────────────────────────────");
  lines.push("CONCEALED FLORIDA — ConcealedFlorida.com");
  return lines.join("\n");
}

function downloadHelpAsTxt() {
  const content = generateHelpResourcesDownload();
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "CF_Emergency_Help_Resources.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadHelpAsWord() {
  const raw = generateHelpResourcesDownload();
  const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = `<html><head><meta charset="utf-8"><title>CF Emergency Help Resources</title></head><body style="font-family:Arial,sans-serif;max-width:800px;margin:20px auto;line-height:1.7;white-space:pre-wrap;font-size:11pt">${escaped}</body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "CF_Emergency_Help_Resources.doc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function printHelpAsPdf() {
  const raw = generateHelpResourcesDownload();
  const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<html><head><title>CF Emergency Help Resources — Concealed Florida</title><style>body{font-family:monospace;font-size:10pt;white-space:pre-wrap;margin:20px;line-height:1.6}@media print{body{margin:12px;font-size:9pt}}</style></head><body>${escaped}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 400);
}

function downloadRadioAsTxt() {
  const content = generateRadioReferenceDownload();
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "CF_Emergency_Radio_Frequency_Reference.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadRadioAsWord() {
  const raw = generateRadioReferenceDownload();
  const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = `<html><head><meta charset="utf-8"><title>CF Radio Frequency Reference</title></head><body style="font-family:Arial,sans-serif;max-width:800px;margin:20px auto;line-height:1.7;white-space:pre-wrap;font-size:11pt">${escaped}</body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "CF_Emergency_Radio_Frequency_Reference.doc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function printRadioAsPdf() {
  const raw = generateRadioReferenceDownload();
  const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<html><head><title>CF Radio Frequency Reference — Concealed Florida</title><style>body{font-family:monospace;font-size:10pt;white-space:pre-wrap;margin:20px;line-height:1.6}@media print{body{margin:12px;font-size:9pt}}</style></head><body>${escaped}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 400);
}

function generateChirpCsv(): string {
  const rows = [
    "Location,Name,Frequency,Duplex,Offset,Tone,rToneFreq,cToneFreq,DtcsCode,DtcsPolarity,Mode,TStep,Skip,Comment",
    "0,NOAA-WX1,162.400000,,0.000000,,88.5,88.5,023,NN,FM,25.00,,WX1 - NOAA Weather Radio - Primary",
    "1,NOAA-WX2,162.425000,,0.000000,,88.5,88.5,023,NN,FM,25.00,,WX2 - NOAA Weather Radio - Secondary",
    "2,NOAA-WX3,162.450000,,0.000000,,88.5,88.5,023,NN,FM,25.00,,WX3 - NOAA Weather Radio - South FL",
    "3,NOAA-WX4,162.475000,,0.000000,,88.5,88.5,023,NN,FM,25.00,,WX4 - NOAA Weather Radio - North FL",
    "4,NOAA-WX5,162.500000,,0.000000,,88.5,88.5,023,NN,FM,25.00,,WX5 - NOAA Weather Radio - Gulf Coast",
    "5,NOAA-WX6,162.525000,,0.000000,,88.5,88.5,023,NN,FM,25.00,,WX6 - NOAA Weather Radio - East Coast",
    "6,NOAA-WX7,162.550000,,0.000000,,88.5,88.5,023,NN,FM,25.00,,WX7 - NOAA Weather Radio - Backup",
    "7,HAM-CALL,146.520000,,0.000000,,88.5,88.5,023,NN,FM,5.00,,National 2m VHF Simplex Calling Frequency",
    "8,HAM-70CM,446.000000,,0.000000,,88.5,88.5,023,NN,FM,5.00,,National 70cm UHF Simplex Calling Frequency",
    "9,MAR-CH16,156.800000,,0.000000,,88.5,88.5,023,NN,FM,25.00,,Marine VHF Ch 16 - International Distress & Calling",
    "10,MAR-CH22A,157.100000,,0.000000,,88.5,88.5,023,NN,FM,25.00,,Marine VHF Ch 22A - USCG Working Channel",
    "11,MAR-CH9,156.450000,,0.000000,,88.5,88.5,023,NN,FM,25.00,,Marine VHF Ch 9 - Recreational Boater Calling",
    "12,FRS-CH1,462.562500,,0.000000,,88.5,88.5,023,NN,NFM,12.50,,FRS/GMRS Ch 1 - Most Common Family Radio Channel",
    "13,FRS-CH3,462.612500,,0.000000,,88.5,88.5,023,NN,NFM,12.50,,FRS/GMRS Ch 3 - Common Backup Channel",
    "14,GMRS-CH20,462.650000,,0.000000,,88.5,88.5,023,NN,NFM,12.50,,GMRS Ch 20 - Simplex Calling (License Required)",
    "15,MURS-1,151.820000,,0.000000,,88.5,88.5,023,NN,NFM,25.00,,MURS Ch 1 - No License Required",
    "16,MURS-2,151.880000,,0.000000,,88.5,88.5,023,NN,NFM,25.00,,MURS Ch 2 - No License Required",
    "17,MURS-3,151.940000,,0.000000,,88.5,88.5,023,NN,NFM,25.00,,MURS Ch 3 - No License Required",
    "18,MURS-4,154.570000,,0.000000,,88.5,88.5,023,NN,NFM,25.00,,MURS Ch 4 - No License Required",
    "19,MURS-5,154.600000,,0.000000,,88.5,88.5,023,NN,NFM,25.00,,MURS Ch 5 - No License Required",
  ];
  return rows.join("\n");
}

function downloadChirpCsv() {
  const content = generateChirpCsv();
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "CF_Emergency_Frequencies_CHIRP.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateMorseReferenceDownload(): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const lines: string[] = [];
  lines.push("================================================================");
  lines.push("  CF MORSE CODE REFERENCE — Concealed Florida");
  lines.push("================================================================");
  lines.push(`  Downloaded: ${date}`);
  lines.push("  Standard: ITU-R M.1677-1");
  lines.push("================================================================");
  lines.push("");
  lines.push("SOS — THE UNIVERSAL DISTRESS SIGNAL");
  lines.push("------------------------------------");
  lines.push("  Pattern:  . . .  — — —  . . .  (S O S)");
  lines.push("");
  lines.push("  Flashlight / Mirror:");
  lines.push("    3 short flashes — 3 long flashes — 3 short flashes");
  lines.push("    Pause 10 seconds. Repeat continuously.");
  lines.push("");
  lines.push("  Whistle / Horn:");
  lines.push("    3 short blasts — 3 long blasts — 3 short blasts");
  lines.push("    Pause. Repeat.");
  lines.push("");
  lines.push("  Radio (keyed tone):");
  lines.push("    Dot = short press. Dash = long press (3x dot length).");
  lines.push("    Universally understood on all frequencies.");
  lines.push("");
  lines.push("  Sound / Knock:");
  lines.push("    3 rapid — 3 slow — 3 rapid. Works through walls and debris.");
  lines.push("");
  lines.push("================================================================");
  lines.push("ALPHABET (A–Z)");
  lines.push("================================================================");
  const alphabet: { char: string; code: string }[] = [
    { char: "A", code: ". —" }, { char: "B", code: "— . . ." },
    { char: "C", code: "— . — ." }, { char: "D", code: "— . ." },
    { char: "E", code: "." }, { char: "F", code: ". . — ." },
    { char: "G", code: "— — ." }, { char: "H", code: ". . . ." },
    { char: "I", code: ". ." }, { char: "J", code: ". — — —" },
    { char: "K", code: "— . —" }, { char: "L", code: ". — . ." },
    { char: "M", code: "— —" }, { char: "N", code: "— ." },
    { char: "O", code: "— — —" }, { char: "P", code: ". — — ." },
    { char: "Q", code: "— — . —" }, { char: "R", code: ". — ." },
    { char: "S", code: ". . ." }, { char: "T", code: "—" },
    { char: "U", code: ". . —" }, { char: "V", code: ". . . —" },
    { char: "W", code: ". — —" }, { char: "X", code: "— . . —" },
    { char: "Y", code: "— . — —" }, { char: "Z", code: "— — . ." },
  ];
  for (let i = 0; i < alphabet.length; i += 2) {
    const left = `  ${alphabet[i].char}  ${alphabet[i].code}`;
    const right = alphabet[i + 1] ? `        ${alphabet[i + 1].char}  ${alphabet[i + 1].code}` : "";
    lines.push(left + right);
  }
  lines.push("");
  lines.push("================================================================");
  lines.push("DIGITS (0–9)");
  lines.push("================================================================");
  const digits: { char: string; code: string }[] = [
    { char: "1", code: ". — — — —" }, { char: "2", code: ". . — — —" },
    { char: "3", code: ". . . — —" }, { char: "4", code: ". . . . —" },
    { char: "5", code: ". . . . ." }, { char: "6", code: "— . . . ." },
    { char: "7", code: "— — . . ." }, { char: "8", code: "— — — . ." },
    { char: "9", code: "— — — — ." }, { char: "0", code: "— — — — —" },
  ];
  for (let i = 0; i < digits.length; i += 2) {
    const left = `  ${digits[i].char}  ${digits[i].code}`;
    const right = digits[i + 1] ? `        ${digits[i + 1].char}  ${digits[i + 1].code}` : "";
    lines.push(left + right);
  }
  lines.push("");
  lines.push("================================================================");
  lines.push("TIMING RULES");
  lines.push("================================================================");
  lines.push("  Dot (.)                          = 1 unit");
  lines.push("  Dash (—)                         = 3 units");
  lines.push("  Between symbols (same letter)    = 1 unit gap");
  lines.push("  Between letters                  = 3 unit gap");
  lines.push("  Between words                    = 7 unit gap");
  lines.push("");
  lines.push("  A 'unit' is any consistent time interval — choose one");
  lines.push("  that works for your signaling method and stick to it.");
  lines.push("");
  lines.push("================================================================");
  lines.push("  Concealed Florida");
  lines.push("  Keep one copy in your go-bag, vehicle, and emergency kit.");
  lines.push("================================================================");
  return lines.join("\n");
}

function downloadMorseAsTxt() {
  const content = generateMorseReferenceDownload();
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "CF_Morse_Code_Reference.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadMorseAsWord() {
  const raw = generateMorseReferenceDownload();
  const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = `<html><head><meta charset="utf-8"><title>CF Morse Code Reference</title></head><body style="font-family:Arial,sans-serif;max-width:800px;margin:20px auto;line-height:1.7;white-space:pre-wrap;font-size:12pt">${escaped}</body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "CF_Morse_Code_Reference.doc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function printMorseAsPdf() {
  const raw = generateMorseReferenceDownload();
  const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<html><head><title>CF Morse Code Reference — Concealed Florida</title><style>body{font-family:monospace;font-size:10pt;white-space:pre-wrap;margin:20px;line-height:1.6}@media print{body{margin:12px;font-size:9pt}}</style></head><body>${escaped}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 400);
}

const morseAlphabet: { char: string; code: string }[] = [
  { char: "A", code: ". —" },
  { char: "B", code: "— . . ." },
  { char: "C", code: "— . — ." },
  { char: "D", code: "— . ." },
  { char: "E", code: "." },
  { char: "F", code: ". . — ." },
  { char: "G", code: "— — ." },
  { char: "H", code: ". . . ." },
  { char: "I", code: ". ." },
  { char: "J", code: ". — — —" },
  { char: "K", code: "— . —" },
  { char: "L", code: ". — . ." },
  { char: "M", code: "— —" },
  { char: "N", code: "— ." },
  { char: "O", code: "— — —" },
  { char: "P", code: ". — — ." },
  { char: "Q", code: "— — . —" },
  { char: "R", code: ". — ." },
  { char: "S", code: ". . ." },
  { char: "T", code: "—" },
  { char: "U", code: ". . —" },
  { char: "V", code: ". . . —" },
  { char: "W", code: ". — —" },
  { char: "X", code: "— . . —" },
  { char: "Y", code: "— . — —" },
  { char: "Z", code: "— — . ." },
];

const morseDigits: { char: string; code: string }[] = [
  { char: "1", code: ". — — — —" },
  { char: "2", code: ". . — — —" },
  { char: "3", code: ". . . — —" },
  { char: "4", code: ". . . . —" },
  { char: "5", code: ". . . . ." },
  { char: "6", code: "— . . . ." },
  { char: "7", code: "— — . . ." },
  { char: "8", code: "— — — . ." },
  { char: "9", code: "— — — — ." },
  { char: "0", code: "— — — — —" },
];

const faithPrinciples = [
  {
    title: "Spiritual Grounding in Crisis",
    description: "This is not a soft consideration — it is measurable. FEMA and academic disaster researchers have documented consistently that faith communities recover faster from disasters. The mechanism is clear: pre-existing relationships, shared values, mutual aid infrastructure, and a sense of transcendent purpose all reduce panic, rebuild trust, and motivate people to sacrifice for others. Faith is infrastructure.",
    source: "Source: FEMA — 'The Role of Faith-Based Organizations in Disaster Response and Recovery'",
  },
  {
    title: "Moral Framework When Systems Break",
    description: "When institutions fail, what remains is character. A solid moral framework — knowing what you will and will not do before the crisis — prevents the moral injury that comes from making desperate improvised decisions under extreme pressure. First responders, military operators, and disaster survivors all report that pre-established moral lines reduce decision paralysis and regret. Know your lines before you need them.",
    source: "Source: VA — Combat Moral Injury Research, 2019",
  },
  {
    title: "Community Is Your Greatest Survival Asset",
    description: "No individual out-survives a prepared community. Your faith community is a pre-existing mutual aid network with real-world trust bonds already formed. Know your neighbors. Know who has skills — who is a nurse, a mechanic, a ham radio operator, a carpenter. Communities that know and trust each other before a disaster outperform isolated individuals and even many government resources in the first 72 critical hours.",
    source: "Source: Solnit, Rebecca — 'A Paradise Built in Hell' (2009); FEMA CPG 101",
  },
  {
    title: "Hope Is Functional — Not Naive",
    description: "Hope is not wishful thinking. It is the conviction that effort matters — that what you do right now affects what happens next. In sustained crisis situations, hopelessness is the primary cause of inaction and delayed recovery. Psychologists studying survivor accounts from hurricanes, wars, and mass casualty events consistently identify hope — often faith-grounded hope — as the differentiating factor between those who recover and those who don't. Cultivate it intentionally.",
    source: "Source: Frankl, Viktor — 'Man's Search for Meaning'; APA Disaster Mental Health Guidelines",
  },
  {
    title: "Keep Connected to Your Faith Community",
    description: "A faith community you are actively part of is a real-world resource network before and after a disaster. They will know where the shelters are opening before the news does. They will show up with food and labor before FEMA processes your first application. Stay active in your community of faith — not as a backup plan, but as a way of life that happens to build exactly the resilience infrastructure you need when things break down.",
    source: "",
  },
];

const oodaPhases = [
  {
    icon: Eye,
    phase: "OBSERVE",
    color: "text-blue-400",
    bg: "bg-blue-900/20 border-blue-800/40",
    definition: "Gather raw data from your environment with all senses — sight, sound, smell, physical sensation. Do not interpret yet. Just collect.",
    examples: [
      "You hear a crash in your house at 2am.",
      "You see water rising faster than expected on your street.",
      "You smell smoke before any alarm sounds.",
      "A crowd nearby is moving in an unusual, accelerating pattern.",
    ],
    key: "Speed of observation = speed of everything else. Do not close your eyes to what is happening.",
  },
  {
    icon: Compass,
    phase: "ORIENT",
    color: "text-yellow-400",
    bg: "bg-yellow-900/20 border-yellow-800/40",
    definition: "Filter your observations through your mental models — training, past experience, cultural norms, and mental maps of the situation. This is the most critical and most trainable phase.",
    examples: [
      "2am crash + your family is asleep = possible intruder. Your mind goes to your intruder plan.",
      "Water rising + your neighborhood is low-lying = evacuation window is closing.",
      "Smoke without alarm = fire may be in a wall or attic — this is serious.",
    ],
    key: "Prior planning and mental rehearsal dramatically speeds up orientation. Untrained people get stuck here indefinitely — they observe something alarming and cannot process it.",
  },
  {
    icon: MousePointer,
    phase: "DECIDE",
    color: "text-orange-400",
    bg: "bg-orange-900/20 border-orange-800/40",
    definition: "Select a course of action from your available options. The richer your mental library of pre-planned responses, the faster this step happens.",
    examples: [
      "Intruder scenario: Move family to safe room. Arm yourself. Call 911. Do not go searching.",
      "Flood scenario: Grab go-bag. Load vehicle. Leave now on Route 2.",
      "Fire scenario: Activate alarm, get everyone out, meet at mailbox, call 911 from outside.",
    ],
    key: "People with no pre-planned response spend catastrophic amounts of time in the Decide phase trying to invent a response from scratch. That delay costs lives.",
  },
  {
    icon: Zap,
    phase: "ACT",
    color: "text-green-400",
    bg: "bg-green-900/20 border-green-800/40",
    definition: "Execute your decision with commitment and speed. Do not hesitate or second-guess mid-execution. Adjust in the next cycle, not mid-action.",
    examples: [
      "Move the family. Lock the door. Call 911. In that order, without hesitation.",
      "Start the vehicle. Back out. Take Route 2. Commit to it.",
      "Walk — do not run — to the exit. Account for everyone. Call from outside.",
    ],
    key: "Acting faster than your adversary — whether a threat, a fire, or a rising flood — puts them inside your decision cycle. You shape the situation instead of reacting to it.",
  },
];

const mindsetPrinciples = [
  {
    title: "Stress Narrows the Tunnel",
    description: "Under high-adrenaline stress, the human brain enters a mode called 'tunnel vision' — literally and figuratively. Peripheral vision narrows. Fine motor skills degrade. Time perception distorts. The brain defaults to the behavior it has practiced most. This is why training matters above everything else. If you have rehearsed a plan, your brain executes it even when adrenaline overwhelms your system. People without practiced plans freeze — not because they are weak, but because the brain has nothing to default to.",
    source: "Source: Grossman, Dave — 'On Combat' (2004)",
  },
  {
    title: "Accept the Situation — Then Act",
    description: "Denial is the single most deadly response to a crisis. 'This can't be happening' is a thought that costs seconds you may not have. The fastest path through any emergency is immediate acceptance: this is real, this is happening, here is what I do next. Mental rehearsal before an event is what makes acceptance possible in the moment. Your brain has already processed the scenario — it simply executes the plan you practiced.",
    source: "Source: Leach, John — 'Survival Psychology' (1994)",
  },
  {
    title: "The Protector Identity",
    description: "The most effective people in emergency situations have made a decision before the crisis: they are the person who acts. This is not arrogance — it is a commitment. You have already decided to move, to help, to lead when others freeze. This identity shift is the difference between a bystander and a first responder. You do not need a badge or training certificate. You need a decision made in advance: I am the person who acts.",
    source: "",
  },
  {
    title: "Recovery After the Event",
    description: "Mental preparedness does not end when the immediate threat does. After-incident stress is physiologically real — cortisol and adrenaline take hours to clear, and the psychological processing of what happened can take days or weeks. Have a decompression plan: trusted people to talk to, physical activity to process stress hormones, and a timeline for returning to normal operations. Seeking professional support is not weakness — it is maintenance for your most critical tool.",
    source: "Source: SAMHSA — 'Psychological First Aid' Field Operations Guide",
  },
];

export default function CommunicationPage() {
  const [, navigate] = useLocation();
  return (
    <>
      <SEOHead
        title="Communication | Preparedness | Concealed Florida"
        description="How to communicate under stress, emergency contact resources, radio frequencies, faith and moral resilience, and a deep dive into the OODA Loop decision framework."
        path="/preparedness/communication"
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

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 mt-2" data-testid="heading-communication">
            Communication
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-3xl">
            When systems fail, communication keeps families together and people alive. This covers how to speak clearly under extreme stress, how to get help, how to use radio, and the mental and moral foundation that makes all of it possible.
          </p>

          {/* ── 1. How to Communicate Under Stress ───────────────────────── */}
          <section className="mb-12" data-testid="section-comms-rules">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">How to Communicate Under Stress</h2>
            </div>
            <p className="text-gray-300 text-sm mb-5">
              When stress is high and time is critical, poor communication costs lives. These protocols are used by military, 911 dispatchers, and first responders — and they work for civilians in any emergency.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commsRules.map((item, i) => (
                <Card key={item.rule} className="bg-secondary border-secondary" data-testid={`card-comms-rule-${i}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-400 font-bold text-xl">{String(i + 1).padStart(2, "0")}</span>
                      <CardTitle className="text-white text-sm">{item.rule}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ── 2. Seek Help & Resources ──────────────────────────────────── */}
          <section className="mb-12" data-testid="section-help">
            <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-400" />
                <h2 className="text-2xl font-bold text-white">How to Seek Help & Resources</h2>
              </div>
              <div className="relative group shrink-0" data-testid="download-menu-help-resources">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                  data-testid="button-download-help-resources"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Reference
                </Button>
                <div
                  className="absolute top-full right-0 mt-0 w-44 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50
                    invisible opacity-0 group-hover:visible group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto
                    transition-opacity duration-100"
                >
                  <button
                    onClick={downloadHelpAsTxt}
                    data-testid="button-help-format-txt"
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-gray-500" />
                    Text (.txt)
                  </button>
                  <button
                    onClick={downloadHelpAsWord}
                    data-testid="button-help-format-word"
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    Word (.doc)
                  </button>
                  <button
                    onClick={printHelpAsPdf}
                    data-testid="button-help-format-pdf"
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-red-400" />
                    PDF (Print/Save)
                  </button>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-5">
              Know these contacts before you need them. Memorize 911, 211, and FEMA's number. Program the rest into your phone today — most of these lines are free and staffed 24/7.
            </p>
            <div className="space-y-4">
              {helpResources.map((group) => (
                <Card key={group.category} className="bg-secondary border-secondary" data-testid={`card-resource-${group.category.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-gray-400 text-xs font-semibold uppercase tracking-wide">{group.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {group.resources.map((r) => (
                        <div key={r.label} className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm">{r.label}</p>
                            <p className="text-gray-300 text-xs leading-relaxed mt-0.5">{r.detail}</p>
                          </div>
                          {r.link && (
                            <Button variant="secondary" size="sm" asChild className="shrink-0">
                              <a href={r.link} target="_blank" rel="noopener noreferrer" data-testid={`link-resource-${r.label.toLowerCase().replace(/\s+/g, "-").slice(0, 20)}`}>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ── 3. Radio Frequencies ──────────────────────────────────────── */}
          <section className="mb-12" data-testid="section-radio">
            <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Radio Frequencies</h2>
              </div>
              {/* Multi-format Reference Card download */}
              <div className="relative group shrink-0" data-testid="download-menu-radio-reference">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                  data-testid="button-download-radio-reference"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Reference Card
                </Button>
                <div
                  className="absolute top-full right-0 mt-0 w-44 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50
                    invisible opacity-0 group-hover:visible group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto
                    transition-opacity duration-100"
                >
                  <button
                    onClick={downloadRadioAsTxt}
                    data-testid="button-radio-format-txt"
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-gray-500" />
                    Text (.txt)
                  </button>
                  <button
                    onClick={downloadRadioAsWord}
                    data-testid="button-radio-format-word"
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    Word (.doc)
                  </button>
                  <button
                    onClick={printRadioAsPdf}
                    data-testid="button-radio-format-pdf"
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-red-400" />
                    PDF (Print/Save)
                  </button>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              Cell towers fail in major disasters — sometimes for days. Radio does not. This covers Florida NOAA frequencies and national/international emergency frequencies for every radio type. Download or print the full reference card to keep in your go-bag, vehicle, and emergency kit.
            </p>

            {/* NOAA + Ham side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-white font-semibold text-base mb-2">NOAA Weather Radio — Florida & Nationwide</p>
                <p className="text-gray-300 text-xs mb-3">
                  All 7 NOAA frequencies are used nationwide. Program all of them into your emergency radio. Use SAME codes for county-specific alerts.
                </p>
                <Card className="bg-secondary border-secondary">
                  <CardContent className="pt-4 pb-4">
                    <div className="space-y-2">
                      {noaaFrequencies.map((f) => (
                        <div key={f.freq} className="flex items-start gap-3">
                          <span className="text-yellow-400 font-mono text-sm font-semibold w-28 shrink-0">{f.freq}</span>
                          <span className="text-gray-300 text-xs">{f.coverage}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-800 flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm" asChild data-testid="button-noaa">
                        <a href="https://www.weather.gov/nwr/station_listing?State=FL" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3.5 h-3.5 mr-2" />
                          FL Station Listing
                        </a>
                      </Button>
                      <Button variant="secondary" size="sm" asChild data-testid="button-noaa-same">
                        <a href="https://www.weather.gov/nwr/counties" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3.5 h-3.5 mr-2" />
                          Find SAME Code
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <p className="text-white font-semibold text-base mb-2">Amateur (Ham) Radio — National Calling Frequencies</p>
                <p className="text-gray-300 text-xs mb-3">
                  Ham radio is the backbone of emergency communication when all else fails. Technician license = one weekend of study, $15 exam.
                </p>
                <Card className="bg-secondary border-secondary">
                  <CardContent className="pt-4 pb-4">
                    <div className="space-y-2.5">
                      {hamFrequencies.map((f) => (
                        <div key={f.freq} className="flex items-start gap-3">
                          <ChevronRight className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-yellow-400 font-mono text-sm font-semibold">{f.freq}</span>
                            <p className="text-gray-300 text-xs leading-relaxed mt-0.5">{f.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-800 flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm" asChild data-testid="button-ham-license">
                        <a href="https://www.arrl.org/getting-licensed" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3.5 h-3.5 mr-2" />
                          Get Licensed — ARRL
                        </a>
                      </Button>
                      <Button variant="secondary" size="sm" asChild data-testid="button-hamstudy">
                        <a href="https://hamstudy.org" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3.5 h-3.5 mr-2" />
                          HamStudy.org (Free)
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Radio Programming Files — CHIRP */}
            <Card className="bg-secondary border-secondary mb-8" data-testid="card-chirp-download">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-base mb-1">Radio Programming Files</p>
                    <p className="text-gray-300 text-xs leading-relaxed mb-2">
                      Program all emergency frequencies directly into your radio in seconds. Download the CHIRP-compatible CSV and import it into <strong className="text-gray-200">CHIRP Software</strong> (free, open-source) to instantly program NOAA, Ham, Marine VHF, FRS/GMRS, and MURS frequencies into any supported radio — including BaoFeng, Kenwood, ICOM, Yaesu, and most common handheld transceivers.
                    </p>
                    <p className="text-gray-500 text-xs">
                      Covers 20 channels: NOAA WX1–7, Ham calling frequencies (2m &amp; 70cm), Marine VHF Ch 16/22A/9, FRS/GMRS Ch 1/3/20, MURS Ch 1–5. CB (HF) and aviation frequencies are not VHF/UHF and are not programmable via CHIRP — see the national frequency cards below for those.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={downloadChirpCsv}
                      data-testid="button-download-chirp"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      CHIRP CSV (.csv)
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      asChild
                      data-testid="button-chirp-software"
                    >
                      <a href="https://chirp.danplanet.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Get CHIRP (Free)
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* National / International Frequencies */}
            <div className="mb-2">
              <p className="text-white font-semibold text-base mb-1">National & International Emergency Frequencies</p>
              <p className="text-gray-300 text-xs mb-4">
                These frequencies work nationwide and in many cases internationally — regardless of what state or country you are in. Every household should know at least Channel 16 (marine) and CB Channel 9.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nationalFrequencies.map((group) => (
                  <Card key={group.category} className="bg-secondary border-secondary" data-testid={`card-freq-${group.category.toLowerCase().replace(/\s+/g, "-").slice(0, 20)}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-sm ${group.color}`}>{group.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2.5">
                        {group.entries.map((e, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <ChevronRight className={`w-3 h-3 ${group.color} shrink-0 mt-0.5`} />
                            <div>
                              <span className={`font-mono text-xs font-semibold ${group.color}`}>{e.freq}</span>
                              <p className="text-gray-300 text-xs leading-relaxed mt-0.5">{e.label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-4 italic">Sources: NOAA NWS, FCC Part 95 (FRS/GMRS/CB/MURS), USCG Boating Safety, ARRL, REACT International, ICAO Annex 10</p>
          </section>

          {/* ── 4. Morse Code Reference ───────────────────────────────────── */}
          <section className="mb-12" data-testid="section-morse">
            <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-orange-400" />
                <h2 className="text-2xl font-bold text-white">Morse Code Reference</h2>
              </div>
              <div className="relative group shrink-0" data-testid="download-menu-morse-reference">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                  data-testid="button-download-morse-reference"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Reference
                </Button>
                <div
                  className="absolute top-full right-0 mt-0 w-44 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50
                    invisible opacity-0 group-hover:visible group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto
                    transition-opacity duration-100"
                >
                  <button
                    onClick={downloadMorseAsTxt}
                    data-testid="button-morse-format-txt"
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-gray-500" />
                    Text (.txt)
                  </button>
                  <button
                    onClick={downloadMorseAsWord}
                    data-testid="button-morse-format-word"
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    Word (.doc)
                  </button>
                  <button
                    onClick={printMorseAsPdf}
                    data-testid="button-morse-format-pdf"
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-red-400" />
                    PDF (Print/Save)
                  </button>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-5">
              Morse code works when voice does not — across damaged radios, through walls, or using only a flashlight, mirror, or whistle. Every prepared communicator should know SOS and the basic alphabet.
            </p>

            {/* SOS Highlight */}
            <Card className="bg-orange-950/30 border border-orange-800/40 mb-6" data-testid="card-morse-sos">
              <CardHeader className="pb-2">
                <CardTitle className="text-orange-300 text-base">SOS — The Universal Distress Signal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 flex-wrap mb-3">
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">S</p>
                    <p className="text-white font-mono text-2xl tracking-widest">. . .</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">O</p>
                    <p className="text-orange-300 font-mono text-2xl tracking-widest">— — —</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">S</p>
                    <p className="text-white font-mono text-2xl tracking-widest">. . .</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm text-gray-300">
                  <p><span className="text-orange-300 font-semibold">Flashlight / mirror:</span> 3 short flashes — 3 long flashes — 3 short flashes. Pause 10 seconds. Repeat.</p>
                  <p><span className="text-orange-300 font-semibold">Whistle / horn:</span> 3 short blasts — 3 long blasts — 3 short blasts. Pause. Repeat.</p>
                  <p><span className="text-orange-300 font-semibold">Radio (keyed tone):</span> Dot = short press, Dash = long press (3× dot length). Universally understood on all frequencies.</p>
                  <p><span className="text-orange-300 font-semibold">Sound / knock:</span> 3 rapid — 3 slow — 3 rapid. Works through walls and debris.</p>
                </div>
              </CardContent>
            </Card>

            {/* Alphabet + Digits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-secondary border-secondary" data-testid="card-morse-alphabet">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Alphabet (A–Z)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {morseAlphabet.map((item) => (
                      <div key={item.char} className="flex items-baseline gap-2">
                        <span className="text-orange-300 font-bold font-mono text-sm w-4 shrink-0">{item.char}</span>
                        <span className="text-gray-300 font-mono text-xs">{item.code}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-secondary border-secondary" data-testid="card-morse-digits">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm">Digits (0–9)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                      {morseDigits.map((item) => (
                        <div key={item.char} className="flex items-baseline gap-2">
                          <span className="text-orange-300 font-bold font-mono text-sm w-4 shrink-0">{item.char}</span>
                          <span className="text-gray-300 font-mono text-xs">{item.code}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-secondary border-secondary" data-testid="card-morse-timing">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm">Timing Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1.5">
                      {[
                        { label: "Dot (·)", value: "1 unit" },
                        { label: "Dash (—)", value: "3 units" },
                        { label: "Between symbols in same letter", value: "1 unit gap" },
                        { label: "Between letters", value: "3 unit gap" },
                        { label: "Between words", value: "7 unit gap" },
                      ].map((t) => (
                        <div key={t.label} className="flex items-baseline justify-between gap-2">
                          <span className="text-gray-300 text-xs">{t.label}</span>
                          <span className="text-orange-300 font-mono text-xs shrink-0">{t.value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-500 text-xs mt-3 italic">Standard ITU-R M.1677-1. A "unit" is any consistent time interval — choose one that works for your signaling method.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* ── 5. Faith & Moral Foundation ───────────────────────────────── */}
          <section className="mb-12" data-testid="section-faith">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-rose-400" />
              <h2 className="text-2xl font-bold text-white">Faith & Moral Foundation</h2>
            </div>
            <p className="text-gray-300 text-sm mb-5">
              You cannot pour from an empty cup. Decades of disaster research — from FEMA to academic psychology — confirm that communities anchored in shared values and faith recover faster, help more people, and maintain moral coherence when systems break down.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faithPrinciples.map((item, i) => (
                <Card key={item.title} className="bg-secondary border-secondary" data-testid={`card-faith-${i}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                    {item.source && (
                      <p className="text-gray-500 text-xs mt-2 italic">{item.source}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ── 6. Mindset Under Pressure — OODA LOOP DEEP DIVE ──────────── */}
          <section className="mb-10" data-testid="section-mindset">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Mindset Under Pressure</h2>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              The most important piece of equipment you own is the one between your ears. Train it accordingly. Understanding how your brain processes a crisis is the first step toward controlling your response to one.
            </p>

            {/* OODA Loop Deep Dive */}
            <Card className="bg-secondary border-secondary mb-6" data-testid="card-ooda-intro">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">The OODA Loop — Your Emergency Decision Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Developed by United States Air Force Colonel John Boyd after studying aerial combat dogfights in Korea, the OODA Loop describes how every human being processes and responds to rapidly changing situations. Boyd discovered that pilots who cycled through the loop faster — even slightly — consistently won engagements, not because they were stronger, but because they made better decisions faster.
                </p>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  The loop applies to every emergency you will ever face. A house fire, a flood, an intruder, a car accident with injuries. The speed at which you cycle through Observe → Orient → Decide → Act determines whether you take control of the situation or whether the situation controls you.
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  The key insight Boyd discovered: <span className="text-white font-semibold">the Orientation phase is the most important and most trainable.</span> You cannot always control what you observe — but you can absolutely train your mental models so that orientation happens faster and more accurately. That is what emergency planning, scenario rehearsal, and the rest of this site are fundamentally building.
                </p>
              </CardContent>
            </Card>

            {/* 4 Phase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {oodaPhases.map((phase) => {
                const Icon = phase.icon;
                return (
                  <Card key={phase.phase} className={`border ${phase.bg}`} data-testid={`card-ooda-${phase.phase.toLowerCase()}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${phase.color} shrink-0`} />
                        <CardTitle className={`${phase.color} text-base font-bold tracking-wider`}>{phase.phase}</CardTitle>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{phase.definition}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">Real-World Examples</p>
                      <ul className="space-y-1.5 mb-3">
                        {phase.examples.map((ex, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <ChevronRight className={`w-3 h-3 ${phase.color} shrink-0 mt-0.5`} />
                            <p className="text-gray-300 text-xs leading-relaxed">{ex}</p>
                          </li>
                        ))}
                      </ul>
                      <div className={`rounded-md px-3 py-2 ${phase.bg}`}>
                        <p className={`text-xs font-semibold ${phase.color}`}>{phase.key}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Applying OODA */}
            <Card className="bg-secondary border-secondary mb-6" data-testid="card-ooda-apply">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">How to Apply the OODA Loop — A Complete Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">Scenario: Hearing an unknown noise at 2am with family in the home</p>
                <div className="space-y-3">
                  {[
                    { phase: "OBSERVE", color: "text-blue-400", text: "You hear a distinct crash from the first floor. You see no movement through your door. You hear footsteps that are not your family members'." },
                    { phase: "ORIENT", color: "text-yellow-400", text: "It is 2am. All family members are accounted for. You live in a residential neighborhood. You have an intruder response plan. Your mind instantly pattern-matches: possible intruder. You do not investigate. Your plan activates." },
                    { phase: "DECIDE", color: "text-orange-400", text: "Move family to pre-designated safe room. Lock the door. Arm yourself. Call 911. You have already made this decision — you made it when you created your plan. You are simply executing it." },
                    { phase: "ACT", color: "text-green-400", text: "You move quickly and quietly. Family is in the safe room. Door is locked. 911 is called. You describe your address, that you believe you have an intruder, and your location in the home. You do not leave the room." },
                  ].map((s) => (
                    <div key={s.phase} className="flex items-start gap-3">
                      <span className={`text-xs font-bold font-mono ${s.color} w-16 shrink-0 pt-0.5`}>{s.phase}</span>
                      <p className="text-gray-300 text-sm leading-relaxed">{s.text}</p>
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-xs mt-4 leading-relaxed">
                  The entire cycle above, for someone who has rehearsed it, takes under 60 seconds from observation to action. For someone who has not, the Decide phase alone can take minutes — minutes that determine the outcome.
                </p>
              </CardContent>
            </Card>

            {/* Box Breathing */}
            <Card className="bg-secondary border-secondary mb-6" data-testid="card-box-breathing">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Box Breathing — Tactical Reset Between OODA Cycles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  When adrenaline spikes during a crisis, it physically degrades your ability to orient and decide. Box breathing is a physiological intervention that interrupts that spike. It is used by Navy SEALs, combat pilots, ER surgeons, and hostage negotiators before making critical decisions under extreme pressure.
                </p>
                <div className="grid grid-cols-4 gap-3 max-w-lg mb-4">
                  {[
                    { step: "Inhale", duration: "4 sec", id: "inhale" },
                    { step: "Hold", duration: "4 sec", id: "hold-in" },
                    { step: "Exhale", duration: "4 sec", id: "exhale" },
                    { step: "Hold", duration: "4 sec", id: "hold-out" },
                  ].map((s) => (
                    <div key={s.id} className="bg-black/30 rounded-lg p-3 text-center">
                      <p className="text-white font-semibold text-sm">{s.step}</p>
                      <p className="text-purple-400 text-xs">{s.duration}</p>
                    </div>
                  ))}
                </div>
                <p className="text-gray-300 text-xs">Repeat 4–6 cycles. Use it before any major decision — not in the middle of acting, but in the brief pause between an OODA cycle completing and the next beginning.</p>
                <p className="text-gray-500 text-xs mt-1 italic">Source: US Army Research Institute; Grossman, Dave — 'On Combat' (2004)</p>
              </CardContent>
            </Card>

            {/* Other mindset cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mindsetPrinciples.map((item, i) => (
                <Card key={item.title} className="bg-secondary border-secondary" data-testid={`card-mindset-${i}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-purple-400 font-bold text-xl">{String(i + 1).padStart(2, "0")}</span>
                      <CardTitle className="text-white text-sm">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                    {item.source && (
                      <p className="text-gray-500 text-xs mt-2 italic">{item.source}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <div className="bg-secondary border border-secondary rounded-lg p-4 flex gap-3 items-start">
            <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Mental readiness is a lifelong practice. If you are dealing with PTSD, trauma, or chronic stress, please seek support from a licensed mental health professional. The techniques described here are training frameworks, not medical treatment. The 988 Lifeline and SAMHSA Disaster Distress Helpline listed above are real, free, and staffed 24/7.
            </p>
          </div>

        </div>
      </Layout>
    </>
  );
}
