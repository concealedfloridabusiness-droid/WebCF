import { useEffect, useRef, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Loader2, Thermometer, AlertTriangle, Zap, Hospital, ShieldAlert, Info, Clock, MapPin, CheckCircle, AlertCircle, TriangleAlert, ArrowLeft, Download, Printer, Shield, Globe, Radio, Activity, ChevronRight, ChevronLeft } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// State name → abbreviation (for joining GeoJSON with crime data)
const STATE_NAME_TO_ABBR: Record<string, string> = {
  Alabama:"AL",Alaska:"AK",Arizona:"AZ",Arkansas:"AR",California:"CA",
  Colorado:"CO",Connecticut:"CT",Delaware:"DE",Florida:"FL",Georgia:"GA",
  Hawaii:"HI",Idaho:"ID",Illinois:"IL",Indiana:"IN",Iowa:"IA",Kansas:"KS",
  Kentucky:"KY",Louisiana:"LA",Maine:"ME",Maryland:"MD",Massachusetts:"MA",
  Michigan:"MI",Minnesota:"MN",Mississippi:"MS",Missouri:"MO",Montana:"MT",
  Nebraska:"NE",Nevada:"NV","New Hampshire":"NH","New Jersey":"NJ",
  "New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND",
  Ohio:"OH",Oklahoma:"OK",Oregon:"OR",Pennsylvania:"PA","Rhode Island":"RI",
  "South Carolina":"SC","South Dakota":"SD",Tennessee:"TN",Texas:"TX",
  Utah:"UT",Vermont:"VT",Virginia:"VA",Washington:"WA","West Virginia":"WV",
  Wisconsin:"WI",Wyoming:"WY","District of Columbia":"DC",
};

// Choropleth color scale — green (safe) → red (high crime)
function getChoroplethColor(weight: number): string {
  if (weight > 0.80) return "#dc2626"; // red-600   very high
  if (weight > 0.60) return "#ea580c"; // orange-600 high
  if (weight > 0.40) return "#ca8a04"; // yellow-600 moderate-high
  if (weight > 0.22) return "#4d7c0f"; // lime-700   moderate
  return "#166534";                    // green-800  low
}

const US_CENTER: [number, number] = [39.5, -98.35];
const US_ZOOM = 4;

const SEVERITY_COLOR: Record<string, string> = {
  Extreme: "#ef4444",
  Severe: "#f97316",
  Moderate: "#eab308",
  Minor: "#3b82f6",
  Unknown: "#6b7280",
};

interface WeatherFeature {
  geometry: { type: string; coordinates: unknown } | null;
  event: string;
  severity: string;
  headline: string;
  areaDesc: string;
  expires: string;
  id: string;
}

interface FemaDisaster {
  id: number;
  title: string;
  type: string;
  state: string;
  area: string;
  date: string;
  lat: number;
  lng: number;
}

interface TraumaCenter {
  name: string;
  address: string;
  level: number;
  lat: number;
  lng: number;
  phone: string;
}

interface CityPoint {
  name: string;
  state: string;
  lat: number;
  lng: number;
  violent: number;
  property: number;
  weight: number;
}

interface AlertItem {
  id: string;
  source: string;
  event: string;
  area: string;
  severity: string;
  sent: string;
}

interface EarthquakePoint {
  id: string;
  place: string;
  magnitude: number;
  depth: number;
  time: number;
  lat: number;
  lng: number;
}

interface WildfirePoint {
  lat: number;
  lng: number;
  frp: number;
  frpTotal: number;
  brightness: number;
  count: number;
  acq_date: string;
  acq_time: string;
}

interface HurricaneStorm {
  id: string;
  name: string;
  type: string;
  category: number;
  lat: number | null;
  lng: number | null;
  title: string;
}

interface AcledIncident { date: string; eventType: string; subType: string; actor: string; location: string; lat: number | null; lng: number | null; fatalities: number; notes: string; }
interface FbiItem { title: string; link: string; description: string; pubDate: string; }
interface StateDeptAdvisory { country: string; level: number; levelText: string; link: string; pubDate: string; }
interface CisaAlert { title: string; link: string; pubDate: string; description: string; severity: string; }
interface OutagePoint { county: string; state: string; metersAffected: number; startTime: string | null; eta: string | null; cause: string | null; lat: number; lng: number; }

type LayerKey = "crime" | "cityCrime" | "weather" | "fema" | "hospitals" | "radar" | "earthquakes" | "wildfires" | "hurricanes" | "acled" | "outages";

function getDefaultVisible(): Record<LayerKey, boolean> {
  return {
    crime: false, cityCrime: false, weather: false, fema: false,
    hospitals: false, radar: false, earthquakes: false,
    wildfires: false, hurricanes: false, acled: false, outages: false,
  };
}

const DEFAULT_VISIBLE = getDefaultVisible();

function makeOrangeIcon() {
  return L.divIcon({
    html: `<div style="background:#f97316;width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 6px #f97316aa"></div>`,
    className: "",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function makeGreenIcon() {
  return L.divIcon({
    html: `<div style="background:#22c55e;width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 6px #22c55eaa;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;font-weight:bold">+</div>`,
    className: "",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function outageDangerScore(o: OutagePoint): number {
  // Impact score (0–1): how many customers affected
  const impact = o.metersAffected >= 50000 ? 1.0
    : o.metersAffected >= 15000 ? 0.75
    : o.metersAffected >= 5000  ? 0.50
    : o.metersAffected >= 1000  ? 0.28
    : 0.08;
  // Recency score (0–1): more recent = more urgent
  let recency = 0.08;
  if (o.startTime) {
    const ageHr = (Date.now() - new Date(o.startTime).getTime()) / 3_600_000;
    recency = ageHr < 1 ? 1.0 : ageHr < 6 ? 0.80 : ageHr < 24 ? 0.55 : ageHr < 48 ? 0.28 : 0.08;
  }
  return 0.65 * impact + 0.35 * recency;
}

function wildfireDangerScore(f: WildfirePoint): number {
  // Recency: 0 = 48+ hours old, 1 = just detected
  const detMs = f.acq_date ? new Date(f.acq_date + "T12:00:00Z").getTime() : Date.now();
  const hoursOld = Math.min(48, (Date.now() - detMs) / 3600000);
  const recency = 1 - hoursOld / 48;
  // FRP intensity: 0 = 0 MW, 1 = 500+ MW
  const frpScore = Math.min(1, Math.log10((f.frp || 0.5) + 1) / Math.log10(501));
  // Brightness score: 310 K = background, 440 K = extreme
  const brightnessScore = Math.max(0, Math.min(1, (f.brightness - 310) / 130));
  return recency * 0.45 + frpScore * 0.45 + brightnessScore * 0.10;
}

function quakeSeverity(mag: number): "Extreme" | "Severe" | "Moderate" {
  if (mag >= 7) return "Extreme";
  if (mag >= 5.5) return "Severe";
  return "Moderate";
}

function hurricaneSeverity(cat: number): "Extreme" | "Severe" | "Moderate" {
  if (cat >= 3) return "Extreme";
  if (cat >= 1) return "Severe";
  return "Moderate";
}

function AlertTicker({
  alerts,
  isLoading,
  earthquakes,
  hurricanes,
}: {
  alerts: AlertItem[];
  isLoading: boolean;
  earthquakes: EarthquakePoint[];
  hurricanes: HurricaneStorm[];
}) {
  if (isLoading) return (
    <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-800 text-gray-500 text-xs">
      <Loader2 className="w-3 h-3 animate-spin" /> Loading live alerts...
    </div>
  );

  const activeQuakes = earthquakes.filter(q => q.lat && q.lng);
  const activeStorms = hurricanes.filter(s => s.lat !== null && s.lng !== null);

  const allSeverities: ("Extreme" | "Severe" | "Moderate")[] = [
    ...alerts.map(a => a.severity as "Extreme" | "Severe" | "Moderate"),
    ...activeQuakes.map(q => quakeSeverity(q.magnitude)),
    ...activeStorms.map(s => hurricaneSeverity(s.category)),
  ];

  const isAllClear = allSeverities.length === 0;

  const topSeverity = isAllClear ? "clear"
    : allSeverities.some(s => s === "Extreme") ? "Extreme"
    : allSeverities.some(s => s === "Severe") ? "Severe"
    : "Moderate";

  const bgStyle: Record<string, string> = {
    Extreme: "#7f1d1d",
    Severe: "#78350f",
    Moderate: "#713f12",
    clear: "#14532d",
  };
  const bg = bgStyle[topSeverity] ?? bgStyle.clear;

  const alertItems = alerts.map(a => {
    const timeStr = a.sent ? new Date(a.sent).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
    return `${a.event.toUpperCase()} — ${a.area}${timeStr ? " — " + timeStr : ""}`;
  });

  const quakeItems = activeQuakes.map(q => {
    const timeStr = q.time ? new Date(q.time).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
    return `M${q.magnitude.toFixed(1)} EARTHQUAKE — ${q.place}${timeStr ? " — " + timeStr : ""}`;
  });

  const stormItems = activeStorms.map(s => {
    const catLabel = s.category >= 1 ? `Category ${s.category}` : "Tropical Storm";
    return `${catLabel.toUpperCase()} ${s.name.toUpperCase()} — Atlantic Basin — ACTIVE`;
  });

  const combined = [...alertItems, ...quakeItems, ...stormItems];
  const tickerContent = combined.length === 0
    ? "ALL CLEAR — No Active Emergencies, Significant Earthquakes, or Atlantic Storms"
    : combined.join("     \u25C6     ");

  const duration = combined.length === 0 ? "24s" : `${Math.max(24, combined.length * 9)}s`;

  return (
    <div
      style={{ background: bg, position: "relative", zIndex: 900 }}
      className="flex items-stretch select-none"
      data-testid="banner-alert-ticker"
    >
      <style>{`@keyframes cf-ticker-scroll { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}</style>
      <div
        className="shrink-0 flex items-center gap-1.5 px-3 border-r border-white/20"
        style={{ minWidth: "8.5rem" }}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-white/80 shrink-0" />
        <span className="text-white/90 text-[9px] font-bold uppercase tracking-wide leading-tight">NOAA · FEMA<br/>USGS · NHC</span>
      </div>
      <div className="flex-1 overflow-hidden py-1.5">
        <div
          style={{
            display: "inline-flex",
            whiteSpace: "nowrap",
            animation: `cf-ticker-scroll ${duration} linear infinite`,
          }}
        >
          <span className="text-white text-xs font-medium px-4">{tickerContent}</span>
          <span className="text-white text-xs font-medium px-4">{tickerContent}</span>
        </div>
      </div>
    </div>
  );
}

function generateSituationRoomReference(): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const lines: string[] = [];
  lines.push("================================================================");
  lines.push("  CF SITUATION ROOM — MAP REFERENCE GUIDE");
  lines.push("  Concealed Florida");
  lines.push("================================================================");
  lines.push(`  Downloaded: ${date}`);
  lines.push("================================================================");
  lines.push("");
  lines.push("OVERVIEW");
  lines.push("--------");
  lines.push("  Nationwide situational awareness — crime, weather, disasters,");
  lines.push("  conflict incidents, power outages, and emergency resources on");
  lines.push("  a single interactive map.");
  lines.push("");
  lines.push("HOW TO NAVIGATE THE MAP");
  lines.push("-----------------------");
  lines.push("  Layer panel (top-right corner)");
  lines.push("    Toggle any data layer on or off. Layers stack and can be");
  lines.push("    run simultaneously or isolated one at a time.");
  lines.push("");
  lines.push("  Hover");
  lines.push("    Hover over any marker, circle, or alert zone to see a");
  lines.push("    tooltip with numbers, event type, and severity.");
  lines.push("");
  lines.push("  Click");
  lines.push("    Click any marker or zone to open a popup with full details");
  lines.push("    including headline, source, time, and data notes.");
  lines.push("");
  lines.push("  Zoom / Pan");
  lines.push("    Scroll to zoom; drag to pan. Zoom in to see city-level");
  lines.push("    crime circles and outage markers more clearly.");
  lines.push("");
  lines.push("================================================================");
  lines.push("MAP LAYERS");
  lines.push("================================================================");
  lines.push("");
  lines.push("  STATE CRIME MAP  (Historical — FBI UCR 2022)");
  lines.push("  Color: orange-red choropleth");
  lines.push("    Each US state shaded green through red based on violent");
  lines.push("    crime rate per 100,000 residents.");
  lines.push("    Green (<200/100k) = Low   |   Red (>670/100k) = Very High");
  lines.push("");
  lines.push("  CITY CRIME SPOTS  (Historical — FBI UCR 2022)");
  lines.push("  Color: red circles (size proportional to crime rate)");
  lines.push("    Colored circles mark 71 major US cities. Circle size");
  lines.push("    reflects relative violent crime rate. Same color scale as");
  lines.push("    state layer. Hover to see exact figures.");
  lines.push("");
  lines.push("  WEATHER ALERTS  (Live — NOAA api.weather.gov, 10-min refresh)");
  lines.push("  Color: red = Extreme, orange = Severe, yellow = Moderate");
  lines.push("    Shaded polygons show active National Weather Service alerts.");
  lines.push("    Click a zone for the full alert headline and expiration time.");
  lines.push("");
  lines.push("  WEATHER RADAR  (Near real-time — NOAA)");
  lines.push("  Color: blue-to-red precipitation tiles");
  lines.push("    Precipitation radar tiles updated continuously. Blues = light");
  lines.push("    rain; oranges and reds = heavy precipitation. Use alongside");
  lines.push("    the Weather Alerts layer to track storm system locations.");
  lines.push("");
  lines.push("  FEMA DISASTERS  (Live — FEMA API, past 12 months)");
  lines.push("  Color: orange markers");
  lines.push("    Federally declared disasters from the past 12 months.");
  lines.push("    Markers are at the approximate center of the declared state,");
  lines.push("    not the exact impact area. Click for event name and date.");
  lines.push("");
  lines.push("  TRAUMA CENTERS  (Static — HRSA verified)");
  lines.push("  Color: green markers (+)");
  lines.push("    Verified Level I and Level II trauma centers — the highest-");
  lines.push("    capability emergency surgical facilities. Level I can handle");
  lines.push("    any injury. In a true emergency, always call 911.");
  lines.push("");
  lines.push("  EARTHQUAKES — PAST 7 DAYS  (Live — USGS, 1-hr refresh)");
  lines.push("  Color: purple circles (size proportional to magnitude)");
  lines.push("    Earthquakes reported by USGS in the past 7 days.");
  lines.push("    Bigger circle = higher magnitude.");
  lines.push("    Magnitude guide:");
  lines.push("      M4   Minor shaking, rarely causes damage");
  lines.push("      M5   Moderate, may cause slight damage near epicenter");
  lines.push("      M6   Strong, significant structural damage nearby");
  lines.push("      M7+  Major — widespread destruction possible");
  lines.push("    Depth note: A shallow quake (<70 km) causes far more");
  lines.push("    surface shaking than a deep quake of the same magnitude.");
  lines.push("    Click any marker for magnitude, depth, and exact time.");
  lines.push("    Source: earthquake.usgs.gov — USGS Earthquake Hazards");
  lines.push("");
  lines.push("  ACTIVE WILDFIRES  (Live — NASA FIRMS, 2-hr refresh)");
  lines.push("  Color: red/orange/amber gradient based on danger score");
  lines.push("    Each fire plotted at its actual satellite-detected location.");
  lines.push("    Nearby fire detections within ~7 miles are clustered.");
  lines.push("    Two circles per fire:");
  lines.push("      Inner solid circle  — exact fire location");
  lines.push("      Outer halo          — area of potential smoke/heat impact");
  lines.push("    Color = danger level (recency + Fire Radiative Power):");
  lines.push("      Red        Critical: fresh today, extreme fire power");
  lines.push("      Orange-red High: recently active, intense burning");
  lines.push("      Orange     Moderate: burning or detected recently");
  lines.push("      Amber      Lower: older or weakening fire");
  lines.push("      Gray       Minimal: fading or 2-day-old detection");
  lines.push("    FRP (Fire Radiative Power) in megawatts = best intensity");
  lines.push("    measure. Click any marker to see FRP and explanation.");
  lines.push("    Limitation: cloud cover blocks satellite view. For exact");
  lines.push("    perimeters and evacuation orders, use inciweb.wildfire.gov");
  lines.push("    Source: firms.modaps.eosdis.nasa.gov — NASA MODIS C6.1");
  lines.push("");
  lines.push("  US CONFLICT INCIDENTS — ACLED  (Live, 30-min refresh)");
  lines.push("  Color: varies by event type (see below)");
  lines.push("    Political violence and protest events inside the US compiled");
  lines.push("    by ACLED — used by governments, the UN, and major news orgs.");
  lines.push("    Color coding:");
  lines.push("      Red     Battles: armed clashes between organized groups");
  lines.push("      Orange  Violence against civilians: targeted attacks");
  lines.push("      Yellow  Riots: spontaneous violent crowd events");
  lines.push("      Blue    Protests: peaceful or semi-peaceful demonstrations");
  lines.push("      Purple  Explosions/Remote violence: bombings, IEDs");
  lines.push("      Gray    Strategic developments: troop/group movements");
  lines.push("    Activation: requires an ACLED API key (free for researchers).");
  lines.push("    Source: acleddata.com — Armed Conflict Location & Event Data");
  lines.push("");
  lines.push("  POWER OUTAGES — ODIN / DOE  (Live — 15-min refresh)");
  lines.push("  Color: bright blue through violet based on impact score");
  lines.push("    County-level outages from ODIN — Outage Data Initiative");
  lines.push("    Nationwide, Oak Ridge National Lab / US DOE Office of");
  lines.push("    Electricity. One of the most authoritative national feeds.");
  lines.push("    Two circles per county:");
  lines.push("      Inner solid circle  — affected county center");
  lines.push("      Outer halo          — area of potential cascading impact");
  lines.push("    Color = combined impact score (size + recency):");
  lines.push("      Bright blue  Critical: many customers + recent report");
  lines.push("      Blue         High: large count or fresh report");
  lines.push("      Indigo       Moderate: notable outage, some age");
  lines.push("      Violet       Lower: smaller count or older event");
  lines.push("      Gray         Minimal: small or days-old outage");
  lines.push("    Click for county, customer count, cause, start time, ETA.");
  lines.push("    Limitation: shows what utilities have reported to the DOE.");
  lines.push("    Small local outages not escalated federally may not appear.");
  lines.push("    Source: ornl.opendatasoft.com/explore/dataset/odin-real-time");
  lines.push("");
  lines.push("  HURRICANE TRACKS  (Live — NOAA NHC, 30-min refresh)");
  lines.push("  Color: red markers (active storms only)");
  lines.push("    Active Atlantic tropical storms and hurricanes from NOAA");
  lines.push("    National Hurricane Center. If no storms are active, no");
  lines.push("    markers appear. Click for storm name, category, position.");
  lines.push("    Saffir-Simpson Scale:");
  lines.push("      Tropical Storm  39–73 mph   Storm surge and flood risk");
  lines.push("      Category 1      74–95 mph   Roof, tree, and power damage");
  lines.push("      Category 2      96–110 mph  Extensive damage");
  lines.push("      Category 3     111–129 mph  Major Hurricane — devastating");
  lines.push("      Category 4     130–156 mph  Catastrophic damage");
  lines.push("      Category 5     157+ mph     Catastrophic, many homes lost");
  lines.push("    Season: June 1 – November 30 (layer defaults ON in season).");
  lines.push("    Source: nhc.noaa.gov — NOAA National Hurricane Center");
  lines.push("");
  lines.push("================================================================");
  lines.push("CRIME RATE COLOR SCALE (violent crimes / 100k residents)");
  lines.push("================================================================");
  lines.push("  Dark green   < 200    — Low");
  lines.push("  Lime         200–370  — Moderate");
  lines.push("  Yellow       370–505  — Elevated");
  lines.push("  Orange       505–670  — High");
  lines.push("  Deep red     > 670    — Very High");
  lines.push("");
  lines.push("================================================================");
  lines.push("DATA ACCURACY & DISCLAIMERS");
  lines.push("================================================================");
  lines.push("  Crime data is a 2022 snapshot (FBI UCR). State-level patterns");
  lines.push("  move slowly (1–5%/year); relative rankings remain meaningful.");
  lines.push("  City-level rates can shift more noticeably year-to-year.");
  lines.push("");
  lines.push("  Weather Alerts — live from NOAA, same feed used by emergency");
  lines.push("  managers and news broadcasters. High accuracy.");
  lines.push("");
  lines.push("  FEMA marker positions are approximate (state center, not");
  lines.push("  precise impact area). Declaration date may lag actual event.");
  lines.push("");
  lines.push("  Earthquake data updates hourly from USGS. Displayed events");
  lines.push("  are M2.5+ that are widely felt or potentially damaging.");
  lines.push("");
  lines.push("  Wildfire locations accurate to within a few miles of actual");
  lines.push("  burn site. Cloud cover can cause detection gaps. For legal");
  lines.push("  evacuation orders use local authorities or InciWeb.");
  lines.push("");
  lines.push("  ACLED conflict data is verified by researchers but may lag");
  lines.push("  breaking events by 12–24 hours. Requires active API key.");
  lines.push("");
  lines.push("  Power outage data reflects utility reports to the DOE. Small");
  lines.push("  or local outages not escalated may not appear. Locations are");
  lines.push("  county centroids, not street-level outage boundaries.");
  lines.push("");
  lines.push("  Hurricane data is active season only (June–November). Layer");
  lines.push("  will be empty outside of season or when no storms are active.");
  lines.push("");
  lines.push("  This map is a situational awareness tool — not a replacement");
  lines.push("  for local knowledge or real-time 911 services.");
  lines.push("");
  lines.push("================================================================");
  lines.push("DATA SOURCES");
  lines.push("================================================================");
  lines.push("  FBI Uniform Crime Reports (UCR) 2022 — ucr.fbi.gov");
  lines.push("  NOAA National Weather Service — api.weather.gov");
  lines.push("  FEMA Disaster Declarations — fema.gov/api");
  lines.push("  HRSA — Health Resources & Services Administration");
  lines.push("  USGS Earthquake Hazards Program — earthquake.usgs.gov");
  lines.push("  NASA FIRMS / MODIS C6.1 — firms.modaps.eosdis.nasa.gov");
  lines.push("  ACLED Conflict Data — acleddata.com");
  lines.push("  ODIN Power Outages / Oak Ridge National Lab — ornl.gov");
  lines.push("  NOAA National Hurricane Center — nhc.noaa.gov");
  lines.push("  InciWeb Wildfire Incidents — inciweb.wildfire.gov");
  lines.push("  OpenStreetMap contributors & CARTO (map tiles)");
  lines.push("");
  lines.push("================================================================");
  lines.push("  Concealed Florida");
  lines.push("  In any emergency, always call 911.");
  lines.push("================================================================");
  return lines.join("\n");
}

function downloadSituationRoomAsTxt() {
  const content = generateSituationRoomReference();
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "CF_Situation_Room_Map_Reference.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadSituationRoomAsWord() {
  const raw = generateSituationRoomReference();
  const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = `<html><head><meta charset="utf-8"><title>CF Situation Room Map Reference</title></head><body style="font-family:Arial,sans-serif;max-width:800px;margin:20px auto;line-height:1.7;white-space:pre-wrap;font-size:12pt">${escaped}</body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "CF_Situation_Room_Map_Reference.doc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function printSituationRoomAsPdf() {
  const raw = generateSituationRoomReference();
  const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<html><head><title>CF Situation Room Map Reference — Concealed Florida</title><style>body{font-family:monospace;font-size:10pt;white-space:pre-wrap;margin:20px;line-height:1.6}@media print{body{margin:12px;font-size:9pt}}</style></head><body>${escaped}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 400);
}

export default function MapPage() {
  const [, navigate] = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layerRefs = useRef<Partial<Record<LayerKey, L.Layer>>>({});
  const [visible, setVisible] = useState<Record<LayerKey, boolean>>(DEFAULT_VISIBLE);
  const [layerStatus, setLayerStatus] = useState<Record<LayerKey, string>>({
    crime: "idle", cityCrime: "idle", weather: "idle", fema: "idle", hospitals: "idle", radar: "idle",
    earthquakes: "idle", wildfires: "idle", hurricanes: "idle", acled: "idle", outages: "idle",
  });

  const { data: weatherData, isLoading: weatherLoading, refetch: refetchWeather } = useQuery<{ features: WeatherFeature[]; updatedAt: string; error?: string }>({
    queryKey: ["/api/map/weather"],
    refetchInterval: 10 * 60 * 1000,
    staleTime: 9 * 60 * 1000,
  });

  const { data: femaData, isLoading: femaLoading } = useQuery<{ disasters: FemaDisaster[]; updatedAt: string; error?: string }>({
    queryKey: ["/api/map/fema"],
  });

  const { data: crimeData, isLoading: crimeLoading } = useQuery<{ states: { abbr: string; violent: number; property: number; weight: number }[]; source: string; error?: string }>({
    queryKey: ["/api/map/crime"],
  });

  const { data: statesGeoJson, isLoading: geoLoading } = useQuery<any>({
    queryKey: ["us-states-geojson"],
    queryFn: () => fetch("https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json").then(r => r.json()),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data: hospitalData, isLoading: hospitalLoading } = useQuery<{ centers: TraumaCenter[]; updatedAt: string }>({
    queryKey: ["/api/map/hospitals"],
  });

  const { data: radarData } = useQuery<{ url: string | null; error?: string }>({
    queryKey: ["/api/map/radar-url"],
  });

  const { data: cityCrimeData, isLoading: cityCrimeLoading } = useQuery<{ cities: CityPoint[]; source: string }>({
    queryKey: ["/api/map/city-crime"],
    staleTime: Infinity,
  });

  const { data: alertsData, isLoading: alertsLoading } = useQuery<{ alerts: AlertItem[]; updatedAt: string; error?: string }>({
    queryKey: ["/api/map/alerts"],
    refetchInterval: 5 * 60 * 1000,
    staleTime: 4 * 60 * 1000,
  });

  const { data: earthquakeData, isLoading: earthquakeLoading } = useQuery<{ earthquakes: EarthquakePoint[]; updatedAt: string; error?: string }>({
    queryKey: ["/api/map/earthquakes"],
    staleTime: 55 * 60 * 1000,
  });

  const { data: wildfireData, isLoading: wildfireLoading } = useQuery<{ wildfires: WildfirePoint[]; updatedAt: string; error?: string }>({
    queryKey: ["/api/map/wildfires"],
    staleTime: 115 * 60 * 1000,
  });

  const { data: hurricaneData, isLoading: hurricaneLoading } = useQuery<{ storms: HurricaneStorm[]; updatedAt: string; error?: string }>({
    queryKey: ["/api/map/hurricanes"],
    staleTime: 28 * 60 * 1000,
  });

  const { data: outageData, isLoading: outageLoading } = useQuery<{ outages: OutagePoint[]; updatedAt: string; error?: string }>({
    queryKey: ["/api/map/outages"],
    refetchInterval: 15 * 60 * 1000,
    staleTime: 14 * 60 * 1000,
  });

  // ---- Threat Awareness feeds ----
  const { data: acledData, isLoading: acledLoading } = useQuery<{ incidents: AcledIncident[]; updatedAt: string; error?: string }>({
    queryKey: ["/api/threats/acled"],
    staleTime: 28 * 60 * 1000,
  });
  const { data: fbiData, isLoading: fbiLoading } = useQuery<{ items: FbiItem[]; updatedAt: string; error?: string }>({
    queryKey: ["/api/threats/fbi"],
    staleTime: 28 * 60 * 1000,
  });
  const { data: stateDeptData, isLoading: stateDeptLoading } = useQuery<{ advisories: StateDeptAdvisory[]; updatedAt: string; error?: string; isStatic?: boolean }>({
    queryKey: ["/api/threats/statedept"],
    staleTime: 55 * 60 * 1000,
  });
  const { data: cisaData, isLoading: cisaLoading } = useQuery<{ alerts: CisaAlert[]; updatedAt: string; error?: string }>({
    queryKey: ["/api/threats/cisa"],
    staleTime: 55 * 60 * 1000,
  });

  interface WireVideo { id: string; title: string; thumbnail: string; publishedAt: string; url: string; }
  const { data: wireData, isLoading: wireLoading } = useQuery<{ videos: WireVideo[]; source: string }>({
    queryKey: ["/api/news/wire"],
    staleTime: 30 * 60 * 1000,
  });
  const wireVideos = wireData?.videos ?? [];
  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, { center: US_CENTER, zoom: US_ZOOM, zoomControl: true });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);
    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  // Crime choropleth layer — colored state polygons by violent crime rate
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (crimeLoading || geoLoading) { setLayerStatus((s) => ({ ...s, crime: "loading" })); return; }
    if (layerRefs.current.crime) layerRefs.current.crime.remove();

    if (!statesGeoJson || !crimeData?.states?.length) {
      setLayerStatus((s) => ({ ...s, crime: crimeData?.error ? "Unavailable" : "loading" }));
      return;
    }

    // Build abbr→crime lookup
    const crimeByAbbr: Record<string, { violent: number; property: number; weight: number }> = {};
    const sorted = [...crimeData.states].sort((a, b) => b.violent - a.violent);
    crimeData.states.forEach((s) => { crimeByAbbr[s.abbr] = s; });

    const geoLayer = L.geoJSON(statesGeoJson, {
      style: (feature) => {
        const name = feature?.properties?.name ?? "";
        const abbr = STATE_NAME_TO_ABBR[name];
        const data = abbr ? crimeByAbbr[abbr] : null;
        const weight = data?.weight ?? 0;
        return {
          fillColor: getChoroplethColor(weight),
          fillOpacity: 0.72,
          color: "#111827",
          weight: 0.8,
        };
      },
      onEachFeature: (feature, layer) => {
        const name = feature?.properties?.name ?? "Unknown";
        const abbr = STATE_NAME_TO_ABBR[name];
        const data = abbr ? crimeByAbbr[abbr] : null;
        const rank = data ? sorted.findIndex((s) => s.abbr === abbr) + 1 : null;
        const tooltip = data
          ? `<div style="font-family:sans-serif;font-size:12px;line-height:1.6">
              <b style="font-size:13px">${name}</b><br/>
              Violent crime: <b>${data.violent}</b>/100k<br/>
              Property crime: <b>${data.property}</b>/100k<br/>
              Rank: <b>#${rank} of 51</b> (1 = highest)
            </div>`
          : `<b>${name}</b><br/>No data`;
        layer.bindTooltip(tooltip, { sticky: true, opacity: 0.95 });
        (layer as any).on("mouseover", function (this: any) {
          this.setStyle({ fillOpacity: 0.92, weight: 1.5, color: "#ffffff" });
        });
        (layer as any).on("mouseout", function (this: any) {
          geoLayer.resetStyle(this);
        });
      },
    });

    layerRefs.current.crime = geoLayer;
    setLayerStatus((s) => ({ ...s, crime: crimeData.source ?? "FBI UCR 2022" }));
    if (visible.crime) geoLayer.addTo(map);
  }, [crimeData, crimeLoading, statesGeoJson, geoLoading]);

  // NOAA Weather layer
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (weatherLoading) { setLayerStatus((s) => ({ ...s, weather: "loading" })); return; }
    const features = weatherData?.features ?? [];
    setLayerStatus((s) => ({ ...s, weather: `${features.length} alerts` }));
    if (layerRefs.current.weather) layerRefs.current.weather.remove();
    const group = L.layerGroup();
    features.forEach((f) => {
      if (!f.geometry) return;
      const color = SEVERITY_COLOR[f.severity] ?? SEVERITY_COLOR.Unknown;
      const expires = f.expires ? new Date(f.expires).toLocaleString() : "Unknown";
      const popup = `
        <div style="font-family:sans-serif;font-size:13px;color:#111;max-width:280px">
          <strong style="color:${color}">${f.event}</strong><br/>
          <span style="font-size:11px;color:#555">${f.severity} severity</span><br/>
          <em style="font-size:11px">${f.areaDesc}</em><br/>
          ${f.headline ? `<p style="margin:4px 0;font-size:11px">${f.headline}</p>` : ""}
          <span style="font-size:10px;color:#888">Expires: ${expires}</span>
        </div>`;
      try {
        L.geoJSON(f.geometry as any, {
          style: { color, weight: 2, fillColor: color, fillOpacity: 0.2, opacity: 0.8 },
        }).bindPopup(popup).addTo(group);
      } catch { /* skip malformed geometry */ }
    });
    layerRefs.current.weather = group;
    if (visible.weather) group.addTo(map);
  }, [weatherData, weatherLoading]);

  // FEMA layer
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (femaLoading) { setLayerStatus((s) => ({ ...s, fema: "loading" })); return; }
    const disasters = femaData?.disasters ?? [];
    setLayerStatus((s) => ({ ...s, fema: `${disasters.length} declarations` }));
    if (layerRefs.current.fema) layerRefs.current.fema.remove();
    const group = L.layerGroup();
    const icon = makeOrangeIcon();
    disasters.forEach((d) => {
      const popup = `
        <div style="font-family:sans-serif;font-size:13px;color:#111">
          <strong>${d.title}</strong><br/>
          Type: ${d.type}<br/>
          State: ${d.state} — ${d.area}<br/>
          Declared: ${new Date(d.date).toLocaleDateString()}<br/>
          <em style="font-size:10px;color:#888">FEMA #${d.id}</em>
        </div>`;
      L.marker([d.lat, d.lng], { icon }).bindPopup(popup).addTo(group);
    });
    layerRefs.current.fema = group;
    if (visible.fema) group.addTo(map);
  }, [femaData, femaLoading]);

  // Hospitals layer
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (hospitalLoading) { setLayerStatus((s) => ({ ...s, hospitals: "loading" })); return; }
    const centers = hospitalData?.centers ?? [];
    setLayerStatus((s) => ({ ...s, hospitals: `${centers.length} centers` }));
    if (layerRefs.current.hospitals) layerRefs.current.hospitals.remove();
    const group = L.layerGroup();
    const icon = makeGreenIcon();
    centers.forEach((c) => {
      const popup = `
        <div style="font-family:sans-serif;font-size:13px;color:#111">
          <strong>${c.name}</strong><br/>
          <span style="color:#16a34a;font-weight:bold">Level ${c.level} Trauma Center</span><br/>
          ${c.address}<br/>
          ${c.phone ? `<span>${c.phone}</span>` : ""}
        </div>`;
      L.marker([c.lat, c.lng], { icon }).bindPopup(popup).addTo(group);
    });
    layerRefs.current.hospitals = group;
    if (visible.hospitals) group.addTo(map);
  }, [hospitalData, hospitalLoading]);

  // City-level crime spots layer
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (cityCrimeLoading) { setLayerStatus((s) => ({ ...s, cityCrime: "loading" })); return; }
    const cities = cityCrimeData?.cities ?? [];
    setLayerStatus((s) => ({ ...s, cityCrime: `${cities.length} cities` }));
    if (layerRefs.current.cityCrime) layerRefs.current.cityCrime.remove();
    const group = L.layerGroup();
    cities.forEach((c) => {
      const color = getChoroplethColor(c.weight);
      const radius = 5 + c.weight * 12;
      const marker = L.circleMarker([c.lat, c.lng], {
        radius,
        fillColor: color,
        fillOpacity: 0.82,
        color: "#000",
        weight: 1,
      });
      marker.bindTooltip(
        `<div style="font-family:sans-serif;font-size:12px;line-height:1.6">
          <b style="font-size:13px">${c.name}, ${c.state}</b><br/>
          Violent crime: <b>${c.violent}</b>/100k<br/>
          Property crime: <b>${c.property}</b>/100k
        </div>`,
        { sticky: true, opacity: 0.95 }
      );
      marker.addTo(group);
    });
    layerRefs.current.cityCrime = group;
    if (visible.cityCrime) group.addTo(map);
  }, [cityCrimeData, cityCrimeLoading]);

  // Weather radar tile layer
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !radarData) return;
    if (!radarData.url) {
      setLayerStatus((s) => ({ ...s, radar: radarData.error ? "No API key" : "Unavailable" }));
      return;
    }
    setLayerStatus((s) => ({ ...s, radar: "ready" }));
    if (layerRefs.current.radar) layerRefs.current.radar.remove();
    const tileLayer = L.tileLayer(radarData.url, {
      opacity: 0.65,
      attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
      maxZoom: 19,
    });
    layerRefs.current.radar = tileLayer;
    if (visible.radar) tileLayer.addTo(map);
  }, [radarData]);

  // Earthquake layer — USGS significant week (inner epicenter + outer felt-area halo)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (earthquakeLoading) { setLayerStatus((s) => ({ ...s, earthquakes: "loading" })); return; }
    const quakes = earthquakeData?.earthquakes ?? [];
    setLayerStatus((s) => ({ ...s, earthquakes: quakes.length ? `${quakes.length} events` : "none this week" }));
    if (layerRefs.current.earthquakes) layerRefs.current.earthquakes.remove();
    const group = L.layerGroup();

    // Sort ascending magnitude so larger quakes render on top
    const sorted = [...quakes].filter(q => q.lat && q.lng).sort((a, b) => a.magnitude - b.magnitude);

    sorted.forEach((q) => {
      // Geographic radii — scale with magnitude
      // M4 ≈ 8 km epicenter / 28 km felt  |  M6 ≈ 82 km / 287 km  |  M7+ capped 150 km / 350 km
      const innerR = Math.max(8000, Math.min(150000, 8000 * Math.pow(3.2, q.magnitude - 4)));
      const haloR  = Math.min(350000, innerR * 3.5);

      // Intensity-based opacity
      const fillOpacity  = q.magnitude >= 7 ? 0.80 : q.magnitude >= 5.5 ? 0.65 : 0.50;
      const haloOpacity  = q.magnitude >= 7 ? 0.16 : q.magnitude >= 5.5 ? 0.10 : 0.07;

      // Outer felt-area halo — potential shaking zone
      L.circle([q.lat, q.lng], {
        radius: haloR,
        fillColor: "#a855f7",
        fillOpacity: haloOpacity,
        color: "#a855f7",
        weight: 0,
        interactive: false,
      }).addTo(group);

      const timeStr = q.time ? new Date(q.time).toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Unknown";
      const magLabel = q.magnitude >= 7 ? "Major — widespread damage possible"
        : q.magnitude >= 6 ? "Strong — significant damage near epicenter"
        : q.magnitude >= 5 ? "Moderate — possible slight damage"
        : "Light — widely felt, minor shaking";
      const depthLabel = q.depth < 70 ? "Shallow (felt more intensely at the surface)"
        : q.depth < 300 ? "Intermediate depth"
        : "Deep (less surface impact than magnitude suggests)";

      // Inner epicenter circle — exact quake location
      const inner = L.circle([q.lat, q.lng], {
        radius: innerR,
        fillColor: "#a855f7",
        fillOpacity,
        color: "#7e22ce",
        weight: 1.5,
      });

      inner.bindPopup(`
        <div style="font-family:sans-serif;font-size:13px;color:#111;max-width:280px;line-height:1.55">
          <strong style="color:#7e22ce;font-size:14px">M${q.magnitude.toFixed(1)} Earthquake</strong><br/>
          <span style="font-size:11px;color:#666">${q.place}</span>
          <hr style="margin:6px 0;border-color:#e5e7eb"/>
          <b>When:</b> ${timeStr}<br/>
          <b>Magnitude:</b> ${magLabel}<br/>
          <b>Depth:</b> ${q.depth.toFixed(0)} km — ${depthLabel}
          <hr style="margin:6px 0;border-color:#e5e7eb"/>
          <span style="font-size:10px;color:#555">The solid circle marks the epicenter. The transparent halo shows the approximate felt / potential shaking zone. Shallow quakes (&lt;70 km) cause significantly more surface impact than deep events of the same magnitude.</span><br/>
          <a href="https://earthquake.usgs.gov" target="_blank" style="font-size:10px;color:#3b82f6">USGS Earthquake Hazards Program</a>
        </div>`);
      inner.addTo(group);
    });
    layerRefs.current.earthquakes = group;
    if (visible.earthquakes) group.addTo(map);
  }, [earthquakeData, earthquakeLoading]);

  // Wildfire layer — NASA FIRMS MODIS (0.1° micro-clusters, US only, danger gradient)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (wildfireLoading) { setLayerStatus((s) => ({ ...s, wildfires: "loading" })); return; }
    const fires = wildfireData?.wildfires ?? [];
    setLayerStatus((s) => ({ ...s, wildfires: fires.length ? `${fires.length} active zones` : "none" }));
    if (layerRefs.current.wildfires) layerRefs.current.wildfires.remove();
    const group = L.layerGroup();

    // Sort ascending danger so most dangerous render on top
    const sorted = [...fires].sort((a, b) => {
      const scoreA = wildfireDangerScore(a);
      const scoreB = wildfireDangerScore(b);
      return scoreA - scoreB;
    });

    sorted.forEach((f) => {
      const danger = wildfireDangerScore(f);

      // Color gradient: bright red = fresh+intense → orange → amber → muted gray
      const color = danger >= 0.75 ? "#dc2626"
        : danger >= 0.55 ? "#ea580c"
        : danger >= 0.35 ? "#f97316"
        : danger >= 0.20 ? "#eab308"
        : "#a8a29e";
      const borderColor = danger >= 0.75 ? "#991b1b"
        : danger >= 0.55 ? "#9a3412"
        : danger >= 0.35 ? "#c2410c"
        : danger >= 0.20 ? "#a16207"
        : "#6b7280";
      const fillOpacity = danger >= 0.75 ? 0.88
        : danger >= 0.55 ? 0.75
        : danger >= 0.35 ? 0.60
        : danger >= 0.20 ? 0.45
        : 0.30;
      const haloOpacity = danger >= 0.75 ? 0.22
        : danger >= 0.55 ? 0.16
        : danger >= 0.35 ? 0.11
        : danger >= 0.20 ? 0.07
        : 0.04;

      // Geographic radii (meters) — actual ground size, not screen pixels
      // Inner detection circle: ~1.5 km base, grows with FRP
      const innerR = Math.max(1500, Math.min(9000, 1500 + Math.sqrt(f.frp || 0) * 450));
      // Outer "affected zone" halo: much larger to show potential spread/impact area
      const haloR = Math.max(6000, Math.min(45000, 6000 + Math.sqrt(f.frp || 0) * 2000));

      // Outer halo — affected / spread zone
      L.circle([f.lat, f.lng], {
        radius: haloR,
        fillColor: color,
        fillOpacity: haloOpacity,
        color: color,
        weight: 0,
        interactive: false,
      }).addTo(group);

      // Inner detection circle — fire location itself
      const inner = L.circle([f.lat, f.lng], {
        radius: innerR,
        fillColor: color,
        fillOpacity,
        color: borderColor,
        weight: 1.5,
      });

      const t = f.acq_time ? f.acq_time.padStart(4, "0") : "";
      const timeFormatted = t ? `${t.slice(0, 2)}:${t.slice(2)} UTC` : "";
      const dateFormatted = f.acq_date
        ? new Date(f.acq_date + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : "Unknown";
      const bk = f.brightness;
      const frpMW = f.frp || 0;
      const intensityLabel = frpMW >= 500 ? "Extreme — catastrophic burning"
        : frpMW >= 100 ? "Very High — intense active fire"
        : frpMW >= 25 ? "High — active burning"
        : frpMW >= 5 ? "Moderate — active burn"
        : bk > 360 ? "Low-Moderate — active smoldering"
        : "Low — smoldering or dying down";
      const dangerLabel = danger >= 0.75 ? "Critical — recent & intense"
        : danger >= 0.55 ? "High — active fire"
        : danger >= 0.35 ? "Moderate — burning or recent"
        : danger >= 0.20 ? "Lower — older or low intensity"
        : "Minimal — fading or old detection";

      inner.bindPopup(`
        <div style="font-family:sans-serif;font-size:13px;color:#111;max-width:280px;line-height:1.6">
          <strong style="color:${color};font-size:14px">Active Wildfire</strong>
          <span style="float:right;background:${color};color:#fff;font-size:10px;padding:1px 6px;border-radius:4px;font-weight:600">${dangerLabel.split("—")[0].trim()}</span><br/>
          <span style="font-size:10px;color:#666">NASA MODIS satellite · 0.1° cluster (~7 mi zone)</span>
          <hr style="margin:6px 0;border-color:#e5e7eb"/>
          <b>Last detected:</b> ${dateFormatted}${timeFormatted ? " at " + timeFormatted : ""}<br/>
          <b>Fire power (FRP):</b> ${frpMW > 0 ? frpMW.toFixed(0) + " MW — " + intensityLabel : intensityLabel}<br/>
          <b>Hot spots in zone:</b> ${f.count}<br/>
          <b>Thermal reading:</b> ${bk} K brightness
          <hr style="margin:6px 0;border-color:#e5e7eb"/>
          <span style="font-size:10px;color:#555">The solid circle marks the fire's detected location. The transparent halo shows the potential area of smoke, embers, and impact. FRP (Fire Radiative Power) in megawatts is the most reliable measure of fire intensity.</span><br/>
          <a href="https://firms.modaps.eosdis.nasa.gov" target="_blank" style="font-size:10px;color:#3b82f6">NASA FIRMS / MODIS C6.1</a>
          &nbsp;·&nbsp;<a href="https://inciweb.wildfire.gov" target="_blank" style="font-size:10px;color:#3b82f6">InciWeb boundaries</a>
        </div>`);
      inner.addTo(group);
    });
    layerRefs.current.wildfires = group;
    if (visible.wildfires) group.addTo(map);
  }, [wildfireData, wildfireLoading]);

  // Hurricane layer — NHC Atlantic RSS
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (hurricaneLoading) { setLayerStatus((s) => ({ ...s, hurricanes: "loading" })); return; }
    const storms = hurricaneData?.storms ?? [];
    const activeStorms = storms.filter(s => s.lat !== null && s.lng !== null);
    setLayerStatus((s) => ({ ...s, hurricanes: activeStorms.length ? `${activeStorms.length} active` : "none active" }));
    if (layerRefs.current.hurricanes) layerRefs.current.hurricanes.remove();
    const group = L.layerGroup();
    activeStorms.forEach((storm) => {
      if (storm.lat === null || storm.lng === null) return;
      const marker = L.circleMarker([storm.lat, storm.lng], {
        radius: 8 + storm.category * 2,
        fillColor: "#ef4444",
        fillOpacity: 0.85,
        color: "#991b1b",
        weight: 2,
      });
      marker.bindPopup(`
        <div style="font-family:sans-serif;font-size:13px;color:#111;max-width:240px">
          <strong style="color:#dc2626">${storm.type} ${storm.name}</strong><br/>
          ${storm.category > 0 ? `<span style="color:#dc2626;font-weight:bold">Category ${storm.category}</span><br/>` : ""}
          <em style="font-size:11px">${storm.title}</em><br/>
          <span style="font-size:10px;color:#888">Source: NOAA National Hurricane Center</span>
        </div>`);
      marker.addTo(group);
    });
    layerRefs.current.hurricanes = group;
    if (visible.hurricanes) group.addTo(map);
  }, [hurricaneData, hurricaneLoading]);

  // ACLED US Conflict Incidents layer
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (acledLoading) { setLayerStatus((s) => ({ ...s, acled: "loading" })); return; }
    if (layerRefs.current.acled) layerRefs.current.acled.remove();
    const incidents = acledData?.incidents ?? [];
    if (!incidents.length) {
      setLayerStatus((s) => ({ ...s, acled: acledData?.error?.includes("not configured") ? "key required" : "no data" }));
      return;
    }
    setLayerStatus((s) => ({ ...s, acled: `${incidents.length} incidents` }));
    const ACLED_COLORS: Record<string, string> = {
      "Protests": "#3b82f6", "Riots": "#f97316",
      "Violence against civilians": "#ef4444", "Battles": "#dc2626",
      "Explosions/Remote violence": "#7c3aed", "Strategic developments": "#6b7280",
    };
    const group = L.layerGroup();
    incidents.forEach((inc) => {
      if (!inc.lat || !inc.lng) return;
      const color = ACLED_COLORS[inc.eventType] ?? "#9ca3af";
      const icon = L.divIcon({
        html: `<div style="background:${color};width:10px;height:10px;border-radius:50%;border:2px solid rgba(255,255,255,0.7);box-shadow:0 0 5px ${color}88"></div>`,
        className: "", iconSize: [10, 10], iconAnchor: [5, 5],
      });
      const marker = L.marker([inc.lat, inc.lng], { icon });
      marker.bindPopup(`
        <div style="font-family:sans-serif;font-size:13px;color:#111;max-width:280px">
          <strong style="color:${color}">${inc.eventType}</strong><br/>
          <span style="font-size:11px;color:#555">${inc.subType}</span><br/>
          <em style="font-size:11px">${inc.location}</em><br/>
          <span style="font-size:11px"><b>Actor:</b> ${inc.actor}</span><br/>
          <span style="font-size:11px"><b>Date:</b> ${inc.date}</span><br/>
          ${inc.fatalities > 0 ? `<span style="font-size:11px;color:#dc2626"><b>Fatalities: ${inc.fatalities}</b></span><br/>` : ""}
          ${inc.notes ? `<p style="font-size:10px;color:#555;margin:4px 0">${inc.notes}</p>` : ""}
          <span style="font-size:10px;color:#888">Source: ACLED</span>
        </div>`);
      marker.addTo(group);
    });
    layerRefs.current.acled = group;
    if (visible.acled) group.addTo(map);
  }, [acledData, acledLoading]);

  // Power Outages layer — ODIN / Oak Ridge National Laboratory
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (outageLoading) { setLayerStatus((s) => ({ ...s, outages: "loading" })); return; }
    if (layerRefs.current.outages) layerRefs.current.outages.remove();
    const outages = outageData?.outages ?? [];
    if (!outages.length) {
      setLayerStatus((s) => ({ ...s, outages: outageData?.error ? "unavailable" : "no outages" }));
      return;
    }
    // Sort ascending danger so most critical render on top
    const sorted = [...outages].sort((a, b) => outageDangerScore(a) - outageDangerScore(b));
    setLayerStatus((s) => ({ ...s, outages: `${outages.length} counties` }));
    const group = L.layerGroup();
    sorted.forEach((o) => {
      const danger = outageDangerScore(o);
      // Electric blue-to-indigo gradient: bright = large & recent, dark = small or old
      const color = danger >= 0.75 ? "#0ea5e9"   // sky-500: critical large+fresh
        : danger >= 0.55 ? "#2563eb"              // blue-600: high impact
        : danger >= 0.35 ? "#4f46e5"              // indigo-600: moderate
        : danger >= 0.20 ? "#7c3aed"              // violet-600: lower
        : "#64748b";                               // slate-500: minimal/old
      const borderColor = danger >= 0.75 ? "#075985"
        : danger >= 0.55 ? "#1d4ed8"
        : danger >= 0.35 ? "#4338ca"
        : danger >= 0.20 ? "#6d28d9"
        : "#475569";
      const fillOpacity = danger >= 0.75 ? 0.85
        : danger >= 0.55 ? 0.70
        : danger >= 0.35 ? 0.55
        : danger >= 0.20 ? 0.38
        : 0.22;
      const haloOpacity = danger >= 0.75 ? 0.18
        : danger >= 0.55 ? 0.12
        : danger >= 0.35 ? 0.08
        : danger >= 0.20 ? 0.05
        : 0.03;
      const innerR = o.metersAffected >= 50000 ? 24000
        : o.metersAffected >= 15000 ? 17000
        : o.metersAffected >= 5000  ? 12000
        : o.metersAffected >= 1000  ? 8000
        : 5000;
      const haloR = innerR * 2.8;

      // Outer halo — area of potential cascading impact
      L.circle([o.lat, o.lng], {
        radius: haloR,
        fillColor: color,
        fillOpacity: haloOpacity,
        color: color,
        weight: 0,
        interactive: false,
      }).addTo(group);

      const ageHr = o.startTime ? (Date.now() - new Date(o.startTime).getTime()) / 3_600_000 : null;
      const ageLabel = ageHr === null ? "Unknown" : ageHr < 1 ? "< 1 hour ago" : ageHr < 24 ? `~${Math.round(ageHr)} hr ago` : `~${Math.round(ageHr / 24)} day(s) ago`;
      const dangerLabel = danger >= 0.75 ? "Critical — large, recent outage"
        : danger >= 0.55 ? "High — significant impact"
        : danger >= 0.35 ? "Moderate — notable outage"
        : danger >= 0.20 ? "Lower — smaller or aging"
        : "Minimal — small or old";
      const etaStr = o.eta ? new Date(o.eta).toLocaleString() : "Not provided";

      // Inner circle — the county impact zone
      const inner = L.circle([o.lat, o.lng], {
        radius: innerR,
        fillColor: color,
        fillOpacity,
        color: borderColor,
        weight: 1.5,
        opacity: 0.9,
      });
      inner.bindPopup(`
        <div style="font-family:sans-serif;font-size:13px;color:#111;max-width:280px;line-height:1.6">
          <strong style="color:${color};font-size:14px">${o.county} County, ${o.state}</strong>
          <span style="float:right;background:${color};color:#fff;font-size:10px;padding:1px 6px;border-radius:4px;font-weight:600">${dangerLabel.split("—")[0].trim()}</span><br/>
          <span style="font-size:10px;color:#666">ODIN / Oak Ridge National Lab · US DOE</span>
          <hr style="margin:6px 0;border-color:#e5e7eb"/>
          <b>${o.metersAffected.toLocaleString()}</b> <span style="color:#555;font-size:11px">customers without power</span><br/>
          <b>Outage age:</b> ${ageLabel}<br/>
          ${o.cause ? `<b>Cause:</b> ${o.cause}<br/>` : ""}
          <b>Est. restoration:</b> ${etaStr}
          <hr style="margin:6px 0;border-color:#e5e7eb"/>
          <span style="font-size:10px;color:#555">The solid circle marks the affected county. The halo shows potential cascading impact on neighboring infrastructure. Color and size reflect both impact magnitude and how recently the outage began.</span>
        </div>`);
      inner.addTo(group);
    });
    layerRefs.current.outages = group;
    if (visible.outages) group.addTo(map);
  }, [outageData, outageLoading]);

  // Toggle layers on/off
  const toggleLayer = useCallback((key: LayerKey) => {
    const map = mapInstance.current;
    if (!map) return;
    setVisible((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const layer = layerRefs.current[key];
      if (layer) {
        if (next[key]) layer.addTo(map);
        else layer.remove();
      }
      return next;
    });
  }, []);

  const resetLayers = useCallback(() => {
    const map = mapInstance.current;
    if (!map) return;
    setVisible(() => {
      (Object.keys(layerRefs.current) as LayerKey[]).forEach((key) => {
        const layer = layerRefs.current[key];
        if (!layer) return;
        if (DEFAULT_VISIBLE[key]) layer.addTo(map);
        else layer.remove();
      });
      return { ...DEFAULT_VISIBLE };
    });
  }, []);

  const LIVE_LAYERS: LayerKey[] = ["weather", "radar", "earthquakes", "wildfires", "hurricanes", "acled", "outages"];

  const allLiveLayersActive = LIVE_LAYERS.every(k => visible[k]);

  const toggleLiveLayers = useCallback(() => {
    const map = mapInstance.current;
    if (!map) return;
    setVisible((prev) => {
      const turning0n = !LIVE_LAYERS.every(k => prev[k]);
      const next = { ...prev };
      LIVE_LAYERS.forEach((key) => {
        next[key] = turning0n;
        const layer = layerRefs.current[key];
        if (layer) {
          if (turning0n) layer.addTo(map);
          else layer.remove();
        }
      });
      return next;
    });
  }, []);

  const [layerPanelOpen, setLayerPanelOpen] = useState(true);

  const LAYERS: { key: LayerKey; label: string; icon: typeof Thermometer; color: string }[] = [
    { key: "crime", label: "State Crime Map", icon: Thermometer, color: "#ea580c" },
    { key: "cityCrime", label: "City Crime Spots", icon: ShieldAlert, color: "#ef4444" },
    { key: "weather", label: "Weather Alerts", icon: Zap, color: "#eab308" },
    { key: "radar", label: "Weather Radar", icon: Zap, color: "#60a5fa" },
    { key: "fema", label: "FEMA Disasters", icon: AlertTriangle, color: "#f97316" },
    { key: "hospitals", label: "Trauma Centers", icon: Hospital, color: "#22c55e" },
    { key: "earthquakes", label: "Earthquakes (Past 7 Days)", icon: AlertCircle, color: "#a855f7" },
    { key: "wildfires", label: "Active Wildfires", icon: Zap, color: "#f97316" },
    { key: "hurricanes", label: "Hurricane Tracks", icon: AlertTriangle, color: "#ef4444" },
    { key: "acled", label: "US Conflict Incidents", icon: Activity, color: "#3b82f6" },
    { key: "outages", label: "Power Outages", icon: Zap, color: "#eab308" },
  ];

  return (
    <>
      <SEOHead
        title="Situation Room — Interactive US Safety Map | Concealed Florida"
        description="Real-time crime, NOAA weather alerts, FEMA disasters, and Level 1 trauma center locations nationwide."
        path="/we-are-watching/map"
      />
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-2">
            <Button
              variant="secondary"
              size="sm"
              data-testid="button-back-we-are-watching"
              onClick={() => navigate("/we-are-watching")}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              We Are Watching
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" data-testid="heading-map">
              Situation Room
            </h1>
            <p className="text-gray-300 text-sm">
              Nationwide situational awareness — crime, weather, disasters, and emergency resources.
            </p>
          </div>

          {/* Emergency Alert Ticker */}
          <div className="rounded-lg overflow-hidden border border-gray-700 mb-3" data-testid="container-alert-ticker">
            <AlertTicker
              alerts={alertsData?.alerts ?? []}
              isLoading={alertsLoading}
              earthquakes={earthquakeData?.earthquakes ?? []}
              hurricanes={hurricaneData?.storms ?? []}
            />
          </div>

          {/* Map container */}
          <div className="relative rounded-lg overflow-hidden border border-gray-700" style={{ height: "580px" }}>
            <div ref={mapRef} style={{ height: "100%", width: "100%", background: "#111" }} />

            {/* Layer control panel */}
            <div className="absolute top-3 right-3 z-[1000] flex items-start gap-0">
              {/* Collapse / expand tab */}
              <button
                data-testid="button-toggle-layer-panel"
                onClick={() => setLayerPanelOpen(p => !p)}
                className="flex items-center justify-center bg-gray-900/95 border border-gray-700 border-r-0 rounded-l text-gray-400 hover:text-white transition-colors self-start"
                style={{ width: "22px", paddingTop: "10px", paddingBottom: "10px", marginTop: "0" }}
              >
                {layerPanelOpen ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
              </button>

              {layerPanelOpen && (
                <Card className="bg-gray-900/95 border-gray-700 shadow-lg min-w-[200px] rounded-l-none border-l-0">
                  <CardContent className="p-3">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Layers</p>
                    <div className="space-y-1">
                      {LAYERS.map(({ key, label, color }) => {
                        const status = layerStatus[key];
                        const isLoading = status === "loading";
                        return (
                          <button
                            key={key}
                            data-testid={`toggle-layer-${key}`}
                            onClick={() => toggleLayer(key)}
                            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-left transition-colors ${visible[key] ? "bg-gray-800" : "hover:bg-gray-800/50"}`}
                          >
                            <div
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ background: visible[key] ? color : "#374151" }}
                            />
                            <span className={`text-xs flex-1 ${visible[key] ? "text-white" : "text-gray-500"}`}>
                              {label}
                            </span>
                            {isLoading ? (
                              <Loader2 className="w-3 h-3 text-gray-500 animate-spin shrink-0" />
                            ) : (
                              <span className="text-[10px] text-gray-600 shrink-0">{status}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="border-t border-gray-700 mt-2 pt-2">
                      <button
                        data-testid="button-reset-layers"
                        onClick={resetLayers}
                        className="flex items-center gap-1.5 w-full px-2 py-1.5 rounded text-left hover:bg-gray-800/50 transition-colors group"
                      >
                        <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">Reset to defaults</span>
                      </button>
                      <button
                        data-testid="button-activate-live-layers"
                        onClick={toggleLiveLayers}
                        className={`flex items-center gap-1.5 w-full px-2 py-1.5 rounded text-left transition-colors mt-1 ${
                          allLiveLayersActive
                            ? "bg-gray-800 border border-red-900/40"
                            : "hover:bg-gray-800/50"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${allLiveLayersActive ? "bg-red-500 animate-pulse" : "bg-gray-600"}`} />
                        <span className={`text-xs font-medium ${allLiveLayersActive ? "text-red-400" : "text-gray-500"}`}>
                          {allLiveLayersActive ? "All Live Layers Active" : "Activate All Live Layers"}
                        </span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 mb-6">
            <p className="w-full text-xs text-gray-600 font-semibold uppercase tracking-wide mb-0.5">Crime Rate (violent / 100k)</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-3 h-3 rounded-sm inline-block shrink-0" style={{ background: "#166534" }} /> &lt;200 — Low
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-3 h-3 rounded-sm inline-block shrink-0" style={{ background: "#4d7c0f" }} /> 200–370 — Moderate
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-3 h-3 rounded-sm inline-block shrink-0" style={{ background: "#ca8a04" }} /> 370–505 — Elevated
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-3 h-3 rounded-sm inline-block shrink-0" style={{ background: "#ea580c" }} /> 505–670 — High
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-3 h-3 rounded-sm inline-block shrink-0" style={{ background: "#dc2626" }} /> &gt;670 — Very High
            </div>
            <div className="w-full border-t border-gray-800 my-1" />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block border border-red-400" /> Extreme Weather Alert
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> Severe / FEMA Disaster
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" /> Moderate Alert
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Minor Alert
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Trauma Center (Level I/II)
            </div>
            <div className="w-full border-t border-gray-800 my-1" />
            <p className="w-full text-xs text-gray-600 font-semibold uppercase tracking-wide">City Crime Spots (circle size = relative rate)</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-4 h-4 rounded-full bg-red-600 inline-block shrink-0 opacity-80" /> Very High (&gt;1500/100k)
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-3.5 h-3.5 rounded-full bg-orange-500 inline-block shrink-0 opacity-80" /> High (800–1500)
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block shrink-0 opacity-80" /> Elevated (400–800)
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-700 inline-block shrink-0 opacity-80" /> Moderate (200–400)
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-900 inline-block shrink-0 opacity-80" /> Low (&lt;200)
            </div>

            <div className="w-full border-t border-gray-800 my-1" />
            <p className="w-full text-xs text-gray-600 font-semibold uppercase tracking-wide">Earthquakes — Past 7 Days (circle = magnitude)</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-4 h-4 rounded-full inline-block shrink-0" style={{ background: "#a855f7", border: "1.5px solid #7e22ce" }} /> M7+ — Major
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-3.5 h-3.5 rounded-full inline-block shrink-0" style={{ background: "#a855f7", border: "1.5px solid #7e22ce" }} /> M5.5–7 — Strong/Severe
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: "#a855f7", border: "1.5px solid #7e22ce" }} /> M4–5.5 — Moderate
            </div>

            <div className="w-full border-t border-gray-800 my-1" />
            <p className="w-full text-xs text-gray-600 font-semibold uppercase tracking-wide">Active Wildfires — 24h (color + size = danger level)</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-4 h-4 rounded-full inline-block shrink-0" style={{ background: "#dc2626", border: "1px solid #991b1b" }} /> Critical — fresh detection, extreme intensity
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-3.5 h-3.5 rounded-full inline-block shrink-0" style={{ background: "#ea580c", border: "1px solid #9a3412" }} /> High — recent, actively burning
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full inline-block shrink-0" style={{ background: "#f97316", border: "1px solid #c2410c" }} /> Moderate — burning or recently active
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: "#eab308", border: "1px solid #a16207" }} /> Lower — older or low intensity
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: "#a8a29e", border: "1px solid #6b7280" }} /> Minimal — fading or old detection
            </div>

            <div className="w-full border-t border-gray-800 my-1" />
            <p className="w-full text-xs text-gray-600 font-semibold uppercase tracking-wide">Hurricanes — Active Atlantic Storms (circle = category)</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-4 h-4 rounded-full inline-block shrink-0" style={{ background: "#ef4444", border: "1.5px solid #991b1b" }} /> Category 3–5 — Major Hurricane
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full inline-block shrink-0" style={{ background: "#ef4444", border: "1.5px solid #991b1b" }} /> Category 1–2 — Hurricane
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: "#ef4444", border: "1.5px solid #991b1b" }} /> Tropical Storm
            </div>

            <div className="w-full border-t border-gray-800 my-1" />
            <p className="w-full text-xs text-gray-600 font-semibold uppercase tracking-wide">US Conflict Incidents — ACLED (color = event type)</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shrink-0" /> Violence against civilians / Battles
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block shrink-0" /> Riots
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block shrink-0" /> Protests
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block shrink-0" /> Explosions / Remote violence
            </div>

            <div className="w-full border-t border-gray-800 my-1" />
            <p className="w-full text-xs text-gray-600 font-semibold uppercase tracking-wide">Power Outages — ODIN / DOE (color = impact + recency)</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-4 h-4 rounded-full inline-block shrink-0" style={{ background: "#0ea5e9", border: "1px solid #075985" }} /> Critical — large &amp; recent
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-3.5 h-3.5 rounded-full inline-block shrink-0" style={{ background: "#2563eb", border: "1px solid #1d4ed8" }} /> High impact
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full inline-block shrink-0" style={{ background: "#4f46e5", border: "1px solid #4338ca" }} /> Moderate
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: "#7c3aed", border: "1px solid #6d28d9" }} /> Lower — smaller or aging
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: "#64748b" }} /> Minimal — small or old
            </div>
          </div>

          {/* ── The Wire — S2 Underground ── */}
          <div className="mt-8 mb-8 border-t border-gray-800 pt-8" id="the-wire" data-testid="section-map-wire">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <Radio className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">The Wire</h2>
                  <p className="text-gray-500 text-xs mt-0.5">S2 Underground — Daily Situational Intelligence Briefing</p>
                </div>
                <Badge variant="secondary" className="text-xs no-default-active-elevate">Daily</Badge>
              </div>
              <Button variant="secondary" size="sm" asChild data-testid="button-wire-liberty">
                <a href="/we-are-watching/news#the-wire" className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Liberty Watch
                </a>
              </Button>
            </div>

            {wireLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-secondary rounded-lg animate-pulse" style={{ height: "280px" }} />
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-secondary rounded-md animate-pulse h-16" />
                  ))}
                </div>
              </div>
            ) : wireVideos.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                  <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${wireVideos[0].id}`}
                      title={wireVideos[0].title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: 0 }}
                      data-testid="video-wire-map-latest"
                    />
                  </div>
                  <p className="text-white text-sm font-semibold mt-2 leading-snug line-clamp-2">{wireVideos[0].title}</p>
                  <p className="text-gray-500 text-xs mt-1">{fmtDate(wireVideos[0].publishedAt)}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">Recent Episodes</p>
                  {wireVideos.slice(1, 6).map((video) => (
                    <a
                      key={video.id}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex gap-3 items-start hover-elevate rounded-md p-1.5 -mx-1.5"
                      data-testid={`card-wire-map-${video.id}`}
                    >
                      <div className="relative flex-shrink-0 rounded-md overflow-hidden" style={{ width: "100px", aspectRatio: "16/9" }}>
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ExternalLink className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium leading-snug line-clamp-2">{video.title}</p>
                        <p className="text-gray-600 text-xs mt-1">{fmtDate(video.publishedAt)}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-secondary border border-border rounded-lg p-5 flex items-center gap-3">
                <Radio className="w-6 h-6 text-gray-600 shrink-0" />
                <p className="text-gray-500 text-sm">Wire feed requires a YouTube API key to load live content.</p>
              </div>
            )}
          </div>

          {/* Sex Offender Registry panel */}
          <Card className="bg-secondary border-secondary mb-8" data-testid="panel-sex-offender">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start gap-3 mb-3">
                <ShieldAlert className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Sex Offender Registry</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Sex offender location data is not displayed on this map to ensure legal accuracy and prevent misuse. Search the official registries below — nationwide or Florida-specific.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                <Button variant="secondary" size="default" asChild data-testid="button-nsopw-registry">
                  <a href="https://www.nsopw.gov" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    National Registry (NSOPW)
                  </a>
                </Button>
                <Button variant="secondary" size="default" asChild data-testid="button-fdle-registry">
                  <a href="https://offender.fdle.state.fl.us" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Florida — FDLE Registry
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── Threat Awareness Center ──────────────────────────────────── */}
          <div className="mt-4 mb-10" data-testid="section-threat-awareness">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              <h2 className="text-lg font-bold text-white tracking-widest uppercase">Threat Awareness Center</h2>
              <span className="text-xs text-gray-600 ml-auto">Live intel feeds</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Card 1: FBI Latest News */}
              <Card className="bg-gray-900 border-red-900/40" data-testid="card-fbi-alerts">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="text-sm font-semibold text-white">FBI Latest News</span>
                    <span className="ml-auto text-[10px] text-gray-600">fbi.gov</span>
                  </div>
                  {fbiLoading ? (
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-10">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                    </div>
                  ) : (fbiData?.error && !(fbiData?.items?.length)) ? (
                    <p className="text-gray-500 text-xs py-10 text-center">Feed temporarily unavailable</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {(fbiData?.items ?? []).map((item, i) => (
                        <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                          className="block p-2 rounded bg-gray-800/60 hover-elevate" data-testid={`fbi-item-${i}`}>
                          <p className="text-white text-xs font-medium leading-snug">{item.title}</p>
                          <p className="text-gray-500 text-[10px] mt-1">{item.pubDate}</p>
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-800">
                    <a href="https://www.fbi.gov" target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> FBI.gov
                    </a>
                    {fbiData?.updatedAt && (
                      <span className="text-[10px] text-gray-700">Updated: {new Date(fbiData.updatedAt).toLocaleTimeString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: ACLED US Political Violence */}
              <Card className="bg-gray-900 border-blue-900/40" data-testid="card-acled-incidents">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-sm font-semibold text-white">US Conflict Incidents</span>
                    <span className="ml-auto text-[10px] text-gray-600">ACLED</span>
                  </div>
                  {acledLoading ? (
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-10">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                    </div>
                  ) : acledData?.error?.includes("not configured") ? (
                    <div className="py-8 text-center">
                      <Activity className="w-6 h-6 text-gray-700 mx-auto mb-2" />
                      <p className="text-gray-500 text-xs">ACLED key not configured</p>
                      <p className="text-gray-600 text-[10px] mt-1">Add ACLED_API_KEY + ACLED_EMAIL to Secrets</p>
                    </div>
                  ) : !(acledData?.incidents?.length) ? (
                    <p className="text-gray-500 text-xs py-10 text-center">No incidents available</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {(acledData?.incidents ?? []).slice(0, 10).map((inc, i) => {
                        const acledColorMap: Record<string, string> = {
                          "Protests": "text-blue-400", "Riots": "text-orange-400",
                          "Violence against civilians": "text-red-400", "Battles": "text-red-500",
                          "Explosions/Remote violence": "text-purple-400",
                        };
                        const textColor = acledColorMap[inc.eventType] ?? "text-gray-400";
                        return (
                          <div key={i} className="p-2 rounded bg-gray-800/60" data-testid={`acled-incident-${i}`}>
                            <div className="flex items-start justify-between gap-2">
                              <span className={`text-xs font-medium ${textColor}`}>{inc.eventType}</span>
                              {inc.fatalities > 0 && <span className="text-[10px] text-red-400 shrink-0">{inc.fatalities} killed</span>}
                            </div>
                            <p className="text-gray-300 text-[11px]">{inc.location} — {inc.date}</p>
                            {inc.actor && <p className="text-gray-500 text-[10px]">{inc.actor}</p>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-800">
                    <a href="https://acleddata.com" target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> ACLED
                    </a>
                    {acledData?.updatedAt && (
                      <span className="text-[10px] text-gray-700">Updated: {new Date(acledData.updatedAt).toLocaleTimeString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: State Department Travel Advisories */}
              <Card className="bg-gray-900 border-amber-900/40" data-testid="card-statedept-advisories">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-sm font-semibold text-white">State Dept Travel Advisories</span>
                    <span className="ml-auto text-[10px] text-gray-600">travel.state.gov</span>
                  </div>
                  {stateDeptData?.isStatic && (
                    <p className="text-[10px] text-amber-700 mb-3">Curated snapshot — verify current levels at <a href="https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-500">travel.state.gov</a> before travel</p>
                  )}
                  {stateDeptLoading ? (
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-10">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                    </div>
                  ) : !(stateDeptData?.advisories?.length) ? (
                    <div className="py-8 text-center">
                      <Globe className="w-6 h-6 text-gray-700 mx-auto mb-2" />
                      <p className="text-gray-500 text-xs mb-2">Travel advisory data unavailable</p>
                      <a href="https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html" target="_blank" rel="noopener noreferrer"
                        className="text-amber-500 text-xs flex items-center justify-center gap-1 hover:text-amber-400 transition-colors">
                        <ExternalLink className="w-3 h-3" /> View live advisories at travel.state.gov
                      </a>
                    </div>
                  ) : (() => {
                    const l4 = stateDeptData.advisories.filter(a => a.level === 4);
                    const l3 = stateDeptData.advisories.filter(a => a.level === 3);
                    return (
                      <div className="space-y-3">
                        {l4.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-700 text-red-100 shrink-0">LEVEL 4</span>
                              <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wide">Do Not Travel — {l4.length} countries</span>
                            </div>
                            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                              {l4.map((adv, i) => (
                                <a key={i} href={adv.link} target="_blank" rel="noopener noreferrer"
                                  className="flex items-start gap-2 p-1.5 rounded bg-red-900/30 hover-elevate" data-testid={`statedept-advisory-${i}`}>
                                  <span className="text-red-300 text-xs font-medium shrink-0 mt-0.5">{adv.country}</span>
                                  <span className="text-gray-500 text-[10px] leading-tight">{adv.levelText.replace(/^Do Not Travel\s*[—–-]\s*/i, "")}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        {l3.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-700 text-orange-100 shrink-0">LEVEL 3</span>
                              <span className="text-[10px] text-orange-400 font-semibold uppercase tracking-wide">Reconsider Travel — {l3.length} countries</span>
                            </div>
                            <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                              {l3.map((adv, i) => (
                                <a key={i} href={adv.link} target="_blank" rel="noopener noreferrer"
                                  className="flex items-start gap-2 p-1.5 rounded bg-orange-900/25 hover-elevate" data-testid={`statedept-advisory-l3-${i}`}>
                                  <span className="text-orange-300 text-xs font-medium shrink-0 mt-0.5">{adv.country}</span>
                                  <span className="text-gray-500 text-[10px] leading-tight">{adv.levelText.replace(/^Reconsider Travel\s*[—–-]\s*/i, "")}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="pt-1 border-t border-gray-800">
                          <p className="text-[10px] text-gray-700 leading-relaxed">The State Dept uses a 4-level system. <span className="text-gray-600">Level 1 = Exercise Normal Caution · Level 2 = Exercise Increased Caution · Level 3 = Reconsider Travel · Level 4 = Do Not Travel.</span> Levels 1 &amp; 2 omitted here as preparedness-irrelevant.</p>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-800">
                    <a href="https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html" target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Full list at travel.state.gov
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: CISA Active Security Alerts */}
              <Card className="bg-gray-900 border-purple-900/40" data-testid="card-cisa-alerts">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Radio className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-sm font-semibold text-white">CISA Threat Alerts</span>
                    <span className="ml-auto text-[10px] text-gray-600">cisa.gov</span>
                  </div>
                  <p className="text-gray-600 text-[10px] mb-3">Infrastructure &amp; cybersecurity threats affecting US systems</p>
                  {cisaLoading ? (
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-8">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                    </div>
                  ) : (cisaData?.error && !(cisaData?.alerts?.length)) ? (
                    <p className="text-gray-500 text-xs py-8 text-center">Feed temporarily unavailable</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {(cisaData?.alerts ?? []).map((alert, i) => {
                        const sevStyle = alert.severity === "Critical" ? "text-red-400 bg-red-900/40 border-red-800/40"
                          : alert.severity === "High" ? "text-orange-400 bg-orange-900/40 border-orange-800/40"
                          : alert.severity === "Medium" ? "text-yellow-400 bg-yellow-900/40 border-yellow-800/40"
                          : "text-blue-400 bg-blue-900/20 border-blue-800/30";
                        return (
                          <a key={i} href={alert.link} target="_blank" rel="noopener noreferrer"
                            className="block p-2 rounded bg-gray-800/60 hover-elevate" data-testid={`cisa-alert-${i}`}>
                            <div className="flex items-start gap-2">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${sevStyle}`}>{alert.severity}</span>
                              <p className="text-gray-200 text-[11px] leading-snug">{alert.title}</p>
                            </div>
                            <p className="text-gray-600 text-[10px] mt-1">{alert.pubDate ? new Date(alert.pubDate).toLocaleDateString() : ""}</p>
                          </a>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-800">
                    <a href="https://www.cisa.gov" target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> CISA.gov
                    </a>
                    {cisaData?.updatedAt && (
                      <span className="text-[10px] text-gray-700">Updated: {new Date(cisaData.updatedAt).toLocaleTimeString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Card 5: Power Grid Status */}
              <Card className="bg-gray-900 border-yellow-900/40 lg:col-span-2" data-testid="card-power-grid">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span className="text-sm font-semibold text-white">Power Grid Status</span>
                    <span className="ml-auto text-[10px] text-gray-600">ODIN / Oak Ridge National Lab</span>
                  </div>
                  {outageLoading ? (
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-6">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                    </div>
                  ) : outageData?.error && !(outageData?.outages?.length) ? (
                    <p className="text-gray-500 text-xs py-6 text-center">Feed temporarily unavailable</p>
                  ) : !(outageData?.outages?.length) ? (
                    <div className="flex items-center gap-3 py-4">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <div>
                        <p className="text-green-400 text-sm font-semibold">No significant outages detected</p>
                        <p className="text-gray-500 text-xs">Grid status appears normal nationwide</p>
                      </div>
                    </div>
                  ) : (() => {
                    const out = outageData?.outages ?? [];
                    const totalCounties = out.length;
                    const totalCustomers = out.reduce((s, o) => s + o.metersAffected, 0);
                    const top3 = out.slice(0, 3);
                    return (
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex gap-6 shrink-0">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-400">{totalCounties}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">Counties affected</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-400">{totalCustomers.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">Est. customers out</p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold mb-2">Most Affected Counties</p>
                          <div className="space-y-1.5">
                            {top3.map((o, i) => {
                              const pct = totalCustomers > 0 ? Math.round((o.metersAffected / totalCustomers) * 100) : 0;
                              const ds = outageDangerScore(o);
                              const barColor = ds >= 0.75 ? "#0ea5e9" : ds >= 0.55 ? "#2563eb" : ds >= 0.35 ? "#4f46e5" : "#7c3aed";
                              return (
                                <div key={i} className="flex items-center gap-3" data-testid={`outage-top-${i}`}>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-0.5">
                                      <span className="text-white text-xs font-medium">{o.county}, {o.state}</span>
                                      <span className="text-gray-400 text-[10px]">{o.metersAffected.toLocaleString()} customers</span>
                                    </div>
                                    <div className="h-1 rounded-full bg-gray-800 overflow-hidden">
                                      <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(pct, 4)}%`, background: barColor }} />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-800">
                    <a href="https://ornl.opendatasoft.com/explore/dataset/odin-real-time-outages-county" target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> ODIN / Oak Ridge
                    </a>
                    {outageData?.updatedAt && (
                      <span className="text-[10px] text-gray-700">Updated: {new Date(outageData.updatedAt).toLocaleTimeString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Disclaimer */}
            <p className="text-gray-700 text-[10px] leading-relaxed mt-4 border-t border-gray-800 pt-4" data-testid="text-threat-disclaimer">
              This information is aggregated from public government and academic sources for situational awareness purposes only. Concealed Florida does not originate, verify, or endorse any alerts shown. Always refer to official government sources for emergency guidance. This is not a substitute for official emergency broadcasts.
            </p>
          </div>

          {/* ── How to Read This Map ─────────────────────────────────────── */}
          <div className="mb-8" data-testid="section-how-to-read">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-500 shrink-0" />
                <h2 className="text-white font-semibold text-base">How to Read This Map</h2>
              </div>
              <div className="relative group shrink-0" data-testid="download-menu-situation-room">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                  data-testid="button-download-situation-room"
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
                    onClick={downloadSituationRoomAsTxt}
                    data-testid="button-situation-room-format-txt"
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-gray-500" />
                    Text (.txt)
                  </button>
                  <button
                    onClick={downloadSituationRoomAsWord}
                    data-testid="button-situation-room-format-word"
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    Word (.doc)
                  </button>
                  <button
                    onClick={printSituationRoomAsPdf}
                    data-testid="button-situation-room-format-pdf"
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-red-400" />
                    PDF (Print/Save)
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation basics */}
            <Card className="bg-secondary border-secondary mb-4">
              <CardContent className="pt-4 pb-4">
                <p className="text-white font-semibold text-sm mb-2">Navigating the Map</p>
                <ul className="text-gray-300 text-sm leading-relaxed space-y-1.5">
                  <li><span className="text-gray-300 font-medium">Layer panel (top-right corner)</span> — Toggle any data layer on or off. Layers stack on top of each other; you can run them all simultaneously or isolate just one.</li>
                  <li><span className="text-gray-300 font-medium">Hover</span> over any colored state, city circle, or alert zone to see a tooltip with exact numbers, event type, and severity.</li>
                  <li><span className="text-gray-300 font-medium">Click</span> weather alert zones and FEMA markers to open a popup with the full event headline and expiration date.</li>
                  <li><span className="text-gray-300 font-medium">Scroll to zoom</span> and drag to pan. Zoom in to see city-level circles more clearly when the City Crime Spots layer is on.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Layer-by-layer breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">

              {/* State Crime Map */}
              <Card className="bg-secondary border-secondary">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white font-semibold text-sm">State Crime Map</p>
                        <span className="text-[10px] bg-yellow-900/50 text-yellow-400 border border-yellow-800/60 px-1.5 py-0.5 rounded-md font-medium">Historical</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Each US state is shaded green through red based on its <span className="text-gray-300">violent crime rate per 100,000 residents</span> — the FBI's standard measure for comparing jurisdictions of different sizes. Dark green means fewer than 200 violent crimes per 100k (low). Deep red means more than 670 (very high).
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Source:</span> FBI UCR 2022 — the most recent complete annual report. State-level crime patterns are slow to shift; this data accurately reflects relative safety rankings between states. Use it to compare regions, not to predict exact current conditions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* City Crime Spots */}
              <Card className="bg-secondary border-secondary">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white font-semibold text-sm">City Crime Spots</p>
                        <span className="text-[10px] bg-yellow-900/50 text-yellow-400 border border-yellow-800/60 px-1.5 py-0.5 rounded-md font-medium">Historical</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Colored circles mark 71 major US cities. <span className="text-gray-300">Circle size reflects relative violent crime rate</span> — a bigger circle means a higher rate. The same green-to-red color scale as the state layer applies. Hover any circle to see exact violent and property crime figures.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Source:</span> FBI UCR 2022. City-level rates can shift more noticeably year-to-year than state rates — policy changes, population shifts, and reporting differences all play a role. Treat this as a directional snapshot rather than a precise current reading.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weather Alerts */}
              <Card className="bg-secondary border-secondary">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white font-semibold text-sm">Weather Alerts</p>
                        <span className="text-[10px] bg-green-900/50 text-green-400 border border-green-800/60 px-1.5 py-0.5 rounded-md font-medium">Live · 10-min refresh</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Shaded polygons from NOAA's National Weather Service represent <span className="text-gray-300">active, official alerts by severity</span>: red = Extreme, orange = Severe, yellow = Moderate, blue = Minor. The shaded area reflects the exact geographic zone under the alert — not a single point. Click any zone to read the full headline and expiration time.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Accuracy:</span> High. This pulls directly from api.weather.gov — the same data powering every weather app. Alerts are issued by trained meteorologists and are legally binding for emergency management.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weather Radar */}
              <Card className="bg-secondary border-secondary">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white font-semibold text-sm">Weather Radar</p>
                        <span className="text-[10px] bg-green-900/50 text-green-400 border border-green-800/60 px-1.5 py-0.5 rounded-md font-medium">Near Real-Time</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        A precipitation overlay tile from OpenWeatherMap. Blues and greens indicate light rain; oranges and reds indicate heavier precipitation. Best used <span className="text-gray-300">alongside the Weather Alerts layer</span> to see where active storm systems are physically located.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Accuracy:</span> High for broad storm-tracking. For local, minute-by-minute radar detail, cross-reference with your NWS local forecast or a dedicated radar app.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FEMA Disasters */}
              <Card className="bg-secondary border-secondary">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white font-semibold text-sm">FEMA Disasters</p>
                        <span className="text-[10px] bg-yellow-900/50 text-yellow-400 border border-yellow-800/60 px-1.5 py-0.5 rounded-md font-medium">Recent 12 Months</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Orange markers show <span className="text-gray-300">federally declared disasters from the past 12 months</span> — hurricanes, floods, wildfires, severe storms, and other events that qualified for FEMA aid. Each marker includes the disaster name, type, state, and declaration date.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Important limitation:</span> Markers are placed at the approximate center of the declared state — <span className="text-gray-300">not the exact disaster impact area</span>. FEMA declarations also lag real events by days to weeks, so very recent incidents may not appear yet. Use this layer to see which states have had federally recognized disaster events, not to pinpoint exact zones.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trauma Centers */}
              <Card className="bg-secondary border-secondary">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white font-semibold text-sm">Trauma Centers</p>
                        <span className="text-[10px] bg-green-900/50 text-green-400 border border-green-800/60 px-1.5 py-0.5 rounded-md font-medium">Static · High Accuracy</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Green markers show <span className="text-gray-300">verified Level I and Level II trauma centers</span> — the highest-capability emergency surgical facilities in the country. Level I centers can handle any injury; Level II centers handle the vast majority. Knowing the nearest trauma center before you travel can be life-saving.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Accuracy:</span> High. Trauma center designations are state-verified and rarely change. The locations shown are the physical hospital addresses. In a true emergency, always call 911 — paramedics will route to the appropriate facility.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Earthquakes */}
              <Card className="bg-secondary border-secondary" data-testid="card-layer-info-earthquakes">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "#a855f7" }} />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white font-semibold text-sm">Earthquakes — Past 7 Days</p>
                        <span className="text-[10px] bg-purple-900/50 text-purple-300 border border-purple-800/60 px-1.5 py-0.5 rounded-md font-medium">Live · 1-hr refresh</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Purple circles mark earthquakes reported by USGS in the past 7 days that were significant enough to be widely felt or potentially cause damage. <span className="text-gray-300">Bigger circles = higher magnitude.</span> Click any marker to see magnitude, what it means, depth, and exact time.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Understanding magnitude:</span> M4 = minor shaking. M5 = moderate, may cause slight damage. M6 = strong, significant damage near the epicenter. M7+ = major, widespread destruction possible. Each whole number step is roughly 31× more energy released.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Why depth matters:</span> A shallow quake (under 70 km deep) shakes the surface far more intensely than a deep one of the same magnitude. A shallow M5.5 can be more damaging than a deep M6.
                      </p>
                      <p className="text-gray-300 text-xs mt-2">
                        <a href="https://earthquake.usgs.gov" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">earthquake.usgs.gov</a>
                        <span className="text-gray-600"> — USGS Earthquake Hazards Program</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Wildfires */}
              <Card className="bg-secondary border-secondary" data-testid="card-layer-info-wildfires">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "#dc2626" }} />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white font-semibold text-sm">Active Wildfires</p>
                        <span className="text-[10px] bg-orange-900/50 text-orange-300 border border-orange-800/60 px-1.5 py-0.5 rounded-md font-medium">Live · 2-hr refresh</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Each fire is plotted at its <span className="text-gray-300">actual detected location</span> from the NASA MODIS satellite — clustered within a ~7-mile zone for nearby readings, not a 70-mile box. Locations are accurate to within a few miles of where the fire was burning.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Two circles per fire:</span> The solid inner circle marks the fire location. The larger transparent halo shows the potential area of smoke, embers, and heat impact — a higher-energy fire has a wider halo.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Color = danger level</span> — a combination of how recently it was detected and how much energy it is releasing:
                      </p>
                      <ul className="text-gray-300 text-xs mt-1 space-y-0.5 pl-2">
                        <li><span style={{ color: "#dc2626" }} className="font-medium">Red</span> — Critical: fresh today, extreme fire power</li>
                        <li><span style={{ color: "#ea580c" }} className="font-medium">Orange-red</span> — High: recently active, intense burning</li>
                        <li><span style={{ color: "#f97316" }} className="font-medium">Orange</span> — Moderate: burning or detected recently</li>
                        <li><span style={{ color: "#eab308" }} className="font-medium">Amber</span> — Lower: older or weakening fire</li>
                        <li><span style={{ color: "#a8a29e" }} className="font-medium">Gray</span> — Minimal: fading or 2-day-old detection</li>
                      </ul>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">FRP (Fire Radiative Power)</span> in megawatts is the best intensity measure — it tells you how much energy the fire is releasing. Click any fire marker to see its exact FRP and a plain-language explanation of what that means.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Limitation:</span> Cloud cover blocks satellite view. For exact fire perimeters and evacuation orders, use{" "}
                        <a href="https://inciweb.wildfire.gov" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors">InciWeb</a>.
                      </p>
                      <p className="text-gray-300 text-xs mt-2">
                        <a href="https://firms.modaps.eosdis.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors">firms.modaps.eosdis.nasa.gov</a>
                        <span className="text-gray-600"> — NASA FIRMS / MODIS C6.1 satellite</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* US Conflict Incidents — ACLED */}
              <Card className="bg-secondary border-secondary" data-testid="card-layer-info-acled">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "#ef4444" }} />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white font-semibold text-sm">US Conflict Incidents — ACLED</p>
                        <span className="text-[10px] bg-blue-900/50 text-blue-300 border border-blue-800/60 px-1.5 py-0.5 rounded-md font-medium">Live · 30-min refresh · Key required</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Color-coded markers show <span className="text-gray-300">real-world political violence and protest events inside the United States</span> compiled by ACLED — the Armed Conflict Location &amp; Event Data Project. This is the same dataset used by governments, the UN, and major news organizations to track social unrest, demonstrations, and incidents of organized violence.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">What each color means:</span>
                      </p>
                      <ul className="text-gray-300 text-xs mt-1 space-y-0.5 pl-2">
                        <li><span className="text-red-400 font-medium">Red</span> — Battles: armed clashes between organized groups</li>
                        <li><span className="text-orange-400 font-medium">Orange</span> — Violence against civilians: targeted attacks on non-combatants</li>
                        <li><span className="text-yellow-400 font-medium">Yellow</span> — Riots: spontaneous violent crowd events</li>
                        <li><span className="text-blue-400 font-medium">Blue</span> — Protests: peaceful or semi-peaceful demonstrations</li>
                        <li><span className="text-purple-400 font-medium">Purple</span> — Explosions / Remote violence: bombings, IEDs, drone activity</li>
                        <li><span className="text-gray-400 font-medium">Gray</span> — Strategic developments: troop movements, non-violent group activity</li>
                      </ul>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Why this matters for preparedness:</span> ACLED data can surface organized unrest, protest events that turned violent, or localized conflict activity that may not receive major national news coverage. It does not predict future events, but shows where incidents have recently occurred.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Activation:</span> This layer requires an ACLED API key (free for researchers and non-commercial users). Without the key, the layer shows a "key required" state. Contact your administrator if you believe the key should be configured.
                      </p>
                      <p className="text-gray-300 text-xs mt-2">
                        <a href="https://acleddata.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">acleddata.com</a>
                        <span className="text-gray-600"> — Armed Conflict Location &amp; Event Data Project</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Power Outages — ODIN */}
              <Card className="bg-secondary border-secondary" data-testid="card-layer-info-outages">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "#0ea5e9" }} />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white font-semibold text-sm">Power Outages — ODIN / DOE</p>
                        <span className="text-[10px] bg-sky-900/50 text-sky-300 border border-sky-800/60 px-1.5 py-0.5 rounded-md font-medium">Live · 15-min refresh</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Blue-to-indigo circles mark counties with <span className="text-gray-300">active, significant power outages</span> sourced from ODIN — the Outage Data Initiative Nationwide, a program of Oak Ridge National Laboratory run under the US Department of Energy Office of Electricity. This is one of the most authoritative national power outage feeds available.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Two circles per county:</span> The solid inner circle marks the affected county center. The larger, transparent halo shows the potential area of cascading impact on neighboring infrastructure, communications, and supply chains — larger and more recent outages have wider halos.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Color = combined impact score</span> — both how large the outage is AND how recently it started:
                      </p>
                      <ul className="text-gray-300 text-xs mt-1 space-y-0.5 pl-2">
                        <li><span style={{ color: "#0ea5e9" }} className="font-medium">Bright blue</span> — Critical: many customers + reported recently</li>
                        <li><span style={{ color: "#2563eb" }} className="font-medium">Blue</span> — High: large customer count or fresh report</li>
                        <li><span style={{ color: "#4f46e5" }} className="font-medium">Indigo</span> — Moderate: notable outage, some age</li>
                        <li><span style={{ color: "#7c3aed" }} className="font-medium">Violet</span> — Lower: smaller count or older event</li>
                        <li><span style={{ color: "#64748b" }} className="font-medium">Gray</span> — Minimal: small or days-old outage</li>
                      </ul>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Click any circle</span> to see the county, exact customer count, reported cause, outage start time, and estimated restoration time (ETA) when provided by the utility.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Limitation:</span> This data reflects what utilities have reported to the DOE. Small, local outages that utilities have not yet escalated to federal reporting may not appear. The map shows county-level centroids — not exact street-level outage boundaries.
                      </p>
                      <p className="text-gray-300 text-xs mt-2">
                        <a href="https://ornl.opendatasoft.com/explore/dataset/odin-real-time-outages-county" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 transition-colors">ornl.opendatasoft.com</a>
                        <span className="text-gray-600"> — ODIN / Oak Ridge National Laboratory · US DOE Office of Electricity</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hurricane Tracks */}
              <Card className="bg-secondary border-secondary" data-testid="card-layer-info-hurricanes">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "#ef4444" }} />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white font-semibold text-sm">Hurricane Tracks</p>
                        <span className="text-[10px] bg-red-900/50 text-red-300 border border-red-800/60 px-1.5 py-0.5 rounded-md font-medium">Live · 30-min refresh · June–Nov</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Red markers show any <span className="text-gray-300">currently active Atlantic tropical storms or hurricanes</span> from the NOAA National Hurricane Center. If no storms are active, no markers appear on the map. Click a marker to see the storm name, category, and current position.
                      </p>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Saffir-Simpson Scale (wind speed guide):</span>
                      </p>
                      <ul className="text-gray-300 text-xs mt-1 space-y-0.5 pl-2">
                        <li>Tropical Storm — winds 39–73 mph, storm surge and flooding risk</li>
                        <li>Category 1 — 74–95 mph, some damage (roof, trees, power)</li>
                        <li>Category 2 — 96–110 mph, extensive damage</li>
                        <li>Category 3 — 111–129 mph, Major Hurricane, devastating damage</li>
                        <li>Category 4 — 130–156 mph, catastrophic damage</li>
                        <li>Category 5 — 157+ mph, catastrophic, many homes destroyed</li>
                      </ul>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                        <span className="text-gray-400 font-medium">Season:</span> The Atlantic hurricane season officially runs June 1 through November 30. This layer defaults to ON during those months and OFF otherwise. Named storms can occasionally form outside this window.
                      </p>
                      <p className="text-gray-300 text-xs mt-2">
                        <a href="https://www.nhc.noaa.gov" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 transition-colors">nhc.noaa.gov</a>
                        <span className="text-gray-600"> — NOAA National Hurricane Center</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Accuracy & Disclaimers */}
            <Card className="bg-secondary border-secondary" data-testid="panel-disclaimers">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <TriangleAlert className="w-4 h-4 text-yellow-500 shrink-0" />
                  <p className="text-white font-semibold text-sm">Data Accuracy & Disclaimers</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-300 text-xs font-medium mb-0.5">Crime Data Is a 2022 Snapshot — Not a Live Feed</p>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        The FBI's Uniform Crime Report is an annual publication covering reported offenses from the prior calendar year. The 2022 report (published 2023) is the most recent dataset with broad, comparable state-level coverage. The FBI transitioned to the NIBRS system in 2021, and national rollout of comparable city-level data is still incomplete — making the 2022 UCR the most reliable baseline available. Crime rates at the state level typically move slowly (1–5% per year), so relative rankings remain meaningful. Individual cities can see larger swings due to policy changes, population shifts, or major events.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-300 text-xs font-medium mb-0.5">What Is Accurate Right Now</p>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        <span className="text-gray-400">Weather Alerts</span> — fetched live from NOAA api.weather.gov every 10 minutes. These are the same official alerts that emergency managers, first responders, and news broadcasters rely on. Alert polygon boundaries reflect the real issued zones.
                        <br /><span className="text-gray-400">Weather Radar</span> — near-real-time precipitation tiles updated continuously.
                        <br /><span className="text-gray-400">Trauma Center locations</span> — verified addresses that rarely change.
                        <br /><span className="text-gray-400">Earthquakes</span> — USGS significant_week feed, refreshed every hour. Only quakes meeting USGS "significant" threshold appear, which is roughly M4.5+ that were widely felt. Accuracy is extremely high — seismograph networks have pinpoint precision.
                        <br /><span className="text-gray-400">Wildfire detections</span> — NASA FIRMS MODIS satellite, refreshed every 2 hours. Satellites pass multiple times per day; new fires can appear within hours of ignition.
                        <br /><span className="text-gray-400">Hurricane tracks</span> — NOAA National Hurricane Center RSS, refreshed every 30 minutes. NHC issues official advisories every 3–6 hours during active storms. The NHC is the definitive authority for Atlantic basin tropical systems.
                        <br /><span className="text-gray-400">Power outages</span> — ODIN / Oak Ridge National Laboratory, refreshed every 15 minutes. Data reflects what utilities have escalated to DOE-level federal reporting — the most authoritative national outage feed available.
                        <br /><span className="text-gray-400">US Conflict Incidents (ACLED)</span> — Armed Conflict Location &amp; Event Data Project, refreshed every 30 minutes when an API key is configured. Events typically appear within 1–2 days of occurrence. ACLED is the most widely cited academic and government-grade conflict database for the United States.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-3.5 h-3.5 text-orange-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-300 text-xs font-medium mb-0.5">What to Use with Caution</p>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        <span className="text-gray-400">FEMA marker positions</span> are approximate — they mark the state center, not the precise impact area. The declaration date also lags the actual event onset.
                        <br /><span className="text-gray-400">City crime circles</span> reflect 2022 data. Some cities have seen significant changes since then. Always cross-reference with local police department annual reports for the most current picture.
                        <br /><span className="text-gray-400">Wildfire locations</span> are accurate to within ~7 miles — precise enough for regional awareness, but not exact enough to determine whether your specific neighborhood is in a fire perimeter. For official boundaries and evacuation orders, check <a href="https://inciweb.wildfire.gov" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline">InciWeb</a> or your local fire agency.
                        <br /><span className="text-gray-400">Cloud cover can hide fires</span> from satellite detection entirely. During active fire weather events with overcast skies, actual fire activity may be higher than what appears on the map.
                        <br /><span className="text-gray-400">Power outage circles</span> are centered on county centroids — not the exact block or neighborhood boundary. Small, hyper-local outages that utilities have not yet escalated to federal reporting may not appear. Estimated restoration times (ETAs) are utility-provided estimates and can change.
                        <br /><span className="text-gray-400">ACLED conflict data</span> has a typical 1–2 day reporting lag — it is not instantaneous. Low-level incidents (minor property damage, brief scuffles) are sometimes excluded from the dataset based on ACLED's coding criteria. Do not interpret the absence of markers in a region as confirmation of zero incidents.
                        <br /><span className="text-gray-400">State Dept travel advisories</span> on this page are a curated snapshot; the travel.state.gov live RSS feed is bot-protected. Always verify current advisory levels at travel.state.gov directly before any international travel.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-3.5 h-3.5 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-300 text-xs font-medium mb-0.5">This Map Is a Situational Awareness Tool</p>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Nothing here replaces local knowledge, direct engagement with your community, or real-time contact with law enforcement and emergency services. Use this map to build a baseline understanding of risk patterns across the country — then verify with local sources before making decisions. In any emergency, always call 911.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Credits */}
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-3">Data Sources</p>
            <ul className="space-y-1.5 text-gray-600 text-xs flex flex-col">
              <li>
                <a href="https://ucr.fbi.gov/crime-in-the-u.s" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
                  FBI Uniform Crime Reports (UCR) 2022 — violent &amp; property crime rates per 100,000 population, by state and major city
                </a>
              </li>
              <li>
                <a href="https://api.weather.gov" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
                  NOAA National Weather Service — api.weather.gov (no key required)
                </a>
              </li>
              <li>
                <a href="https://www.fema.gov/api" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
                  FEMA Disaster Declarations — fema.gov/api (no key required)
                </a>
              </li>
              <li>
                <a href="https://data.hrsa.gov" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
                  HRSA — Health Resources and Services Administration (trauma center dataset)
                </a>
              </li>
              <li>
                <a href="https://offender.fdle.state.fl.us" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
                  Florida Department of Law Enforcement — offender.fdle.state.fl.us
                </a>
              </li>
              <li>
                <a href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
                  USGS Earthquake Hazards Program — significant_week GeoJSON feed (no key required)
                </a>
              </li>
              <li>
                <a href="https://firms.modaps.eosdis.nasa.gov" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
                  NASA FIRMS Fire Information for Resource Management System — MODIS C6.1 Global 24h active fire (no key required)
                </a>
              </li>
              <li>
                <a href="https://www.nhc.noaa.gov" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
                  NOAA National Hurricane Center — Atlantic active storm RSS (nhc.noaa.gov)
                </a>
              </li>
              <li>
                <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
                  OpenStreetMap contributors & CARTO (map tiles)
                </a>
              </li>
              <li>
                <a href="https://www.fbi.gov" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
                  FBI — Federal Bureau of Investigation (Top Stories RSS, no key required)
                </a>
              </li>
              <li>
                <a href="https://acleddata.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
                  ACLED — Armed Conflict Location and Event Data Project (US political violence; free non-commercial key required)
                </a>
              </li>
              <li>
                <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
                  US Department of State — Travel Advisories RSS (travel.state.gov, no key required)
                </a>
              </li>
              <li>
                <a href="https://www.cisa.gov" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
                  CISA — Cybersecurity and Infrastructure Security Agency (advisories RSS, no key required)
                </a>
              </li>
              <li>
                <a href="https://ornl.opendatasoft.com/explore/dataset/odin-real-time-outages-county" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
                  ODIN — Outage Data Initiative Nationwide, Oak Ridge National Laboratory / US Department of Energy Office of Electricity (no key required)
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Layout>
    </>
  );
}
