import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Axe, Droplets, ShoppingCart, Zap,
  AlertCircle, Wind, Waves, Mountain, Shield, Play, Info, Radio,
  Download, ChevronDown
} from "lucide-react";

type Priority = "essential" | "recommended" | "optional";

interface GearItem {
  name: string;
  note: string;
  howTo?: string;
  qty?: string;
  cost?: string;
  link: string;
  priority: Priority;
  source?: string;
  homedepotUrl?: string;
  lowesUrl?: string;
  walmartUrl?: string;
  brandUrl?: string;
  reiUrl?: string;
  targetUrl?: string;
  bestbuyUrl?: string;
  walmartGroceryUrl?: string;
}

function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === "essential") return <Badge className="bg-red-900/60 text-red-300 border-red-800/60 text-[10px]">Essential</Badge>;
  if (priority === "recommended") return <Badge className="bg-yellow-900/60 text-yellow-300 border-yellow-800/60 text-[10px]">Recommended</Badge>;
  return <Badge className="bg-gray-800 text-gray-400 border-gray-700 text-[10px]">Optional</Badge>;
}

function SectionVideo({ videoId, sectionId }: { videoId?: string; sectionId: string }) {
  return (
    <div className="mb-2">
      <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
        {videoId ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={`${sectionId} preparedness video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 0 }}
            data-testid={`video-${sectionId}`}
          />
        ) : (
          <div className="absolute inset-0 bg-black/40 border border-border rounded-lg flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
              <Play className="w-5 h-5 text-white/30 ml-0.5" />
            </div>
            <p className="text-white/30 text-sm">Video coming soon</p>
          </div>
        )}
      </div>
      <a
        href={`/preparedness/prepping/videos#${sectionId}`}
        className="group block w-full mt-4 mb-6 border border-orange-900/40 bg-orange-900/10 rounded-md p-5 text-center hover-elevate active-elevate-2 transition-colors"
        data-testid={`button-more-videos-${sectionId}`}
      >
        <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">Video Resources</p>
        <p className="text-white font-bold text-base">Learn More About This Section</p>
        <p className="text-gray-400 text-xs mt-1">Browse curated preparedness videos for this topic</p>
        <div className="mt-3 flex items-center justify-center gap-2 text-orange-400 text-sm font-semibold">
          <Play className="w-4 h-4" />
          View Videos
        </div>
      </a>
    </div>
  );
}

const CF_MOTTO = "We are ready. We are watching. We are hiding in plain sight. We are Concealed Florida.";
const CF_FOOTER = `${CF_MOTTO}\n\n— CONCEALED FLORIDA — ConcealedFlorida.com | Template Version 1.0 | Reviewed against FEMA CPG-101`;

function downloadGearTxt(items: GearItem[], title: string) {
  const lines = [
    `CONCEALED FLORIDA — ${title.toUpperCase()}`,
    `Generated: ${new Date().toLocaleDateString()}`,
    ``,
    ...items.map((item) => [
      `[ ] ${item.name}${item.qty ? ` (${item.qty})` : ""}${item.cost ? ` — ${item.cost}` : ""}`,
      `    Priority: ${item.priority}`,
      item.note ? `    Note: ${item.note}` : "",
      item.howTo ? `    How to use: ${item.howTo}` : "",
    ].filter(Boolean).join("\n")),
    ``,
    `—————————————————`,
    CF_FOOTER,
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `CF-${title.replace(/\s+/g, "-")}.txt`; a.click();
  URL.revokeObjectURL(url);
}

function downloadGearWord(items: GearItem[], title: string) {
  const rows = items.map((item) => `
    <tr>
      <td style="border:1px solid #ccc;padding:6px">☐</td>
      <td style="border:1px solid #ccc;padding:6px"><strong>${item.name}</strong>${item.qty ? ` (${item.qty})` : ""}${item.cost ? ` — ${item.cost}` : ""}</td>
      <td style="border:1px solid #ccc;padding:6px">${item.priority}</td>
      <td style="border:1px solid #ccc;padding:6px">${item.note}</td>
    </tr>`).join("");
  const html = `<html><head><meta charset="UTF-8"><title>CONCEALED FLORIDA — ${title}</title></head><body>
    <h1>CONCEALED FLORIDA — ${title}</h1>
    <p>Generated: ${new Date().toLocaleDateString()}</p>
    <table style="border-collapse:collapse;width:100%">
      <thead><tr style="background:#eee">
        <th style="border:1px solid #ccc;padding:6px">#</th>
        <th style="border:1px solid #ccc;padding:6px">Item</th>
        <th style="border:1px solid #ccc;padding:6px">Priority</th>
        <th style="border:1px solid #ccc;padding:6px">Notes</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <br/><hr/><p>${CF_FOOTER}</p>
  </body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `CF-${title.replace(/\s+/g, "-")}.doc`; a.click();
  URL.revokeObjectURL(url);
}

function downloadGearCsv(items: GearItem[], title: string) {
  const esc = (s?: string) => `"${(s || "").replace(/"/g, '""')}"`;
  const header = `Item,Qty,Cost,Priority,Notes,How To Use`;
  const rows = items.map((item) => [esc(item.name), esc(item.qty), esc(item.cost), esc(item.priority), esc(item.note), esc(item.howTo)].join(","));
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `CF-${title.replace(/\s+/g, "-")}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function downloadGearPdf(items: GearItem[], title: string) {
  const rows = items.map((item) => `<tr><td style="border:1px solid #ccc;padding:5px">☐</td><td style="border:1px solid #ccc;padding:5px"><strong>${item.name}</strong>${item.qty ? ` (${item.qty})` : ""}${item.cost ? ` — ${item.cost}` : ""}</td><td style="border:1px solid #ccc;padding:5px">${item.priority}</td><td style="border:1px solid #ccc;padding:5px">${item.note}</td></tr>`).join("");
  const html = `<html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;font-size:11px;margin:20px}h1{font-size:16px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:5px;text-align:left}th{background:#f0f0f0}footer{margin-top:20px;font-size:9px;color:#555;border-top:1px solid #ccc;padding-top:8px}</style></head><body>
    <h1>CONCEALED FLORIDA — ${title}</h1>
    <p>Generated: ${new Date().toLocaleDateString()}</p>
    <table><thead><tr><th>#</th><th>Item</th><th>Priority</th><th>Notes</th></tr></thead><tbody>${rows}</tbody></table>
    <footer>${CF_FOOTER}</footer>
  </body></html>`;
  const w = window.open("", "_blank");
  if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 400); }
}

function GearDownloadMenu({ items, title, label = "Download Checklist" }: { items: GearItem[]; title: string; label?: string }) {
  return (
    <div className="relative group inline-block" data-testid={`download-menu-${title.toLowerCase().replace(/\s+/g, "-").slice(0, 20)}`}>
      <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
        <Download className="w-3.5 h-3.5" />
        {label}
        <ChevronDown className="w-3 h-3" />
      </Button>
      <div className="absolute right-0 mt-1 w-48 rounded-md border border-border bg-background shadow-md z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-150">
        <button onClick={() => downloadGearTxt(items, title)} className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-t-md">TXT Checklist</button>
        <button onClick={() => downloadGearWord(items, title)} className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary">Word Document (.doc)</button>
        <button onClick={() => downloadGearCsv(items, title)} className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary">Excel / CSV</button>
        <button onClick={() => downloadGearPdf(items, title)} className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-b-md">Print / PDF</button>
      </div>
    </div>
  );
}

function GearCard({ item }: { item: GearItem }) {
  const hasStores = item.link || item.homedepotUrl || item.lowesUrl || item.walmartUrl || item.brandUrl || item.reiUrl || item.targetUrl || item.bestbuyUrl;
  return (
    <Card className="bg-secondary border-secondary" data-testid={`card-gear-${item.name.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}`}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-white font-semibold text-sm">{item.name}</p>
              <PriorityBadge priority={item.priority} />
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">{item.note}</p>
          </div>
        </div>
        {(item.qty || item.cost) && (
          <div className="flex gap-4 mt-1 flex-wrap">
            {item.qty && <p className="text-gray-400 text-xs">Qty: {item.qty}</p>}
            {item.cost && <p className="text-green-400 text-xs font-medium">{item.cost}</p>}
          </div>
        )}
        {item.howTo && (
          <div className="mt-3 pt-3 border-t border-gray-800">
            <div className="flex items-start gap-2">
              <Info className="w-3 h-3 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-gray-300 text-xs leading-relaxed"><span className="text-yellow-400 font-semibold">How to use: </span>{item.howTo}</p>
            </div>
          </div>
        )}
        {item.source && (
          <p className="text-gray-500 text-xs mt-2 italic">{item.source}</p>
        )}
        {hasStores && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-800">
            {item.brandUrl && (
              <Button variant="secondary" size="sm" asChild>
                <a href={item.brandUrl} target="_blank" rel="noopener noreferrer">Brand Site</a>
              </Button>
            )}
            {item.link && (
              <Button variant="secondary" size="sm" asChild>
                <a href={item.link} target="_blank" rel="noopener noreferrer">Amazon</a>
              </Button>
            )}
            {item.homedepotUrl && (
              <Button variant="secondary" size="sm" asChild>
                <a href={item.homedepotUrl} target="_blank" rel="noopener noreferrer">Home Depot</a>
              </Button>
            )}
            {item.lowesUrl && (
              <Button variant="secondary" size="sm" asChild>
                <a href={item.lowesUrl} target="_blank" rel="noopener noreferrer">Lowe's</a>
              </Button>
            )}
            {item.walmartUrl && (
              <Button variant="secondary" size="sm" asChild>
                <a href={item.walmartUrl} target="_blank" rel="noopener noreferrer">Walmart</a>
              </Button>
            )}
            {item.targetUrl && (
              <Button variant="secondary" size="sm" asChild>
                <a href={item.targetUrl} target="_blank" rel="noopener noreferrer">Target</a>
              </Button>
            )}
            {item.reiUrl && (
              <Button variant="secondary" size="sm" asChild>
                <a href={item.reiUrl} target="_blank" rel="noopener noreferrer">REI</a>
              </Button>
            )}
            {item.bestbuyUrl && (
              <Button variant="secondary" size="sm" asChild>
                <a href={item.bestbuyUrl} target="_blank" rel="noopener noreferrer">Best Buy</a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const toolItems: GearItem[] = [
  {
    name: "Fiskars X27 Super Splitting Axe",
    note: "36\" handle, ideal for splitting firewood and clearing fallen limbs. Fiberglass handle will not crack or splinter like wood.",
    howTo: "Wide stance, let the axe head do the work — don't muscle it. Keep blade sharp. Clear the area behind you before swinging. Store with blade guard.",
    link: "https://www.amazon.com/s?k=fiskars+x27+splitting+axe",
    homedepotUrl: "https://www.homedepot.com/s/fiskars%20x27%20splitting%20axe",
    lowesUrl: "https://www.lowes.com/search?searchTerm=fiskars+x27+splitting+axe",
    priority: "essential",
    source: "FEMA Individual and Community Preparedness — debris clearing is a primary post-hurricane recovery need",
  },
  {
    name: "Leatherman Wave+ Multi-Tool",
    note: "25 tools: pliers, wire cutters, saw, file, scissors, multiple blades. One of the highest-rated multi-tools for reliability.",
    howTo: "Practice deploying each tool before you need it. Oil joints lightly with 3-in-1 oil every 6 months. Keep on your person or in your go-bag.",
    link: "https://www.amazon.com/s?k=leatherman+wave+plus+multi+tool",
    brandUrl: "https://www.leatherman.com/wave-plus.html",
    reiUrl: "https://www.rei.com/search?q=leatherman+wave+plus",
    walmartUrl: "https://www.walmart.com/search?q=leatherman+wave+plus+multi+tool",
    priority: "essential",
  },
  {
    name: "Husqvarna 135 Chainsaw",
    note: "16\" bar, gas-powered. Essential after any hurricane or major storm for clearing road obstructions and debris from structures.",
    howTo: "Wear chainsaw chaps, gloves, eye and ear protection always. Check chain tension before use. Keep chain sharp and bar oiled. Store stabilized fuel. Never cut above shoulder height.",
    link: "https://www.amazon.com/s?k=husqvarna+135+chainsaw",
    homedepotUrl: "https://www.homedepot.com/s/husqvarna%20135%20chainsaw",
    lowesUrl: "https://www.lowes.com/search?searchTerm=husqvarna+135+chainsaw",
    priority: "recommended",
    source: "FEMA After-Action Reports: downed trees are the primary access barrier after hurricanes",
  },
  {
    name: "Stanley FatMax Utility Bar (Pry Bar)",
    note: "For demolition, door breaching, debris removal, and structural rescue. One of the most useful tools post-disaster.",
    howTo: "Use flat end for prying, curved end for pulling nails. Always wear gloves. Inspect before use for cracks.",
    link: "https://www.amazon.com/s?k=stanley+fatmax+utility+bar",
    homedepotUrl: "https://www.homedepot.com/s/stanley%20fatmax%20utility%20bar",
    lowesUrl: "https://www.lowes.com/search?searchTerm=stanley+fatmax+pry+bar",
    priority: "essential",
  },
  {
    name: "Pipe Wrench — 14\" Minimum",
    note: "Required to shut off natural gas at the meter after earthquakes, floods, or structural damage. Every home with gas must have this accessible.",
    howTo: "Know where your gas meter shutoff is BEFORE any emergency. Valve turns 90° to close. Tag the shutoff location. Only utility company should restore gas once shut off.",
    link: "https://www.amazon.com/s?k=pipe+wrench+14+inch",
    homedepotUrl: "https://www.homedepot.com/s/pipe%20wrench%2014%20inch",
    lowesUrl: "https://www.lowes.com/search?searchTerm=pipe+wrench+14+inch",
    priority: "essential",
    source: "Gas shutoff training: Red Cross and FEMA earthquake and flood preparedness standards",
  },
  {
    name: "550 Paracord — 100ft",
    note: "Rated to 550 lb. Structural ties, shelter rigging, clothesline, tow assist, item lashing, and improvised repairs.",
    howTo: "Learn cleat hitch, square knot, and bowline before you need them. Keep coiled in labeled bag in go-bag.",
    link: "https://www.amazon.com/s?k=550+paracord+100ft",
    homedepotUrl: "https://www.homedepot.com/s/550%20paracord%20100ft",
    lowesUrl: "https://www.lowes.com/search?searchTerm=paracord+550lb+100ft",
    priority: "essential",
  },
  {
    name: "Heavy-Duty Tarps — 12x16 Minimum, 3+",
    note: "Blue tarps are the most common post-hurricane repair material. Roof tarping prevents interior water damage after shingle loss.",
    howTo: "Pre-cut paracord ties and store with tarps. Work from bottom up, overlap 12\" at edges, secure to ridge line. Never work on a wet roof alone.",
    link: "https://www.amazon.com/s?k=heavy+duty+tarp+12x16",
    homedepotUrl: "https://www.homedepot.com/s/heavy%20duty%20tarp%2012x16",
    lowesUrl: "https://www.lowes.com/search?searchTerm=heavy+duty+tarp+12x16",
    priority: "essential",
  },
  {
    name: "Work Gloves — Leather, Cut-Resistant",
    note: "Non-negotiable for chainsaw work, debris clearing, and glass or metal handling after any structural event.",
    howTo: "Inspect before each use. Replace when palm material wears through. Keep one pair in go-bag and one in vehicle.",
    link: "https://www.amazon.com/s?k=cut+resistant+leather+work+gloves",
    homedepotUrl: "https://www.homedepot.com/s/cut%20resistant%20leather%20work%20gloves",
    lowesUrl: "https://www.lowes.com/search?searchTerm=cut+resistant+leather+work+gloves",
    priority: "essential",
  },
  {
    name: "N95 Respirator Masks — 25-pack",
    note: "Post-hurricane mold, post-flood sewage contamination, and wildfire smoke all require respiratory protection. Surgical masks do not filter particulates.",
    howTo: "Pinch metal nose piece, pull straps over head, press to seal. Exhale sharply — you should feel resistance. Replace if wet or damaged.",
    link: "https://www.amazon.com/s?k=n95+respirator+mask+25+pack",
    homedepotUrl: "https://www.homedepot.com/s/n95%20respirator%20mask%2025%20pack",
    lowesUrl: "https://www.lowes.com/search?searchTerm=n95+respirator+mask+25+pack",
    priority: "essential",
    source: "CDC and OSHA: N95 is minimum respiratory protection standard for post-flood mold remediation",
  },
  {
    name: "Duct Tape (Gorilla Brand) — 3 Rolls",
    note: "Emergency structural repairs, window sealing, gear improvisation, and water diversion. Highest utility-per-dollar item in preparedness.",
    link: "https://www.amazon.com/s?k=gorilla+duct+tape",
    homedepotUrl: "https://www.homedepot.com/s/gorilla+duct+tape",
    lowesUrl: "https://www.lowes.com/search?searchTerm=gorilla+duct+tape",
    priority: "essential",
  },
  {
    name: "Safety Goggles — ANSI Z87.1",
    note: "For chainsaw work, debris removal, and any grinding or demolition task. Z87.1 is the minimum standard for impact protection.",
    howTo: "Inspect lenses for scratches that reduce clarity. Anti-fog models are worth the extra cost.",
    link: "https://www.amazon.com/s?k=safety+goggles+ansi+z87",
    homedepotUrl: "https://www.homedepot.com/s/safety+goggles+ansi+z87",
    lowesUrl: "https://www.lowes.com/search?searchTerm=safety+goggles+ansi+z87",
    priority: "essential",
  },
  {
    name: "Shovel — Heavy-Duty Spade",
    note: "Flood water diversion, debris burial, and latrine digging in extended grid-down scenarios.",
    link: "https://www.amazon.com/s?k=heavy+duty+spade+shovel",
    homedepotUrl: "https://www.homedepot.com/s/heavy+duty+spade+shovel",
    lowesUrl: "https://www.lowes.com/search?searchTerm=heavy+duty+spade+shovel",
    priority: "recommended",
  },
  {
    name: "Come-Along Hand Winch — 2-Ton",
    note: "Mechanical advantage for moving heavy debris, freeing stuck vehicles, and structural recovery. No electricity required.",
    howTo: "Anchor to a solid structure. Inspect cable for fraying before each use. Keep tension even.",
    link: "https://www.amazon.com/s?k=come+along+hand+winch+2+ton",
    homedepotUrl: "https://www.homedepot.com/s/come+along+hand+winch+2+ton",
    lowesUrl: "https://www.lowes.com/search?searchTerm=come+along+hand+winch+2+ton",
    priority: "optional",
  },
];

const waterItems: GearItem[] = [
  {
    name: "WaterBOB Emergency Bathtub Bladder",
    note: "100-gallon storage — fills any standard bathtub. Keeps water clean for up to 4 weeks. Deploy 24 hours before expected storm impact.",
    howTo: "Lay bladder in tub before filling. Connect fill sleeve to faucet. Do not let bladder contact drain. Store pump with bladder for retrieval.",
    qty: "1–2 units",
    link: "https://www.amazon.com/s?k=waterBOB+bathtub+water+storage",
    brandUrl: "https://www.waterbob.com",
    walmartUrl: "https://www.walmart.com/search?q=waterBOB+bathtub+water+storage",
    priority: "essential",
    source: "FEMA recommends bathtub water storage as an essential pre-storm action",
  },
  {
    name: "5-Gallon Jerry Cans — BPA-Free, Stackable",
    note: "Portable storable water. 4 cans = 20 gallons per person for 10 days at FEMA's 2 gal/day recommendation.",
    howTo: "Fill with tap water + 1/8 tsp unscented bleach per gallon. Rotate every 6 months. Label with fill date.",
    qty: "4–8 cans minimum",
    link: "https://www.amazon.com/s?k=5+gallon+water+jerry+can+bpa+free",
    homedepotUrl: "https://www.homedepot.com/s/5+gallon+water+can+bpa+free",
    walmartUrl: "https://www.walmart.com/search?q=5+gallon+water+jerry+can+bpa+free",
    priority: "essential",
    source: "FEMA: 1 gallon/person/day minimum; 2 gallons in hot climates like Florida",
  },
  {
    name: "LifeStraw Personal Filter",
    note: "Filters 1,000 gallons. Removes 99.9999% of bacteria and parasites. No batteries, no pumping. One per person in every go-bag.",
    howTo: "Do not allow filter to freeze — destroys the membrane. After use, blow out remaining water and let dry. Does not filter salt water or chemical contamination.",
    qty: "1 per person",
    link: "https://www.amazon.com/s?k=lifestraw+personal+water+filter",
    brandUrl: "https://www.lifestraw.com/products/lifestraw",
    reiUrl: "https://www.rei.com/search?q=lifestraw+personal+filter",
    targetUrl: "https://www.target.com/s?searchTerm=lifestraw+personal+water+filter",
    walmartUrl: "https://www.walmart.com/search?q=lifestraw+personal+water+filter",
    priority: "essential",
    source: "NSF/ANSI 42 and 53 certified. EPA guide-compliant for microbiological treatment",
  },
  {
    name: "Sawyer Squeeze Water Filter",
    note: "Filters 100,000 gallons — a lifetime supply. Backflushes for indefinite use. Better for family use than individual straw filters.",
    howTo: "Squeeze pouch through filter into clean container. Backflush with included syringe after each use. Never freeze. Replace if flow rate drops significantly after backflushing.",
    qty: "1–2 units",
    link: "https://www.amazon.com/s?k=sawyer+squeeze+water+filter",
    brandUrl: "https://www.sawyer.com/water-filtration",
    reiUrl: "https://www.rei.com/search?q=sawyer+squeeze+water+filter",
    walmartUrl: "https://www.walmart.com/search?q=sawyer+squeeze+water+filter",
    priority: "essential",
  },
  {
    name: "Aquatabs Water Purification Tablets",
    note: "50 tablets per pack. 1 tablet treats 1 liter. Kills bacteria and viruses. Compact backup for when filters are unavailable.",
    howTo: "Drop tablet in water, wait 30 minutes before drinking (60 minutes in cold or cloudy water). Pre-filter cloudy water through cloth first.",
    qty: "4+ packs",
    link: "https://www.amazon.com/s?k=aquatabs+water+purification+tablets",
    walmartUrl: "https://www.walmart.com/search?q=aquatabs+water+purification+tablets",
    reiUrl: "https://www.rei.com/search?q=water+purification+tablets",
    priority: "essential",
  },
  {
    name: "55-Gallon Water Storage Drum",
    note: "Long-term stationary storage. Treat with Water Preserver Concentrate for up to 5-year storage.",
    howTo: "Use food-grade barrels only. Store on wood pallet. Requires bung wrench, manual pump, and fill tube. Place in cool, dark location.",
    qty: "1–4 drums",
    link: "https://www.amazon.com/s?k=55+gallon+water+barrel+bpa+free+food+grade",
    homedepotUrl: "https://www.homedepot.com/s/55+gallon+food+grade+barrel",
    walmartUrl: "https://www.walmart.com/search?q=55+gallon+water+storage+drum+food+grade",
    priority: "recommended",
  },
  {
    name: "Berkey Countertop Gravity Filter",
    note: "No electricity. Filters up to 6,000 gallons per element. Handles bacteria, viruses, heavy metals, and most chemicals.",
    howTo: "Prime black elements with water before first use. Run 2 liters through and discard. Scrub elements monthly. Replace every 6,000 gallons.",
    qty: "1 unit",
    link: "https://www.amazon.com/s?k=berkey+water+filter+countertop",
    brandUrl: "https://www.berkeyfilters.com",
    priority: "recommended",
  },
  {
    name: "Water Preserver Concentrate",
    note: "EPA-registered. Treats stored water for up to 5 years. Add to any stored container — cans, drums, tanks.",
    qty: "2 bottles",
    link: "https://www.amazon.com/s?k=water+preserver+concentrate",
    homedepotUrl: "https://www.homedepot.com/s/water+preserver+concentrate",
    walmartUrl: "https://www.walmart.com/search?q=water+preserver+concentrate+emergency",
    priority: "recommended",
  },
];

const foodItems: GearItem[] = [
  {
    name: "4Patriots 4-Week Emergency Food Kit",
    note: "Up to 2,000 cal/day. 25-year shelf life. Freeze-dried. All meals included — no separate grocery list.",
    howTo: "Store in cool, dark location. Add just-boiled water to each pouch and wait specified time. Most pouches serve 1–2 people.",
    qty: "1 per person per month",
    cost: "$147–$440",
    link: "https://www.amazon.com/s?k=4patriots+emergency+food+kit",
    brandUrl: "https://4patriots.com",
    priority: "essential",
    source: "FEMA: minimum 3-day supply; preparedness professionals target 30 days minimum",
  },
  {
    name: "Mountain House Freeze-Dried Meals",
    note: "30-year shelf life. Individual serving pouches. Add boiling water — eat directly from the pouch. Excellent variety.",
    howTo: "Heat water before opening pouch. Seal and shake, wait listed time. Cold-soaked if no heat — wait longer.",
    qty: "10 servings per person per week",
    cost: "$8–$12 per meal",
    link: "https://www.amazon.com/s?k=mountain+house+freeze+dried+meals",
    brandUrl: "https://www.mountainhouse.com",
    reiUrl: "https://www.rei.com/search?q=mountain+house+freeze+dried+meals",
    walmartUrl: "https://www.walmart.com/search?q=mountain+house+freeze+dried+meals",
    priority: "essential",
  },
  {
    name: "XMRE MRE Cases — Military Grade",
    note: "Flameless ration heater included. No water or cooking required. 1,250–1,400 cal per meal. Shelf-stable 5+ years.",
    howTo: "Add 2 oz of water to heating bag, insert food pouch, fold over, lay flat for 12 minutes. Keep out of vehicles in Florida heat — degrades quality.",
    qty: "2 cases per person per month",
    cost: "$80–$120 per 12-pack",
    link: "https://www.amazon.com/s?k=XMRE+MRE+case+of+12",
    brandUrl: "https://www.xmre.com",
    walmartUrl: "https://www.walmart.com/search?q=mre+meals+ready+to+eat+case",
    priority: "essential",
    source: "USDA approved. Designed to sustain 2,400+ cal/day under field conditions",
  },
  {
    name: "Canned Goods Rotation System",
    note: "Cheapest, most reliable food storage. Priority items: beans (protein), tuna, soup, vegetables, fruit, peanut butter.",
    howTo: "FIFO rotation — First In, First Out. Mark every can with purchase date. Check for bulging, dents at seams, or rust before eating.",
    qty: "90-day supply per person",
    cost: "$0.80–$2.50 per can",
    link: "https://www.amazon.com/s?k=canned+goods+variety+emergency+food",
    walmartUrl: "https://www.walmart.com/search?q=canned+goods+variety+beans+tuna+soup",
    targetUrl: "https://www.target.com/s?searchTerm=canned+goods+variety+emergency+food",
    priority: "essential",
    source: "CDC and FEMA: canned goods are the foundation of any emergency food supply — cost, shelf life, and no preparation required",
  },
  {
    name: "Manual Can Opener — 2 Minimum",
    note: "Cannot open canned food without one. Keep one in go-bag and one in emergency kitchen kit. Openers fail — have a backup.",
    cost: "$5–$15",
    link: "https://www.amazon.com/s?k=manual+can+opener+heavy+duty",
    walmartUrl: "https://www.walmart.com/search?q=manual+can+opener+heavy+duty",
    targetUrl: "https://www.target.com/s?searchTerm=manual+can+opener",
    priority: "essential",
  },
  {
    name: "Camp Stove + Propane Fuel Canisters",
    note: "For cooking when power is out. Coleman 2-burner or MSR PocketRocket are reliable options.",
    howTo: "NEVER use indoors — carbon monoxide hazard. Use on stable surface outdoors. Keep fuel away from heat. Check O-rings annually.",
    qty: "1 stove + 10 fuel canisters",
    cost: "$30–$80",
    link: "https://www.amazon.com/s?k=camping+stove+propane+2+burner",
    homedepotUrl: "https://www.homedepot.com/s/propane+camp+stove+2+burner",
    walmartUrl: "https://www.walmart.com/search?q=camp+stove+propane+2+burner",
    reiUrl: "https://www.rei.com/search?q=camp+stove+propane",
    priority: "recommended",
  },
  {
    name: "Augason Farms White Rice — 45 lb Pail",
    note: "100+ year shelf life sealed. ~$45. Calorie-dense, shelf-stable. Pair with canned beans for complete protein.",
    howTo: "Store sealed in cool, dry location. Once opened, store remainder in airtight food-grade container with oxygen absorber.",
    qty: "1 pail per person per month",
    cost: "~$45",
    link: "https://www.amazon.com/s?k=white+rice+45+lb+pail+emergency",
    walmartUrl: "https://www.walmart.com/search?q=augason+farms+white+rice+45+lb+pail",
    brandUrl: "https://augasonfarms.com",
    priority: "recommended",
  },
  {
    name: "Vitamins & Electrolytes",
    note: "Stress, heat, and physical labor deplete micronutrients rapidly. Multivitamins + electrolyte packets (LMNT) are essential for extended scenarios.",
    qty: "90-day supply",
    cost: "$30–$60",
    link: "https://www.amazon.com/s?k=multivitamin+electrolyte+packets+emergency",
    walmartUrl: "https://www.walmart.com/search?q=multivitamin+electrolyte+packets",
    targetUrl: "https://www.target.com/s?searchTerm=multivitamin+electrolyte+packets",
    priority: "recommended",
  },
];

const foodStandards = [
  { period: "72 Hours (FEMA Minimum)", cost: "$50–$100", calories: "~6,000 cal", bg: "bg-red-900/20 border-red-800/40", note: "Absolute minimum. Covers most localized emergencies." },
  { period: "30 Days", cost: "$150–$400", calories: "~60,000 cal", bg: "bg-yellow-900/20 border-yellow-800/40", note: "Standard target for hurricane season preparedness." },
  { period: "90 Days", cost: "$500–$1,200", calories: "~180,000 cal", bg: "bg-green-900/20 border-green-800/40", note: "Grid-down and supply chain disruption coverage." },
  { period: "1 Year", cost: "$1,800–$5,000", calories: "~700,000 cal", bg: "bg-purple-900/20 border-purple-800/40", note: "Long-term self-reliance. Requires dedicated dry storage." },
];

const powerItems: GearItem[] = [
  {
    name: "Honda EU2200i Portable Inverter Generator",
    note: "2,200W continuous, 2,500W peak. Ultra-quiet (48–57 dB). 8.1-hr runtime at 25% load on 1 gallon. Parallel-capable.",
    howTo: "NEVER run indoors or in garage — carbon monoxide kills. Place 20+ feet from windows, downwind. Use CO detector. Change oil at 20 hours for new units.",
    cost: "~$1,100",
    link: "https://www.amazon.com/s?k=honda+eu2200i+generator",
    brandUrl: "https://powerequipment.honda.com/generators/models/eu2200i",
    homedepotUrl: "https://www.homedepot.com/s/honda+eu2200i+generator",
    lowesUrl: "https://www.lowes.com/search?searchTerm=honda+eu2200i+generator",
    priority: "essential",
    source: "ARRL-recommended generator for emergency communications — minimal radio frequency interference",
  },
  {
    name: "Jackery Explorer 1000 + SolarSaga 100W Panel",
    note: "1,002Wh capacity. Recharges via solar (17 hrs), wall (7 hrs), or car (12 hrs). Silent. Runs fans, CPAP, mini-fridge, phones, and radios.",
    howTo: "Place solar panels in direct, unobstructed sunlight facing south. Do not leave unit in extreme heat. Run down to 20% before storage.",
    cost: "~$1,000",
    link: "https://www.amazon.com/s?k=jackery+explorer+1000+solar+generator",
    brandUrl: "https://www.jackery.com/products/explorer-1000-portable-power-station",
    bestbuyUrl: "https://www.bestbuy.com/site/searchpage.jsp?st=jackery+explorer+1000",
    walmartUrl: "https://www.walmart.com/search?q=jackery+explorer+1000+solar+generator",
    priority: "recommended",
  },
  {
    name: "Goal Zero Yeti 1500X Portable Power Station",
    note: "1,516Wh capacity. Multiple AC/USB/12V outputs. Pairs with Nomad or Boulder solar panels. WiFi monitoring.",
    howTo: "Keep above 20% charge in storage. Recondition battery monthly. Store in cool environment — not in a hot garage.",
    cost: "~$2,000",
    link: "https://www.amazon.com/s?k=goal+zero+yeti+1500x+power+station",
    brandUrl: "https://www.goalzero.com/collections/yeti-portable-power-stations",
    bestbuyUrl: "https://www.bestbuy.com/site/searchpage.jsp?st=goal+zero+yeti+1500x",
    reiUrl: "https://www.rei.com/search?q=goal+zero+yeti+1500x",
    priority: "optional",
  },
  {
    name: "Sta-Bil Fuel Stabilizer",
    note: "Extends gasoline shelf life from 3 months to 12 months. Add 1 oz per 2.5 gallons at every fill.",
    howTo: "Add stabilizer at fill-up, not just before storage. Run engine long enough to circulate treated fuel into carburetor. Label fuel cans with treat date.",
    cost: "~$10",
    link: "https://www.amazon.com/s?k=sta-bil+360+fuel+stabilizer",
    homedepotUrl: "https://www.homedepot.com/s/sta-bil+fuel+stabilizer",
    lowesUrl: "https://www.lowes.com/search?searchTerm=sta-bil+fuel+stabilizer",
    walmartUrl: "https://www.walmart.com/search?q=sta-bil+fuel+stabilizer",
    priority: "essential",
  },
  {
    name: "Anker PowerCore 26800 — Power Bank",
    note: "26,800mAh. Charges 3 devices simultaneously. Charges an iPhone ~8 times per full charge. Keep in go-bag.",
    howTo: "Charge to 80% for storage (not 100%). Recharge and discharge every 3 months to maintain cell health.",
    cost: "~$50",
    link: "https://www.amazon.com/s?k=anker+powercore+26800+power+bank",
    brandUrl: "https://www.anker.com/collections/all-power-banks",
    walmartUrl: "https://www.walmart.com/search?q=anker+powercore+26800+power+bank",
    targetUrl: "https://www.target.com/s?searchTerm=anker+powercore+power+bank",
    bestbuyUrl: "https://www.bestbuy.com/site/searchpage.jsp?st=anker+powercore+26800",
    priority: "essential",
  },
  {
    name: "Headlamp — Petzl or Black Diamond, 300+ Lumens",
    note: "Hands-free lighting for debris clearing, first aid, and night navigation. One per person in the household.",
    howTo: "Use red-light mode to preserve night vision and battery. Replace batteries before each hurricane season. Keep in nightstand drawer — not in a storage bin.",
    cost: "$25–$60",
    link: "https://www.amazon.com/s?k=petzl+headlamp+300+lumens",
    homedepotUrl: "https://www.homedepot.com/s/petzl+headlamp+300+lumens",
    lowesUrl: "https://www.lowes.com/search?searchTerm=headlamp+300+lumens",
    reiUrl: "https://www.rei.com/search?q=petzl+headlamp+300+lumens",
    walmartUrl: "https://www.walmart.com/search?q=headlamp+300+lumens+petzl",
    priority: "essential",
  },
  {
    name: "Propane or Kerosene Lantern",
    note: "Silent, no-battery light source. A 1-lb propane cylinder powers most lanterns for 5–6 hours. Keep multiple cylinders.",
    howTo: "Use only in ventilated areas. Never leave lit and unattended. Keep away from flammable materials. Inspect mantles before each use.",
    cost: "$20–$50",
    link: "https://www.amazon.com/s?k=propane+camping+lantern",
    homedepotUrl: "https://www.homedepot.com/s/propane+camping+lantern",
    lowesUrl: "https://www.lowes.com/search?searchTerm=propane+camping+lantern",
    walmartUrl: "https://www.walmart.com/search?q=propane+camping+lantern",
    reiUrl: "https://www.rei.com/search?q=propane+lantern+camping",
    priority: "recommended",
  },
  {
    name: "Faraday Cage / EMP Protection Bags",
    note: "Military-spec RF shielding for radios, power banks, and electronics. Store backup devices inside for EMP or CME protection.",
    howTo: "Double-bag critical electronics. Seal edges completely. Test: cell phone inside cannot receive a call = bag is working. Store in metal container for added protection.",
    cost: "$20–$60",
    link: "https://www.amazon.com/s?k=faraday+bag+emp+protection+military",
    walmartUrl: "https://www.walmart.com/search?q=faraday+bag+emp+protection",
    priority: "optional",
  },
];

const commsItems: GearItem[] = [
  {
    name: "Midland ER310 Emergency Crank Radio",
    note: "NOAA/AM/FM weather alerts. Solar panel, hand-crank, and battery power. USB port charges phones. Flashlight and SOS alarm built in.",
    howTo: "Program NOAA SAME codes for your county — it will alarm automatically on local emergency broadcasts. Test monthly. Keep batteries fresh.",
    cost: "~$50",
    link: "https://www.amazon.com/s?k=midland+er310+emergency+radio",
    brandUrl: "https://www.midlandusa.com/product/er310",
    walmartUrl: "https://www.walmart.com/search?q=midland+er310+emergency+crank+radio",
    targetUrl: "https://www.target.com/s?searchTerm=midland+er310+emergency+radio",
    priority: "essential",
    source: "FEMA and Red Cross: NOAA-capable radio is one of the top 5 most essential emergency preparedness items",
  },
  {
    name: "BaoFeng UV-5R Dual-Band Ham Radio",
    note: "Transmits VHF (144–148 MHz) and UHF (420–450 MHz). Receive-only legal without license — TX requires Technician class. ~$30.",
    howTo: "Download CHIRP software (free) to program local repeaters, NOAA, and ARES frequencies. Study for Technician license at HamStudy.org — $15 exam, obtainable in a day.",
    cost: "~$30",
    link: "https://www.amazon.com/s?k=baofeng+uv-5r+dual+band+radio",
    walmartUrl: "https://www.walmart.com/search?q=baofeng+uv-5r+dual+band+radio",
    priority: "recommended",
    source: "ARRL and ARES: all preparedness-minded citizens should obtain at minimum a Technician class license",
  },
  {
    name: "Motorola T460 Two-Way Radios (FRS/GMRS) — 4-pack",
    note: "License-free FRS operation (0.5W). Up to 35-mile manufacturer claim (realistic: 1–3 miles in urban/suburban). Instant local family communication.",
    howTo: "Program family members to same channel and same privacy code. Test range at your home before an emergency. Keep batteries charged — or use rechargeable AA.",
    cost: "~$60",
    link: "https://www.amazon.com/s?k=motorola+t460+two+way+radio+4+pack",
    walmartUrl: "https://www.walmart.com/search?q=motorola+t460+two+way+radio+4+pack",
    targetUrl: "https://www.target.com/s?searchTerm=motorola+two+way+radio+4+pack",
    bestbuyUrl: "https://www.bestbuy.com/site/searchpage.jsp?st=motorola+t460+two+way+radio",
    priority: "recommended",
  },
  {
    name: "CB Radio — Uniden 520 Mobile",
    note: "40 channels. No license required. Channel 9 is the national emergency channel monitored by motorists and emergency services. Essential for vehicle convoys.",
    howTo: "Channel 9 = emergency. Channel 19 = truckers and road conditions. Mount antenna vertically for best range (up to 4 miles).",
    cost: "~$50",
    link: "https://www.amazon.com/s?k=uniden+520+cb+radio+mobile",
    walmartUrl: "https://www.walmart.com/search?q=uniden+520+cb+radio+mobile",
    bestbuyUrl: "https://www.bestbuy.com/site/searchpage.jsp?st=uniden+cb+radio+mobile",
    priority: "recommended",
  },
  {
    name: "Garmin inReach Mini 2 — Satellite Communicator",
    note: "Two-way messaging via Iridium satellite network — works anywhere on Earth with no cell service. SOS button directly contacts GEOS Emergency Response Center.",
    howTo: "Requires active subscription ($15–$50/month or annual). Keep updated with emergency contacts before travel or storm season. SOS button triggers 24/7 monitored rescue coordination.",
    cost: "~$350 + subscription",
    link: "https://www.amazon.com/s?k=garmin+inreach+mini+2",
    brandUrl: "https://www.garmin.com/en-US/p/775572",
    reiUrl: "https://www.rei.com/search?q=garmin+inreach+mini+2",
    bestbuyUrl: "https://www.bestbuy.com/site/searchpage.jsp?st=garmin+inreach+mini+2",
    priority: "optional",
  },
  {
    name: "Signal Mirror — Rescue Grade",
    note: "Non-electronic signaling device. Visible up to 10 miles in daylight. Zero batteries. Last-resort signaling for rescue.",
    howTo: "Aim reflected light by looking through the sighting hole. Flash in intervals of 3 (SOS pattern). Works even on overcast days.",
    cost: "~$10",
    link: "https://www.amazon.com/s?k=rescue+signal+mirror",
    reiUrl: "https://www.rei.com/search?q=signal+mirror+rescue",
    walmartUrl: "https://www.walmart.com/search?q=rescue+signal+mirror+survival",
    priority: "optional",
  },
];

const situationCards = [
  {
    icon: Wind,
    title: "Hurricane",
    color: "text-blue-400",
    bg: "bg-blue-900/10 border-blue-900/30",
    priorities: [
      "WaterBOB deployed 24 hrs before impact (100 gallons per tub)",
      "14+ days of food — no cooking power required",
      "Generator with 10+ gallons of Sta-Bil-treated fuel",
      "Chainsaw, axes, and pry bar for post-storm debris clearing",
      "NOAA weather radio for storm track updates during power outage",
      "Blue tarps and Gorilla tape for roof damage",
      "Gas shutoff wrench accessible and location known to all adults",
    ],
  },
  {
    icon: Waves,
    title: "Flood",
    color: "text-cyan-400",
    bg: "bg-cyan-900/10 border-cyan-900/30",
    priorities: [
      "Elevated water storage (no ground-floor access post-flood)",
      "Jerry cans stored in vehicles AND upper floors",
      "LifeStraw + purification tablets — floodwater is always contaminated",
      "N95 masks — flood-exposed areas carry mold and bacteria immediately",
      "Waterproof dry bags for documents, electronics, and medications",
      "Know your FEMA flood zone and evacuation route before season starts",
    ],
  },
  {
    icon: Mountain,
    title: "Earthquake",
    color: "text-orange-400",
    bg: "bg-orange-900/10 border-orange-900/30",
    priorities: [
      "Pipe wrench for gas shutoff — gas fires kill more than the quake",
      "Pry bar and rope for structural rescue from debris",
      "72-hour go-bag — immediate-grab, pre-packed, near exit",
      "Pre-filled water (municipal water pipes fracture post-quake)",
      "Full tank of fuel at all times",
      "Dust masks and safety goggles in go-bag",
    ],
  },
  {
    icon: Shield,
    title: "Civil Unrest",
    color: "text-red-400",
    bg: "bg-red-900/10 border-red-900/30",
    priorities: [
      "7-day shelter-in-place supply — do not leave unnecessarily",
      "Solar/battery power — generator noise reveals location",
      "Blackout curtains — no light visible from outside at night",
      "Establish neighbor trust network before any event",
      "Keep vehicles inside and tanks full",
      "Know Florida self-defense law — Castle Doctrine covers your home",
    ],
  },
];

export default function PreppingPage() {
  const [, navigate] = useLocation();
  return (
    <>
      <SEOHead
        title="Prepping | Preparedness | Concealed Florida"
        description="Comprehensive emergency prep gear: tools, water security, food storage, power systems, and communication equipment. FEMA-sourced standards, Essential vs Optional ratings, and operation guides."
        path="/preparedness/prepping"
      />
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">

          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/preparedness")}
              data-testid="button-back-preparedness"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Preparedness
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/preparedness/prepping/videos")}
              data-testid="button-video-resources-prepping"
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Video Resources
            </Button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 mt-2" data-testid="heading-prepping">
            Prepping
          </h1>
          <p className="text-gray-300 text-lg mb-3 max-w-3xl">
            This is not about hoarding — it is about being the person who can help when everyone else is scrambling. The right gear, stored and maintained properly, gives you options when systems fail.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" /><span className="text-gray-300">Essential — must have before any emergency season</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" /><span className="text-gray-300">Recommended — significantly improves resilience</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-500 shrink-0" /><span className="text-gray-300">Optional — extended or specialized scenarios</span></div>
            </div>
            <GearDownloadMenu items={[...toolItems, ...waterItems, ...foodItems, ...powerItems, ...commsItems]} title="Prepping-Complete-Checklist" label="Download All" />
          </div>

          {/* By Situation */}
          <section className="mb-14" data-testid="section-by-situation">
            <h2 className="text-2xl font-bold text-white mb-1">Priority Gear by Situation</h2>
            <p className="text-gray-300 text-sm mb-5">Different disasters demand different gear priorities. Know which category applies to your location and build accordingly.</p>
            <SectionVideo sectionId="situation" videoId="YNU7cqR4ZeQ" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {situationCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.title} className={`border ${card.bg}`} data-testid={`card-situation-${card.title.toLowerCase()}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${card.color}`} />
                        <CardTitle className="text-white text-base">{card.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1.5">
                        {card.priorities.map((p, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className={`text-xs font-bold ${card.color} mt-0.5 shrink-0`}>—</span>
                            <p className="text-gray-300 text-sm leading-relaxed">{p}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Tools */}
          <section className="mb-14" data-testid="section-tools">
            <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
              <div className="flex items-center gap-2">
                <Axe className="w-5 h-5 text-orange-400" />
                <h2 className="text-2xl font-bold text-white">Tools & Equipment</h2>
              </div>
              <GearDownloadMenu items={toolItems} title="Prepping-Tools-Equipment" />
            </div>
            <p className="text-gray-300 text-sm mb-4">Axes, multi-tools, and demolition gear for post-disaster debris clearing, repairs, and emergency response. Listed in recommended purchase priority order.</p>
            <SectionVideo sectionId="tools" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {toolItems.map((item) => <GearCard key={item.name} item={item} />)}
            </div>
          </section>

          {/* Water */}
          <section className="mb-14" data-testid="section-water">
            <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Water Security</h2>
              </div>
              <GearDownloadMenu items={waterItems} title="Prepping-Water-Security" />
            </div>
            <p className="text-gray-300 text-sm mb-2">Water is always your first priority. Nothing else matters if you are dehydrated in 24 hours.</p>
            <div className="bg-secondary border border-secondary rounded-lg px-4 py-3 mb-4">
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="text-white font-semibold">FEMA Minimum</p>
                  <p className="text-gray-300">1 gallon/person/day — 72 hrs = 3 gallons</p>
                </div>
                <div>
                  <p className="text-white font-semibold">Florida Practical Target</p>
                  <p className="text-gray-300">2 gallons/person/day — heat doubles needs</p>
                </div>
                <div>
                  <p className="text-white font-semibold">Recommended Storage</p>
                  <p className="text-gray-300">14+ days = 28 gallons per person minimum</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-2 italic">Source: FEMA Ready.gov emergency water storage guidelines; CDC water safety in emergencies</p>
            </div>
            <SectionVideo sectionId="water" videoId="RtMeHyGwcK0" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {waterItems.map((item) => <GearCard key={item.name} item={item} />)}
            </div>
          </section>

          {/* Food */}
          <section className="mb-14" data-testid="section-food">
            <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Food Storage</h2>
              </div>
              <GearDownloadMenu items={foodItems} title="Prepping-Food-Storage" />
            </div>
            <p className="text-gray-300 text-sm mb-4">Long-term food is an investment in options. Build in tiers — 72 hours, then 30 days, then 90 days. Cost guides below are per person.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {foodStandards.map((s) => (
                <Card key={s.period} className={`border ${s.bg}`} data-testid={`card-food-tier-${s.period.toLowerCase().replace(/\s+/g, "-").slice(0, 15)}`}>
                  <CardContent className="pt-4 pb-4">
                    <p className="text-white font-semibold text-sm">{s.period}</p>
                    <p className="text-green-400 font-bold text-sm mt-1">{s.cost}</p>
                    <p className="text-gray-400 text-xs">{s.calories}</p>
                    <p className="text-gray-300 text-xs leading-relaxed mt-2">{s.note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-gray-500 text-xs mb-4 italic">Source: FEMA Ready.gov — "Build A Kit"; CDC Emergency Food Safety; USDA Food Safety During Emergencies</p>
            <SectionVideo sectionId="food" videoId="WvhwdP1op6A" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {foodItems.map((item) => <GearCard key={item.name} item={item} />)}
            </div>
          </section>

          {/* Power */}
          <section className="mb-14" data-testid="section-power">
            <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Power Systems</h2>
              </div>
              <GearDownloadMenu items={powerItems} title="Prepping-Power-Systems" />
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Generators for immediate relief, solar for long-term independence, battery banks for portability. Build in layers — never rely on a single source. Fuel is perishable — treat it and rotate it.
            </p>
            <SectionVideo sectionId="power" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {powerItems.map((item) => <GearCard key={item.name} item={item} />)}
            </div>
          </section>

          {/* Communication Equipment */}
          <section className="mb-10" data-testid="section-comms-equipment">
            <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Communication Equipment</h2>
              </div>
              <GearDownloadMenu items={commsItems} title="Prepping-Communication-Equipment" />
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Cell towers fail in major disasters — sometimes for days or weeks. A layered communication plan means you have a way to receive information and reach help regardless of what infrastructure is standing. See the Communication page for full frequency references and downloadable guides.
            </p>
            <SectionVideo sectionId="comms" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {commsItems.map((item) => <GearCard key={item.name} item={item} />)}
            </div>
          </section>

          <div className="bg-secondary border border-secondary rounded-lg p-4 flex gap-3 items-start">
            <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Build your kit in priority order: Water first, then food, then communication, then power. A generator is useless without fuel. Freeze-dried food is useless without water to prepare it. All items sourced to verified manufacturers — none are sponsored recommendations.
            </p>
          </div>

        </div>
      </Layout>
    </>
  );
}
