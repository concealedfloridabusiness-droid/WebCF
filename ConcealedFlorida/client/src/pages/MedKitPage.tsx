import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  ArrowLeft,
  CheckSquare,
  ChevronRight,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Info,
  Play,
  Printer,
  ShoppingCart,
  Square,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ExpiryKey = "none" | "5yr" | "4-5yr" | "3-5yr" | "2-3yr" | "18-24mo" | "1-2yr" | "6mo-2yr";
type SectionKey =
  | "cvs-checklist"
  | "supplement"
  | "outside"
  | "inside"
  | "optional"
  | "pills"
  | "extra"
  | "bandaid";

interface KitItem {
  id: string;
  name: string;
  qty: string;
  section: SectionKey;
  expiry: ExpiryKey;
  narUrl?: string;
  amazonUrl?: string;
  cvsUrl?: string;
  walmartUrl?: string;
  walgreensUrl?: string;
  note?: string;
  group?: string;
  optional?: boolean;
  alternative?: string;
}

interface KitBag {
  name: string;
  brand: string;
  description: string;
  dimensions: string;
  color: string;
  primary: boolean;
  amazonUrl?: string;
  brandUrl?: string;
  altUrls?: { name: string; url: string }[];
}

interface ZiplockLinks {
  label: string;
  note: string;
  walmart?: string;
  walgreens?: string;
  cvs?: string;
  amazon?: string;
}

interface KitTier {
  tier: "basic" | "medium" | "advanced";
  label: string;
  subtitle: string;
  concept: string;
  forWho: string;
  totalLow: number;
  totalHigh: number;
  bags: KitBag[];
  items: KitItem[];
  sectionOverrideLabels?: Partial<Record<SectionKey, string>>;
  sectionNotes?: Partial<Record<SectionKey, string>>;
}

// ─── Expiry Config ────────────────────────────────────────────────────────────

const EXPIRY: Record<ExpiryKey, { label: string; textColor: string; dotColor: string }> = {
  none:       { label: "No expiration",                   textColor: "text-green-400",  dotColor: "bg-green-500" },
  "5yr":      { label: "Replace every 5 years",           textColor: "text-yellow-400", dotColor: "bg-yellow-500" },
  "4-5yr":    { label: "Replace every 4–5 years",         textColor: "text-yellow-400", dotColor: "bg-yellow-500" },
  "3-5yr":    { label: "Replace every 3–5 years",         textColor: "text-yellow-400", dotColor: "bg-yellow-500" },
  "2-3yr":    { label: "Replace every 2–3 years",         textColor: "text-orange-400", dotColor: "bg-orange-500" },
  "18-24mo":  { label: "Replace every 18–24 months",      textColor: "text-orange-400", dotColor: "bg-orange-500" },
  "1-2yr":    { label: "Replace every 1–2 years",         textColor: "text-orange-400", dotColor: "bg-orange-500" },
  "6mo-2yr":  { label: "Replace every 6 months–2 years",  textColor: "text-red-400",    dotColor: "bg-red-500" },
};

// ─── Section Config ───────────────────────────────────────────────────────────

const SECTION_LABEL: Record<SectionKey, string> = {
  "cvs-checklist": "What to Look for in a CVS Kit",
  supplement:      "Items to Add / Supplement",
  outside:         "Outside the Bag",
  inside:          "Inside the Bag",
  optional:        "Optional Add-ons",
  pills:           "Pill Bag (Ziplock — Small)",
  extra:           "Extras Bag (Ziplock — Small)",
  bandaid:         "Band-Aid Bag (Ziplock — Medium)",
};

// Ziplock buy links per section — bright red or orange bags for fast medical ID
const SECTION_ZIPLOCK: Record<string, ZiplockLinks> = {
  pills: {
    label: "Small Bright-Color Resealable Bags (2×3\" or 3×4\")",
    note: "Use red or orange colored resealable bags — bright color means fast medical ID under stress. Any small zip-seal bag in red, orange, or yellow works.",
    walmart:   "https://www.walmart.com/search?q=small+colored+resealable+bags+red+orange+4x6",
    walgreens: "https://www.walgreens.com/search/results.jsp?Ntt=small+resealable+bags+storage",
    cvs:       "https://www.cvs.com/search?searchTerm=small+resealable+storage+bags",
    amazon:    "https://www.amazon.com/s?k=small+red+orange+resealable+ziplock+bags+storage",
  },
  extra: {
    label: "Small Bright-Color Resealable Bags (3×4\" or 4×6\")",
    note: "Use red or orange colored resealable bags — bright color means fast medical ID under stress.",
    walmart:   "https://www.walmart.com/search?q=small+colored+resealable+bags+red+orange",
    walgreens: "https://www.walgreens.com/search/results.jsp?Ntt=small+resealable+bags+storage",
    cvs:       "https://www.cvs.com/search?searchTerm=small+resealable+storage+bags",
    amazon:    "https://www.amazon.com/s?k=small+colored+resealable+ziplock+bags+red+orange",
  },
  bandaid: {
    label: "Medium Bright-Color Resealable Bags (6×8\" or 7×8\")",
    note: "Use red or orange medium-size resealable bags for the band-aid section — bright color = instant visual ID as medical.",
    walmart:   "https://www.walmart.com/search?q=medium+resealable+bags+colored+red+orange+zip",
    walgreens: "https://www.walgreens.com/search/results.jsp?Ntt=medium+resealable+storage+bags",
    cvs:       "https://www.cvs.com/search?searchTerm=medium+resealable+storage+bags",
    amazon:    "https://www.amazon.com/s?k=medium+red+orange+resealable+ziplock+bags",
  },
};

// ─── Kit Data ─────────────────────────────────────────────────────────────────

const KITS: Record<string, KitTier> = {

  // ══ BASIC ══════════════════════════════════════════════════════════════════
  basic: {
    tier: "basic",
    label: "Personal Kit",
    subtitle: "Everyday Carry First Aid Kit",
    concept:
      "This is your personal first aid kit — the one that lives on your body or in your bag every day. It covers both minor injuries and baseline trauma: cuts, burns, blisters, allergic reactions, and life-threatening bleeding. Start with a standard CVS First Aid Kit off the shelf (~$20–$30) as the foundation, then supplement with the trauma and medical items listed below. The checklist shows exactly what to look for inside the CVS kit when buying it. A kit you don't have with you is a kit that can't save a life.",
    forWho: "On-person EDC, purse, belt bag, desk, home",
    totalLow: 120,
    totalHigh: 280,
    bags: [
      {
        name: "MedMod \"RSPNDR\" Kit",
        brand: "Apex Development",
        brandUrl: "https://www.apexdevelopment.co/shop/p/medmod-rspndr-kit",
        description:
          "The gold standard for on-person EDC trauma carry. The MedMod is a slim, modular IFAK designed to ride inside or outside the waistband — or clip to a belt, bag strap, or gear — without printing or adding bulk. It comes pre-loaded with a trauma kit, a NAR CAT Gen 7 or SOF-T TQ, and XSHEAR trauma shears. Ambidextrous single-hand deployment. 100% made in the USA with a lifetime warranty. This is what you carry on your body every day so the kit is with you when it counts. If you buy the RSPNDR Kit, buy your supplemental medical supplies directly from Apex Development as well — they carry everything designed to fit their system including their MedMod 1-AID Kit (gloves, antiseptic, bandages, and more). You do not need to source those individually from the list below.",
        dimensions: "~6\" × 4\" × 1.5\" (slim IWB profile)",
        color: "Black (low-profile)",
        primary: true,
      },
      {
        name: "Rapid Deployment Tactical MOLLE Trauma Pouch",
        brand: "Multiple Suppliers",
        description:
          "For those who prefer bag carry over waistband carry — or want something that fits inside a purse or tote. A Rapid Deployment Tactical MOLLE trauma pouch is compact, clips or mounts easily, and has exterior MOLLE webbing to attach a TQ holder on the outside. Everything else — compressed gauze, gloves, shears, pill bag — organizes inside. Look for a red or orange one so it's instantly identifiable as medical in an emergency.",
        dimensions: "~8\" × 5\" × 3\" (roughly)",
        color: "Red or Orange — strongly recommended",
        primary: false,
        amazonUrl: "https://www.amazon.com/s?k=rapid+deployment+tactical+MOLLE+trauma+kit+pouch+red",
        altUrls: [
          { name: "NAR", url: "https://www.narescue.com/catalogsearch/result/?q=bag" },
          { name: "Rescue Essentials", url: "https://rescue-essentials.com/packs-pouches-1/" },
        ],
      },
    ],
    sectionNotes: {
      pills: "All medication information on this page is for general reference only and does not constitute medical advice. Dosages, allergy considerations, and substitutions should be reviewed with a licensed healthcare professional before an emergency occurs. Build your kit — then talk to your doctor.",
    },
    items: [
      // ── What to look for in the CVS kit ─────────────────────────────────
      {
        id: "cvs-bandages",
        name: "Adhesive bandages (assorted sizes)",
        qty: "× assorted",
        section: "cvs-checklist",
        expiry: "5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=band-aid+assorted+sizes",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=band-aid+adhesive+bandages+assorted",
        walmartUrl: "https://www.walmart.com/search?q=band-aid+adhesive+bandages+assorted+sizes",
        amazonUrl: "https://www.amazon.com/s?k=band-aid+adhesive+bandages+assorted+sizes+variety+pack",
      },
      {
        id: "cvs-gauze",
        name: "Gauze pads (2×2 or 4×4)",
        qty: "× several",
        section: "cvs-checklist",
        expiry: "none",
        cvsUrl: "https://www.cvs.com/search?searchTerm=sterile+gauze+pads",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=sterile+gauze+pads",
        walmartUrl: "https://www.walmart.com/search?q=sterile+gauze+pads+first+aid",
        amazonUrl: "https://www.amazon.com/s?k=sterile+gauze+pads+2x2+4x4+first+aid",
      },
      {
        id: "cvs-tape",
        name: "Medical tape",
        qty: "× 1 roll",
        section: "cvs-checklist",
        expiry: "6mo-2yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=medical+tape+first+aid",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=medical+tape+first+aid",
        walmartUrl: "https://www.walmart.com/search?q=medical+tape+first+aid",
        amazonUrl: "https://www.amazon.com/s?k=medical+tape+first+aid+adhesive+roll",
      },
      {
        id: "cvs-wipes",
        name: "Antiseptic wipes / Alcohol prep pads",
        qty: "× pack",
        section: "cvs-checklist",
        expiry: "1-2yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=antiseptic+wipes+alcohol+prep+pads",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=antiseptic+wipes+alcohol+prep+pads",
        walmartUrl: "https://www.walmart.com/search?q=antiseptic+wipes+alcohol+prep+pads",
        amazonUrl: "https://www.amazon.com/s?k=antiseptic+wipes+alcohol+prep+pads+first+aid",
      },
      {
        id: "cvs-neo",
        name: "Antibiotic ointment (Neosporin)",
        qty: "× 1",
        section: "cvs-checklist",
        expiry: "2-3yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=neosporin+antibiotic+ointment",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=neosporin+antibiotic+ointment",
        walmartUrl: "https://www.walmart.com/search?q=neosporin+antibiotic+ointment",
        amazonUrl: "https://www.amazon.com/s?k=neosporin+antibiotic+ointment+first+aid",
      },
      {
        id: "cvs-shears",
        name: "Compact or Foldable Trauma Shears",
        qty: "× 1",
        section: "cvs-checklist",
        expiry: "none",
        narUrl: "https://www.narescue.com/nar-trauma-shears.html",
        note: "Standard scissors are not enough — you need actual trauma shears with a serrated blade capable of cutting through clothing, belts, and boots quickly. If space or concealment is a concern, look for compact or foldable trauma shears. Some fold to roughly 4 inches and still cut like full-size shears. The XSHEAR 6\" (included with the Apex MedMod RSPNDR) is a great example of a compact trauma shear. Whatever you pick, it must be trauma shears — not office scissors.",
      },
      {
        id: "cvs-tweezers",
        name: "Tweezers",
        qty: "× 1",
        section: "cvs-checklist",
        expiry: "none",
        cvsUrl: "https://www.cvs.com/search?searchTerm=tweezers+first+aid",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=tweezers+first+aid",
        walmartUrl: "https://www.walmart.com/search?q=tweezers+first+aid",
        amazonUrl: "https://www.amazon.com/s?k=stainless+steel+tweezers+first+aid+splinter+removal",
      },
      {
        id: "cvs-guide",
        name: "First aid guide booklet",
        qty: "× 1",
        section: "cvs-checklist",
        expiry: "none",
        optional: true,
        cvsUrl: "https://www.cvs.com/search?searchTerm=first+aid+guide+booklet",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=first+aid+guide+booklet",
        walmartUrl: "https://www.walmart.com/search?q=pocket+first+aid+guide+booklet",
        amazonUrl: "https://www.amazon.com/s?k=pocket+first+aid+guide+booklet+emergency+reference",
        note: "Optional — useful reference for bystanders unfamiliar with first aid. If you take a Stop the Bleed or Red Cross class, you already know this material.",
      },

      // ── Supplement items ─────────────────────────────────────────────────
      {
        id: "b-tq",
        name: "Tourniquet — C-A-T Gen 7 (Orange) or SOF-T Wide Gen 5",
        qty: "× 1",
        section: "supplement",
        expiry: "none",
        narUrl: "https://www.narescue.com/all-products/combat-application-tourniquet-c-a-t.html",
        note: "The single most important trauma item in any kit. Either the C-A-T Gen 7 or SOF-T Wide Gen 5 is an excellent choice — pick based on preference. The C-A-T is faster to apply one-handed; the SOF-T Wide is wider and distributes pressure better for larger limbs. Buy orange for visibility. For the CAT, buy only from NAR (narescue.com) — counterfeits have caused deaths. For the SOF-T Wide, buy from Tactical Medical Solutions or an authorized dealer. If using the MedMod RSPNDR from Apex Development, the kit already includes one — no need to buy separately.",
      },
      {
        id: "b-sharpie",
        name: "Sharpie Mini or Regular — Permanent Marker",
        qty: "× 1",
        section: "supplement",
        expiry: "2-3yr",
        walmartUrl: "https://www.walmart.com/search?q=sharpie+mini+permanent+marker",
        amazonUrl: "https://www.amazon.com/s?k=sharpie+mini+permanent+marker+black",
        note: "Goes with the TQ — you write the time of application directly on the patient's skin near the tourniquet so EMS knows exactly when it was applied. A Sharpie Mini fits smaller kits and belt bags; a regular Sharpie works if you have more space. Either works.",
      },
      {
        id: "b-compressed-gauze",
        name: "Compressed Gauze — 4.5\" Roll (2-pack)",
        qty: "× 1 pack (2 rolls)",
        section: "supplement",
        expiry: "5yr",
        narUrl: "https://www.narescue.com/nar-s-rolled-gauze.html",
        note: "Compressed gauze expands to a full-size roll when unwrapped — the compact form makes it ideal for small bags. Dual purpose: use it as a wound dressing for cuts and abrasions, or for packing a deep wound to control heavy bleeding. At least 2 rolls recommended. Not hemostatic (no clotting agent) — these are standard packing gauze. For most basic kit situations this is exactly what you need.",
      },
      {
        id: "b-alcohol-pads",
        name: "Alcohol Prep Pads (sterile)",
        qty: "× pack",
        section: "supplement",
        expiry: "1-2yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=alcohol+prep+pads",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=alcohol+prep+pads+sterile",
        walmartUrl: "https://www.walmart.com/search?q=alcohol+prep+pads+sterile",
        amazonUrl: "https://www.amazon.com/s?k=alcohol+prep+pads+sterile+first+aid",
      },
      {
        id: "b-bandages-one",
        name: "Bandages, All One Size",
        qty: "× 10",
        section: "supplement",
        expiry: "5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=band-aid+all+one+size",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=band-aid+adhesive+bandages",
        walmartUrl: "https://www.walmart.com/search?q=band-aid+adhesive+bandages+one+size",
        amazonUrl: "https://www.amazon.com/s?k=band-aid+flexible+fabric+all+one+size",
      },
      {
        id: "b-bandages-xl",
        name: "Bandages, Extra-Large",
        qty: "× 5",
        section: "supplement",
        expiry: "5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=band-aid+extra+large",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=band-aid+extra+large",
        walmartUrl: "https://www.walmart.com/search?q=band-aid+extra+large+adhesive+bandages",
        amazonUrl: "https://www.amazon.com/s?k=band-aid+extra+large+adhesive+bandages",
      },
      {
        id: "b-bandages-universal",
        name: "Bandages, Universal Sizes (assorted)",
        qty: "× assorted",
        section: "supplement",
        expiry: "5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=band-aid+variety+pack",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=band-aid+variety+pack",
        walmartUrl: "https://www.walmart.com/search?q=band-aid+variety+pack+assorted",
        amazonUrl: "https://www.amazon.com/s?k=band-aid+variety+pack+assorted+sizes",
      },
      {
        id: "b-neosporin",
        name: "Neosporin Packets (antibiotic ointment)",
        qty: "× 2–4",
        section: "supplement",
        expiry: "2-3yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=neosporin+ointment+packets",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=neosporin+antibiotic+ointment+packets",
        walmartUrl: "https://www.walmart.com/search?q=neosporin+antibiotic+ointment+packets",
        amazonUrl: "https://www.amazon.com/s?k=neosporin+antibiotic+ointment+single+use+packets",
      },
      {
        id: "b-gauze-pads",
        name: "Gauze Pads (sterile)",
        qty: "× 5",
        section: "supplement",
        expiry: "none",
        cvsUrl: "https://www.cvs.com/search?searchTerm=sterile+gauze+pads",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=sterile+gauze+pads",
        walmartUrl: "https://www.walmart.com/search?q=sterile+gauze+pads+first+aid",
        amazonUrl: "https://www.amazon.com/s?k=sterile+gauze+pads+2x2+4x4+first+aid",
      },
      {
        id: "b-moleskin",
        name: "Moleskin — Pre-Cut Blister Pads",
        qty: "× 1 pack",
        section: "supplement",
        expiry: "5yr",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=moleskin+blister+pads",
        walmartUrl: "https://www.walmart.com/search?q=moleskin+blister+pads",
        amazonUrl: "https://www.amazon.com/s?k=dr+scholl+moleskin+blister+prevention+pre+cut",
      },
      {
        id: "b-med-tape",
        name: "Medical Tape",
        qty: "× 1 roll",
        section: "supplement",
        expiry: "6mo-2yr",
        narUrl: "https://www.narescue.com/nar-surgical-tape-6-per-pack",
        cvsUrl: "https://www.cvs.com/search?searchTerm=medical+tape+first+aid",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=medical+tape+first+aid",
        walmartUrl: "https://www.walmart.com/search?q=medical+tape+first+aid",
        amazonUrl: "https://www.amazon.com/s?k=medical+tape+first+aid+adhesive",
      },

      // ── Pills ziplock ────────────────────────────────────────────────────
      {
        id: "b-ibuprofen",
        name: "Ibuprofen 200mg — NSAID Anti-Inflammatory",
        qty: "× 2 packets",
        section: "pills",
        expiry: "4-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=ibuprofen+200mg",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=ibuprofen+200mg",
        walmartUrl: "https://www.walmart.com/search?q=ibuprofen+200mg+travel+packets",
        amazonUrl: "https://www.amazon.com/s?k=ibuprofen+200mg+single+dose+packets+travel",
        note: "Anti-inflammatory and pain relief. Take with food. Do not use if suspected internal bleeding.",
        alternative: "NSAID allergy, GI sensitivity, or kidney concerns: Use Tylenol (acetaminophen) 500mg instead.",
      },
      {
        id: "b-tylenol",
        name: "Tylenol Extra Strength 500mg (Acetaminophen)",
        qty: "× 2 tablets",
        section: "pills",
        expiry: "4-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=tylenol+extra+strength+500mg",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=tylenol+extra+strength+500mg",
        walmartUrl: "https://www.walmart.com/search?q=tylenol+extra+strength+500mg",
        amazonUrl: "https://www.amazon.com/s?k=tylenol+extra+strength+caplets+500mg+travel+pack",
        note: "Pain and fever relief. Max dose 1000mg every 6 hours. Do not exceed 3000mg/day.",
        alternative: "Liver condition or acetaminophen sensitivity: Use Ibuprofen 200mg instead. Do not combine with alcohol.",
      },
      {
        id: "b-sting",
        name: "Sting Relief Pads (medicated — lidocaine/ammonia)",
        qty: "× 2",
        section: "pills",
        expiry: "4-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=sting+relief+pads",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=sting+relief+pads",
        walmartUrl: "https://www.walmart.com/search?q=sting+relief+pads+after+bite",
        amazonUrl: "https://www.amazon.com/s?k=sting+relief+pads+medicated+after+bite+after+sting",
        note: "For insect stings and minor bites. Apply immediately after removing stinger.",
        alternative: "If sting pads unavailable: Hydrocortisone 1% cream reduces inflammation. For severe allergic reaction — this is not sufficient; also use Benadryl and call 911.",
      },
      {
        id: "b-diphen",
        name: "Diphenhydramine (Benadryl) 25mg — Antihistamine",
        qty: "× 2 tablets",
        section: "pills",
        expiry: "4-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=benadryl+diphenhydramine+25mg",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=benadryl+diphenhydramine+25mg",
        walmartUrl: "https://www.walmart.com/search?q=benadryl+diphenhydramine+25mg",
        amazonUrl: "https://www.amazon.com/s?k=diphenhydramine+25mg+antihistamine+travel+pack",
        note: "For allergic reactions, insect stings, mild anaphylaxis. Causes drowsiness. NOT a substitute for epinephrine in severe anaphylaxis.",
        alternative: "If drowsiness is a concern: Cetirizine (Zyrtec) 10mg or Loratadine (Claritin) 10mg are non-drowsy alternatives, but slower-acting in acute allergic reactions.",
      },
      {
        id: "b-alka",
        name: "Alka-Seltzer Heartburn Relief",
        qty: "× 2",
        section: "pills",
        expiry: "5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=alka-seltzer+heartburn",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=alka-seltzer+heartburn+relief",
        walmartUrl: "https://www.walmart.com/search?q=alka-seltzer+heartburn+relief",
        amazonUrl: "https://www.amazon.com/s?k=alka-seltzer+heartburn+relief+individual+packets",
        note: "Antacid for heartburn and indigestion.",
        alternative: "Contains aspirin — do NOT use if aspirin-allergic. Alternatives: TUMS chewables (calcium carbonate) or Famotidine (Pepcid AC) 20mg for longer relief.",
      },
      {
        id: "b-burn-pkt",
        name: "Burn Relief Gel Packets",
        qty: "× 2",
        section: "pills",
        expiry: "3-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=burn+relief+gel+first+aid",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=burn+relief+gel+packets",
        walmartUrl: "https://www.walmart.com/search?q=burn+relief+gel+packets+first+aid",
        amazonUrl: "https://www.amazon.com/s?k=burn+relief+gel+packets+single+use+first+aid",
        note: "Immediate topical cooling. Apply before any burn dressing.",
        alternative: "If gel packets unavailable: Cool (not cold) running water for 20 minutes is the first-line treatment. Never use ice, butter, or toothpaste on burns.",
      },
    ],
  },

  // ══ MEDIUM ═════════════════════════════════════════════════════════════════
  medium: {
    tier: "medium",
    label: "Standard Kit",
    subtitle: "Trauma Car / Bag Kit",
    concept:
      "A compact trauma-ready kit for your car or everyday bag. Built around a medium-sized tactical or medical pouch. Covers serious bleeding, airway emergencies, burns, and shock — organized into clearly labeled ziplock sections for fast access under stress.",
    forWho: "Car kit, range bag, hiking, vehicle emergency response",
    totalLow: 250,
    totalHigh: 350,
    bags: [
      {
        name: "Compact Red EMS Trauma Bag — Medium (10×7×4\")",
        brand: "Multiple Suppliers",
        description:
          "The primary recommended bag for this kit. Red or orange color for fast visual identification, MOLLE-compatible exterior, multiple internal compartments, and water-resistant material. At 10\"×7\"×4\" it holds all items in this kit with organized ziplock sections without excess bulk. Look for bags with a clear front access panel for the TQ holder and side pockets for shears.",
        dimensions: "~10\" × 7\" × 4\"",
        color: "Red or Orange — strongly recommended",
        primary: true,
        amazonUrl: "https://www.amazon.com/s?k=red+medical+trauma+bag+medium+ems+first+aid+molle+10x7",
        altUrls: [
          { name: "NAR", url: "https://www.narescue.com/catalogsearch/result/?q=bag" },
          { name: "Rescue Essentials", url: "https://rescue-essentials.com/packs-pouches-1/" },
        ],
      },
      {
        name: "Tactical MOLLE Medical Pouch — Tan / OD Green",
        brand: "Multiple Suppliers",
        description:
          "Tactical alternative if a low-profile look is preferred. Same approximate dimensions — MOLLE webbing required for TQ holder attachment. Ensure the bag has a main compartment large enough to fit all inside items plus the ziplock section bags flat.",
        dimensions: "~10\" × 7\" × 4\"",
        color: "Tan or OD Green",
        primary: false,
        amazonUrl: "https://www.amazon.com/s?k=tactical+molle+medical+pouch+tan+odgreen+trauma+10x7",
        altUrls: [
          { name: "NAR", url: "https://www.narescue.com/catalogsearch/result/?q=bag" },
          { name: "Rescue Essentials", url: "https://rescue-essentials.com/packs-pouches-1/" },
        ],
      },
    ],
    sectionNotes: {
      outside: "Items in this section are ideally positioned on the outside of the bag for the fastest access under stress. However, if your bag does not have MOLLE webbing or exterior attachment points, any of these items can be stored in the outermost accessible front pocket or top flap inside — what matters is single-hand access in under 3 seconds without opening the main compartment. Practice your draw before you need it.",
      pills: "All medication information on this page is for general reference only and does not constitute medical advice. Dosages, allergy considerations, and substitutions should be reviewed with a licensed healthcare professional before an emergency occurs. Build your kit — then talk to your doctor.",
    },
    items: [
      // ── Outside ──────────────────────────────────────────────────────────
      {
        id: "m-tq-holder",
        name: "TQ Holder (Red) — MOLLE Tourniquet Holder",
        qty: "× 1",
        section: "outside",
        expiry: "none",
        narUrl: "https://www.narescue.com/search?q=tourniquet+holder",
        note: "Ideal position: MOLLE-mounted on the exterior for instant single-hand grab. No MOLLE on your bag? Use a front-flap clip or the outermost inside pocket — as long as you can draw the TQ with one hand without opening the main compartment.",
      },
      {
        id: "m-cat-out",
        name: "C-A-T Gen 7 Combat Application Tourniquet — Orange",
        qty: "× 1",
        section: "outside",
        expiry: "none",
        narUrl: "https://www.narescue.com/all-products/combat-application-tourniquet-c-a-t.html",

        note: "Best stored in the TQ holder on the outside or a front exterior pocket. Can also be stored in the outermost inside pocket if exterior mounting is not possible — practice the draw until it takes less than 3 seconds. Buy only from NAR — counterfeits have caused deaths.",
      },
      {
        id: "m-sharpie-out",
        name: "Sharpie Mini or Regular — Permanent Marker",
        qty: "× 1",
        section: "outside",
        expiry: "2-3yr",
        walmartUrl: "https://www.walmart.com/search?q=sharpie+mini+permanent+marker",
        amazonUrl: "https://www.amazon.com/s?k=sharpie+mini+permanent+marker+black",
        note: "Clip to the TQ holder, a MOLLE loop, or a front pocket. Can be stored inside the front flap or top pocket. Used to write tourniquet application time on the patient's skin — you need it within seconds of applying the TQ.",
      },
      {
        id: "m-shears-out",
        name: "Trauma Shears — Large",
        qty: "× 1",
        section: "outside",
        expiry: "none",
        narUrl: "https://www.narescue.com/nar-trauma-shears.html",

        note: "Clip to exterior MOLLE or a side pocket. Can be stored in the front inside pocket if no exterior clip is available. Used to cut clothing away from a wound — the faster you can access these, the faster you can treat.",
      },

      // ── Inside ───────────────────────────────────────────────────────────
      // Tools
      {
        id: "m-gloves",
        name: "Nitrile Gloves — First Responder Pack",
        qty: "× 1 pack (2 pairs)",
        section: "inside",
        group: "Tools",
        expiry: "none",
        narUrl: "https://www.narescue.com/responder-glove-kits-pack-of-25.html",
        note: "Always glove up before treating any casualty. Two pairs covers one responder treating one patient.",
      },
      // Trauma
      {
        id: "m-cat-in",
        name: "C-A-T Gen 7 Combat Application Tourniquet — Orange",
        qty: "× 1",
        section: "inside",
        group: "Trauma",
        expiry: "none",
        narUrl: "https://www.narescue.com/all-products/combat-application-tourniquet-c-a-t.html",

        note: "Second TQ inside the bag. You now have two total — one on the outside for immediate access, one as backup or for a second casualty. Buy only from NAR.",
      },
      {
        id: "m-hyfin",
        name: "NAR HyFin Vent Compact Chest Seal — Twin Pack",
        qty: "× 1 pack (2 seals)",
        section: "inside",
        group: "Trauma",
        expiry: "none",
        narUrl: "https://www.narescue.com/hyfin-vent-compact-chest-seal-twin-pack.html",
        note: "One seal for entry wound, one for exit wound. Vented design prevents tension pneumothorax. Both seals fit flat inside the main compartment.",
      },
      {
        id: "m-etd6",
        name: "6 IN. Emergency Trauma Dressing (ETD)",
        qty: "× 1",
        section: "inside",
        group: "Trauma",
        expiry: "none",
        narUrl: "https://www.narescue.com/6-emergency-trauma-dressing-etd.html",
        note: "For large wounds, torso injuries, and improvised pressure dressings. Rolls flat into the bag.",
      },
      {
        id: "m-etd4",
        name: "4 IN. Emergency Trauma Dressing (ETD)",
        qty: "× 1",
        section: "inside",
        group: "Trauma",
        expiry: "none",
        narUrl: "https://www.narescue.com/4-emergency-trauma-dressing-etd.html",
        note: "For extremity wounds and smaller pressure dressings. Compact enough to fit beside the 6\" dressing.",
      },
      {
        id: "m-sgauze",
        name: "S-Rolled Gauze (conforming)",
        qty: "× 2",
        section: "inside",
        group: "Trauma",
        expiry: "none",
        narUrl: "https://www.narescue.com/nar-s-rolled-gauze.html",

        note: "Wound packing, securing dressings, improvised bandaging. Two rolls fit compactly alongside the ETDs.",
      },
      {
        id: "m-blanket",
        name: "Emergency Survival Blanket (Mylar)",
        qty: "× 1",
        section: "inside",
        group: "Trauma",
        expiry: "none",
        narUrl: "https://www.narescue.com/emergency-survival-wraps.html",
        note: "Folds to credit-card size. Wrap any trauma casualty to prevent hypothermia — even in Florida heat after significant blood loss.",
      },
      // Medical
      {
        id: "m-tape-in",
        name: "Medical / Surgical Tape",
        qty: "× 1 roll",
        section: "inside",
        group: "Medical",
        expiry: "6mo-2yr",
        narUrl: "https://www.narescue.com/nar-surgical-tape-6-per-pack",
        cvsUrl: "https://www.cvs.com/search?searchTerm=medical+tape",
        amazonUrl: "https://www.amazon.com/s?k=medical+tape+first+aid+adhesive+roll",
        note: "Secures dressings and labels on improvised bandaging. One roll is sufficient for this kit size.",
      },

      // ── Optional ─────────────────────────────────────────────────────────
      {
        id: "m-cpr",
        name: "CPR Pocket Mask with One-Way Valve",
        qty: "× 1",
        section: "optional",
        expiry: "none",
        amazonUrl: "https://www.amazon.com/s?k=cpr+pocket+mask+one+way+valve+first+aid",
        note: "Adds rescue breathing capability. Stores flat in a side or front pocket.",
      },
      {
        id: "m-tweezers",
        name: "Surgical Tweezers 5.5\"",
        qty: "× 1",
        section: "optional",
        expiry: "none",
        cvsUrl: "https://www.cvs.com/search?searchTerm=surgical+tweezers+first+aid",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=tweezers+first+aid",
        walmartUrl: "https://www.walmart.com/search?q=tweezers+first+aid",
        amazonUrl: "https://www.amazon.com/s?k=surgical+tweezers+5.5+inch+stainless+steel+medical",
        note: "Fragment and debris removal. Slim enough to store in any pocket without bulk.",
      },
      {
        id: "m-burn44",
        name: "BurnTec Burn Dressing 4×4\" (sterile gel)",
        qty: "× 1",
        section: "optional",
        expiry: "5yr",
        narUrl: "https://www.narescue.com/burntec-dressing.html",
        note: "For 2nd-degree burns up to moderate size. Sterile hydrogel reduces pain on contact.",
      },
      {
        id: "m-quikclot-ems",
        name: "QuikClot EMS 4×4\" Hemostatic Gauze",
        qty: "× 1",
        section: "optional",
        expiry: "5yr",
        narUrl: "https://www.narescue.com/quikclotr-ems-starter-pack-hemostatic-bandage.html",

        note: "Hemostatic upgrade for junctional or non-compressible bleeding. The standard packing gauze handles most bleeds — this is a meaningful upgrade for serious scenarios.",
      },
      {
        id: "m-quikclot-long",
        name: "QuikClot Combat Gauze Z-Fold 3\"×48\"",
        qty: "× 1",
        section: "optional",
        expiry: "5yr",
        narUrl: "https://www.narescue.com/search?q=quikclot+combat+gauze+z-fold",
        note: "Full-length hemostatic packing gauze. Brings the medium kit closer to advanced capability.",
      },
      {
        id: "m-tri-bandage",
        name: "Triangular Bandage / Cravat",
        qty: "× 1",
        section: "optional",
        expiry: "none",
        narUrl: "https://www.narescue.com/kit-triangular-bandage-odg.html",

        note: "Arm slings, improvised splint securing, and pressure bandaging. Folds flat.",
      },

      // ── Pills ziplock (small) ────────────────────────────────────────────
      {
        id: "m-tylenol",
        name: "Tylenol Extra Strength 500mg (Acetaminophen)",
        qty: "× 4 tablets",
        section: "pills",
        expiry: "4-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=tylenol+extra+strength+500mg",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=tylenol+extra+strength+500mg",
        walmartUrl: "https://www.walmart.com/search?q=tylenol+extra+strength+500mg",
        amazonUrl: "https://www.amazon.com/s?k=tylenol+extra+strength+caplets+500mg+travel+pack",
        note: "Pain and fever relief. Max dose: 1000mg every 6 hours. Do not exceed 3000mg/day.",
        alternative: "Liver condition or acetaminophen sensitivity: Use Ibuprofen 200mg instead. Never combine Tylenol with alcohol or other acetaminophen products.",
      },
      {
        id: "m-ibuprofen",
        name: "Ibuprofen 200mg — NSAID Anti-Inflammatory",
        qty: "× 4 packets",
        section: "pills",
        expiry: "4-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=ibuprofen+200mg",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=ibuprofen+200mg",
        walmartUrl: "https://www.walmart.com/search?q=ibuprofen+200mg+travel+packets",
        amazonUrl: "https://www.amazon.com/s?k=ibuprofen+200mg+single+dose+packets+travel",
        note: "Anti-inflammatory and pain relief. Do not use if suspected internal bleeding or kidney issues.",
        alternative: "NSAID allergy, GI sensitivity, or kidney concerns: Use Tylenol 500mg instead. Alternative: Naproxen (Aleve) 220mg for longer-lasting pain relief.",
      },
      {
        id: "m-burn-pkt",
        name: "Burn Relief Gel Packets",
        qty: "× 2",
        section: "pills",
        expiry: "3-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=burn+relief+gel+first+aid",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=burn+relief+gel+packets",
        walmartUrl: "https://www.walmart.com/search?q=burn+relief+gel+packets+first+aid",
        amazonUrl: "https://www.amazon.com/s?k=burn+relief+gel+packets+first+aid+single+use",
        note: "Immediate topical cooling. Apply before burn dressings.",
        alternative: "If gel packets unavailable: Cool (not cold) running water for 20 minutes is the standard first-line burn treatment. Never use ice, butter, or toothpaste.",
      },
      {
        id: "m-neosporin",
        name: "Neosporin Triple Antibiotic Ointment",
        qty: "× 1 small tube / 4 packets",
        section: "pills",
        expiry: "2-3yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=neosporin+ointment",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=neosporin+triple+antibiotic+ointment",
        walmartUrl: "https://www.walmart.com/search?q=neosporin+triple+antibiotic+ointment",
        amazonUrl: "https://www.amazon.com/s?k=neosporin+triple+antibiotic+ointment+packets",
        note: "Apply to cleaned wounds before dressing to prevent bacterial infection.",
        alternative: "Neomycin allergy (common): Use Bacitracin-only ointment instead. Do not use triple antibiotic ointment if a known neomycin sensitivity exists.",
      },
      {
        id: "m-sting",
        name: "Sting Relief Pads (medicated — lidocaine/ammonia)",
        qty: "× 4",
        section: "pills",
        expiry: "4-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=sting+relief+pads",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=sting+relief+pads",
        walmartUrl: "https://www.walmart.com/search?q=sting+relief+pads+after+bite",
        amazonUrl: "https://www.amazon.com/s?k=sting+relief+pads+medicated+after+bite",
        note: "For insect stings and minor bites. Apply immediately after removing stinger.",
        alternative: "If sting pads unavailable: Hydrocortisone 1% cream reduces inflammation. For severe allergic reaction — administer Benadryl and call 911. This item alone is not sufficient for anaphylaxis.",
      },
      {
        id: "m-diphen",
        name: "Diphenhydramine (Benadryl) 25mg — Antihistamine",
        qty: "× 4 tablets",
        section: "pills",
        expiry: "4-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=benadryl+diphenhydramine+25mg",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=benadryl+diphenhydramine+25mg",
        walmartUrl: "https://www.walmart.com/search?q=benadryl+diphenhydramine+25mg",
        amazonUrl: "https://www.amazon.com/s?k=diphenhydramine+25mg+antihistamine+individual+packets",
        note: "For allergic reactions, insect stings, mild anaphylaxis. Causes drowsiness. NOT a substitute for epinephrine in severe anaphylaxis.",
        alternative: "If drowsiness is a concern: Cetirizine (Zyrtec) 10mg or Loratadine (Claritin) 10mg are non-drowsy alternatives. Note: slower-acting in acute reactions.",
      },

      // ── Extra ziplock (small) ────────────────────────────────────────────
      {
        id: "m-liquid-iv",
        name: "Liquid IV Hydration Multiplier",
        qty: "× 2",
        section: "extra",
        expiry: "18-24mo",
        cvsUrl: "https://www.cvs.com/search?searchTerm=liquid+iv+hydration+multiplier",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=liquid+iv+hydration+multiplier",
        walmartUrl: "https://www.walmart.com/search?q=liquid+iv+hydration+multiplier+packets",
        amazonUrl: "https://www.amazon.com/s?k=liquid+iv+hydration+multiplier+packets+electrolyte",
        note: "Electrolyte-enhanced hydration. Critical for heat casualty and dehydration. Mix with 16oz water.",
      },
      {
        id: "m-emergen-c",
        name: "Emergen-C 1000mg Vitamin C Powder",
        qty: "× 2",
        section: "extra",
        expiry: "2-3yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=emergen-c+vitamin+c+1000mg",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=emergen-c+1000mg+vitamin+c",
        walmartUrl: "https://www.walmart.com/search?q=emergen-c+1000mg+vitamin+c+packets",
        amazonUrl: "https://www.amazon.com/s?k=emergen-c+1000mg+vitamin+c+powder+packets+individual",
        note: "Immune support and supplemental electrolytes in high-stress situations.",
      },
      {
        id: "m-alka",
        name: "Alka-Seltzer Heartburn Relief",
        qty: "× 2",
        section: "extra",
        expiry: "5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=alka-seltzer+heartburn",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=alka-seltzer+heartburn+relief",
        walmartUrl: "https://www.walmart.com/search?q=alka-seltzer+heartburn+relief",
        amazonUrl: "https://www.amazon.com/s?k=alka-seltzer+heartburn+relief+individual+packets",
        note: "Antacid for heartburn and indigestion.",
        alternative: "Contains aspirin — do NOT use if aspirin-allergic. Alternatives: TUMS (calcium carbonate) or Famotidine (Pepcid AC) 20mg.",
      },

      // ── Band-Aid ziplock (medium) ────────────────────────────────────────
      {
        id: "m-ba-alcohol",
        name: "Alcohol Prep Pads (sterile)",
        qty: "× 10",
        section: "bandaid",
        expiry: "1-2yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=alcohol+prep+pads",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=alcohol+prep+pads+sterile",
        walmartUrl: "https://www.walmart.com/search?q=alcohol+prep+pads+sterile",
        amazonUrl: "https://www.amazon.com/s?k=alcohol+prep+pads+sterile+200+count",
      },
      {
        id: "m-ba-one",
        name: "Bandages, All One Size",
        qty: "× 10–5",
        section: "bandaid",
        expiry: "5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=band-aid+all+one+size",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=band-aid+adhesive+bandages",
        walmartUrl: "https://www.walmart.com/search?q=band-aid+adhesive+bandages+one+size",
        amazonUrl: "https://www.amazon.com/s?k=band-aid+flexible+fabric+all+one+size+bandages",
      },
      {
        id: "m-ba-xl",
        name: "Bandages, Extra-Large",
        qty: "× 5–3",
        section: "bandaid",
        expiry: "5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=band-aid+extra+large",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=band-aid+extra+large",
        walmartUrl: "https://www.walmart.com/search?q=band-aid+extra+large+adhesive+bandages",
        amazonUrl: "https://www.amazon.com/s?k=band-aid+extra+large+adhesive+bandages",
      },
      {
        id: "m-ba-universal",
        name: "Bandages, Universal Sizes (divide equally)",
        qty: "× assorted",
        section: "bandaid",
        expiry: "5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=band-aid+variety+pack",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=band-aid+variety+pack",
        walmartUrl: "https://www.walmart.com/search?q=band-aid+variety+pack+assorted",
        amazonUrl: "https://www.amazon.com/s?k=band-aid+variety+pack+assorted+sizes+universal",
      },
      {
        id: "m-ba-moleskin",
        name: "Moleskin — Pre-Cut Blister Pads",
        qty: "× 1 pack",
        section: "bandaid",
        expiry: "5yr",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=moleskin+blister+pads",
        walmartUrl: "https://www.walmart.com/search?q=moleskin+blister+pads",
        amazonUrl: "https://www.amazon.com/s?k=dr+scholl+moleskin+blister+prevention+pre+cut",
      },
      {
        id: "m-ba-gauze",
        name: "Gauze Pads (sterile)",
        qty: "× 5–2",
        section: "bandaid",
        expiry: "none",
        cvsUrl: "https://www.cvs.com/search?searchTerm=sterile+gauze+pads",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=sterile+gauze+pads",
        walmartUrl: "https://www.walmart.com/search?q=sterile+gauze+pads+first+aid",
        amazonUrl: "https://www.amazon.com/s?k=sterile+gauze+pads+2x2+4x4+first+aid",
      },
    ],
  },

  // ══ ADVANCED ═══════════════════════════════════════════════════════════════
  advanced: {
    tier: "advanced",
    label: "Advanced Kit",
    subtitle: "Home Station Trauma Kit — Worst-Case Ready",
    concept:
      "A full home-station trauma kit built for multi-person, worst-case-scenario care. Goes beyond the Medium Kit with expanded wound care, airway management tools, fracture immobilization, patient assessment devices, and a dedicated personal needs and hydration bag. This is your base of operations — the kit you reach for when things are serious and help is not coming quickly.",
    forWho: "Home emergency station, multi-person household, grid-down preparedness",
    totalLow: 450,
    totalHigh: 700,
    bags: [
      {
        name: "Large Red or Orange Medical Trauma Bag",
        brand: "Multiple Suppliers",
        description:
          "A large red or orange bag with MOLLE webbing, multiple outer pockets, and an expandable interior. Bright color makes it immediately identifiable as medical in any emergency. Must be large enough to hold all sections listed below plus room for personal additions. Look for units with separate internal pockets, clear-view windows, and labeled compartments.",
        dimensions: "~16\" × 12\" × 8\" or larger",
        color: "Red or Orange — strongly recommended",
        primary: true,
        amazonUrl: "https://www.amazon.com/s?k=large+red+medical+trauma+bag+ems+first+aid+kit",
        altUrls: [
          { name: "NAR", url: "https://www.narescue.com/catalogsearch/result/?q=bag" },
          { name: "Rescue Essentials", url: "https://rescue-essentials.com/packs-pouches-1/" },
        ],
      },
    ],
    sectionOverrideLabels: {
      extra: "Personal Needs & Hydration Bag (Ziplock — Medium)",
    },
    sectionNotes: {
      outside: "Items in this section are ideally positioned on the outside of the bag for fastest access under stress. However, none of these require exterior mounting — if your bag has no MOLLE webbing or exterior attachment points, store them in the outermost accessible front pocket or top flap inside. What matters is single-hand access in under 3 seconds without opening the main compartment. Practice your draw before you need it.",
      optional: "Several items in this section — including the Chest Needle Decompression kit and Nasopharyngeal Airway — require formal clinical or TCCC (Tactical Combat Casualty Care) certification before use. Other equipment and techniques exist beyond what is listed here that may be beneficial in trauma situations: field blood transfusion sets, SAM pelvic stabilizers, hypothermia wraps, IV fluid administration, tourniquet junctional devices, and more — but these all require specialized medical or military training. Do not purchase or carry equipment you are not certified to use. Seek training through NAEMSP, TCCC.us, Stop the Bleed, or a certified wilderness first responder program before adding advanced items to your kit.",
      pills: "All medication information on this page is for general reference only and does not constitute medical advice. Dosages, allergy considerations, and substitutions should be reviewed with a licensed healthcare professional before an emergency occurs. Build your kit — then talk to your doctor.",
    },
    items: [
      // ── Outside ──────────────────────────────────────────────────────────
      {
        id: "a-tq-holder",
        name: "TQ Holder (Red) — MOLLE Tourniquet Holder",
        qty: "× 1",
        section: "outside",
        expiry: "none",
        narUrl: "https://www.narescue.com/search?q=tourniquet+holder",
        note: "Ideal position: MOLLE-mounted on the exterior of the bag for instant single-hand grab. No exterior MOLLE? Use a front-flap clip or the outermost inside pocket — what matters is one-handed access without opening the main compartment.",
      },
      {
        id: "a-cat-out",
        name: "C-A-T Gen 7 Combat Application Tourniquet — Orange",
        qty: "× 1",
        section: "outside",
        expiry: "none",
        narUrl: "https://www.narescue.com/all-products/combat-application-tourniquet-c-a-t.html",

        note: "Best stored in the TQ holder on the outside or a front exterior pocket. Can also be stored in the outermost inside pocket if exterior mounting is not possible — practice the draw until it takes less than 3 seconds. Buy only from NAR — counterfeits are dangerous.",
      },
      {
        id: "a-sharpie-out",
        name: "Sharpie Mini or Regular — Permanent Marker",
        qty: "× 1",
        section: "outside",
        expiry: "2-3yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=sharpie+permanent+marker",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=sharpie+permanent+marker",
        walmartUrl: "https://www.walmart.com/search?q=sharpie+mini+permanent+marker",
        amazonUrl: "https://www.amazon.com/s?k=sharpie+mini+permanent+marker+black",
        note: "Clip to the TQ holder, a MOLLE loop, or a front-facing exterior pocket. Can be stored in a top flap pocket inside — you need it immediately after applying the TQ to write the time on the patient's skin.",
      },
      {
        id: "a-shears-out",
        name: "NAR Trauma Shears — Large",
        qty: "× 1",
        section: "outside",
        expiry: "none",
        narUrl: "https://www.narescue.com/nar-trauma-shears.html",

        note: "Clip to exterior MOLLE or a side pocket. Can be stored in the front inside pocket if no exterior attachment is available. Used to cut clothing away from a wound — faster access means faster treatment.",
      },

      // ── Inside ───────────────────────────────────────────────────────────
      // Tools
      {
        id: "a-sharpie-in",
        name: "Sharpie Mini — Permanent Marker",
        qty: "× 2",
        section: "inside",
        group: "Tools",
        expiry: "2-3yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=sharpie+permanent+marker",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=sharpie+permanent+marker",
        walmartUrl: "https://www.walmart.com/search?q=sharpie+mini+permanent+marker",
        amazonUrl: "https://www.amazon.com/s?k=sharpie+mini+permanent+marker+black",
        note: "Two backup markers inside — one for each potential casualty.",
      },
      {
        id: "a-gloves",
        name: "Nitrile Gloves — First Responder Pack",
        qty: "× 2 packs",
        section: "inside",
        group: "Tools",
        expiry: "none",
        narUrl: "https://www.narescue.com/responder-glove-kits-pack-of-25.html",
        note: "Two packs — one per potential responder. Always glove up before treating.",
      },
      {
        id: "a-cpr",
        name: "CPR Pocket Mask with One-Way Valve",
        qty: "× 1",
        section: "inside",
        group: "Tools",
        expiry: "none",
        walmartUrl: "https://www.walmart.com/search?q=cpr+pocket+mask+one+way+valve+first+aid",
        amazonUrl: "https://www.amazon.com/s?k=cpr+pocket+mask+one+way+valve+first+aid",
        note: "Provides barrier protection during rescue breathing. Essential for any kit sized for home emergencies.",
      },
      {
        id: "a-tweezers",
        name: "Surgical Tweezers 5.5\"",
        qty: "× 1",
        section: "inside",
        group: "Tools",
        expiry: "none",
        walmartUrl: "https://www.walmart.com/search?q=surgical+tweezers+5.5+inch+stainless+steel+medical",
        amazonUrl: "https://www.amazon.com/s?k=surgical+tweezers+5.5+inch+stainless+steel+medical",
        note: "For fragment/debris removal and wound inspection.",
      },
      {
        id: "a-irrigation-syringe",
        name: "Wound Irrigation Syringe — 60cc",
        qty: "× 1",
        section: "inside",
        group: "Tools",
        expiry: "none",
        walmartUrl: "https://www.walmart.com/search?q=wound+irrigation+syringe+60cc+medical",
        amazonUrl: "https://www.amazon.com/s?k=wound+irrigation+syringe+60cc+medical+first+aid",
        note: "Used with sterile saline to flush debris and contamination from open wounds. Fill, pressurize, flush.",
      },
      // Trauma
      {
        id: "a-cat-in",
        name: "C-A-T Gen 7 Combat Application Tourniquet — Orange",
        qty: "× 2",
        section: "inside",
        group: "Trauma",
        expiry: "none",
        narUrl: "https://www.narescue.com/all-products/combat-application-tourniquet-c-a-t.html",

        note: "Total of 3 TQs in the full kit (1 outside + 2 inside) for multi-casualty response. Buy only from NAR.",
      },
      {
        id: "a-hyfin",
        name: "NAR HyFin Vent Compact Chest Seal — Twin Pack",
        qty: "× 2 packs (4 seals total)",
        section: "inside",
        group: "Trauma",
        expiry: "none",
        narUrl: "https://www.narescue.com/hyfin-vent-compact-chest-seal-twin-pack.html",
        note: "Two twin packs — one set per potential open chest wound. Occlusive vented seal for tension pneumothorax prevention.",
      },
      {
        id: "a-etd6",
        name: "6 IN. Emergency Trauma Dressing (ETD)",
        qty: "× 2",
        section: "inside",
        group: "Trauma",
        expiry: "none",
        narUrl: "https://www.narescue.com/6-emergency-trauma-dressing-etd.html",
        note: "For large wounds, torso injuries, and improvised pressure dressings.",
      },
      {
        id: "a-etd4",
        name: "4 IN. Emergency Trauma Dressing (ETD)",
        qty: "× 2",
        section: "inside",
        group: "Trauma",
        expiry: "none",
        narUrl: "https://www.narescue.com/4-emergency-trauma-dressing-etd.html",
        note: "For extremity wounds, smaller pressure dressings, or head/face injuries.",
      },
      {
        id: "a-sgauze",
        name: "S-Rolled Gauze (conforming)",
        qty: "× 4",
        section: "inside",
        group: "Trauma",
        expiry: "none",
        narUrl: "https://www.narescue.com/nar-s-rolled-gauze.html",

        note: "Used for wound packing, securing dressings, and improvised bandaging.",
      },
      {
        id: "a-abd-pad",
        name: "ABD Abdominal Pad (5×9\")",
        qty: "× 4",
        section: "inside",
        group: "Trauma",
        expiry: "none",
        narUrl: "https://www.narescue.com/search?q=abdominal+pad",
        note: "High-absorbency pads for large abdominal or chest wounds. Layer over packing gauze.",
      },
      {
        id: "a-quikclot-ems",
        name: "QuikClot EMS Hemostatic Gauze 4×4\"",
        qty: "× 2",
        section: "inside",
        group: "Trauma",
        optional: true,
        expiry: "5yr",
        narUrl: "https://www.narescue.com/quikclotr-ems-starter-pack-hemostatic-bandage.html",

        note: "Kaolin-impregnated hemostatic gauze for junctional or non-compressible bleeding. A TQ + packing gauze handles most bleeds — this upgrades deep wound control.",
      },
      {
        id: "a-quikclot-long",
        name: "QuikClot Combat Gauze Z-Fold 3\"×48\"",
        qty: "× 2",
        section: "inside",
        group: "Trauma",
        optional: true,
        expiry: "5yr",
        narUrl: "https://www.narescue.com/search?q=quikclot+combat+gauze+z-fold",
        note: "Full-length hemostatic packing gauze for deep wound channels. Military-grade. Optional upgrade — standard packing gauze is sufficient for most scenarios.",
      },
      {
        id: "a-tri-bandage",
        name: "Triangular Bandage / Cravat",
        qty: "× 2",
        section: "inside",
        group: "Trauma",
        expiry: "none",
        narUrl: "https://www.narescue.com/kit-triangular-bandage-odg.html",

        note: "Used for arm slings, improvised splint securing, and pressure bandaging.",
      },
      {
        id: "a-blanket",
        name: "Emergency Survival Blanket (Mylar)",
        qty: "× 2",
        section: "inside",
        group: "Trauma",
        expiry: "none",
        narUrl: "https://www.narescue.com/emergency-survival-wraps.html",
        note: "Retains up to 90% body heat. Use for shock management and hypothermia prevention.",
      },
      // Medical
      {
        id: "a-sam-splint",
        name: "SAM Splint — Moldable (36\")",
        qty: "× 2",
        section: "inside",
        group: "Medical",
        expiry: "none",
        walmartUrl: "https://www.walmart.com/search?q=sam+splint+36+inch+moldable+emergency",
        amazonUrl: "https://www.amazon.com/s?k=sam+splint+36+inch+moldable+aluminum+emergency",
        note: "Aluminum-core, foam-padded splint. Molds to any fracture site — arm, leg, ankle, wrist.",
      },
      {
        id: "a-ace-3",
        name: "ACE Elastic Bandage 3\"",
        qty: "× 2",
        section: "inside",
        group: "Medical",
        expiry: "none",
        cvsUrl: "https://www.cvs.com/search?searchTerm=ace+elastic+bandage+3+inch",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=ace+elastic+bandage+3+inch",
        walmartUrl: "https://www.walmart.com/search?q=ace+elastic+bandage+3+inch+compression",
        amazonUrl: "https://www.amazon.com/s?k=ace+elastic+bandage+3+inch+compression",
        note: "Wraps splints, secures dressings, compression for sprains. Reusable.",
      },
      {
        id: "a-ace-4",
        name: "ACE Elastic Bandage 4\"",
        qty: "× 2",
        section: "inside",
        group: "Medical",
        expiry: "none",
        cvsUrl: "https://www.cvs.com/search?searchTerm=ace+elastic+bandage+4+inch",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=ace+elastic+bandage+4+inch",
        walmartUrl: "https://www.walmart.com/search?q=ace+elastic+bandage+4+inch+compression",
        amazonUrl: "https://www.amazon.com/s?k=ace+elastic+bandage+4+inch+compression",
        note: "Larger bandage for thigh, knee, torso wrapping.",
      },
      {
        id: "a-coban",
        name: "Cohesive Elastic Bandage (Coban) 3\"",
        qty: "× 2",
        section: "inside",
        group: "Medical",
        expiry: "none",
        cvsUrl: "https://www.cvs.com/search?searchTerm=coban+cohesive+bandage+self+adherent",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=coban+self+adherent+wrap",
        walmartUrl: "https://www.walmart.com/search?q=coban+cohesive+bandage+3+inch+self+adherent",
        amazonUrl: "https://www.amazon.com/s?k=coban+cohesive+bandage+3+inch+self+adherent+wrap",
        note: "Self-adhering wrap — no clips needed. Use over dressings and around splints.",
      },
      {
        id: "a-steri-strips",
        name: "Steri-Strips / Butterfly Closure Strips",
        qty: "× 2 packs",
        section: "inside",
        group: "Medical",
        expiry: "5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=steri+strips+butterfly+closure+strips",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=steri+strips+butterfly+closure+strips",
        walmartUrl: "https://www.walmart.com/search?q=steri+strips+butterfly+closure+wound",
        amazonUrl: "https://www.amazon.com/s?k=steri+strips+butterfly+closure+strips+wound+closure",
        note: "For closing smaller lacerations that don't require sutures. Keep wound edges together.",
      },
      {
        id: "a-betadine",
        name: "Povidone-Iodine (Betadine) Antiseptic Swabs",
        qty: "× 1 pack (10+)",
        section: "inside",
        group: "Medical",
        expiry: "2-3yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=betadine+povidone+iodine+antiseptic",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=betadine+antiseptic+swabs",
        walmartUrl: "https://www.walmart.com/search?q=betadine+povidone+iodine+antiseptic+swabs",
        amazonUrl: "https://www.amazon.com/s?k=betadine+povidone+iodine+antiseptic+swabs+first+aid",
        note: "Broad-spectrum wound antiseptic. Use after initial irrigation before dressing.",
      },
      {
        id: "a-saline-wash",
        name: "Sterile Saline Wound Wash (250–500ml)",
        qty: "× 2",
        section: "inside",
        group: "Medical",
        expiry: "2-3yr",
        walmartUrl: "https://www.walmart.com/search?q=sterile+saline+wound+wash+sodium+chloride",
        amazonUrl: "https://www.amazon.com/s?k=sterile+saline+wound+wash+250ml+0.9+sodium+chloride",
        note: "Isotonic saline for wound irrigation. Do not use tap water — bacteria risk.",
      },
      {
        id: "a-tape-in",
        name: "NAR Surgical Tape",
        qty: "× 2 rolls",
        section: "inside",
        group: "Medical",
        expiry: "6mo-2yr",
        narUrl: "https://www.narescue.com/nar-surgical-tape-6-per-pack",
        cvsUrl: "https://www.cvs.com/search?searchTerm=medical+tape",
        amazonUrl: "https://www.amazon.com/s?k=medical+surgical+tape+first+aid+adhesive+roll",
        note: "Two rolls — secures dressings, labels, and improvised bandaging.",
      },

      // ── Optional (Advanced / Trained Use) ────────────────────────────────
      {
        id: "a-burn44",
        name: "BurnTec Burn Dressing 4×4\" (sterile gel)",
        qty: "× 2",
        section: "optional",
        expiry: "5yr",
        narUrl: "https://www.narescue.com/burntec-dressing.html",
        note: "Water-gel dressing that cools and soothes burn wounds. Do not use ice.",
      },
      {
        id: "a-burn22",
        name: "BurnTec Burn Dressing 2×2\" (sterile gel)",
        qty: "× 2",
        section: "optional",
        expiry: "5yr",
        narUrl: "https://www.narescue.com/burntec-dressing.html",
        note: "Smaller burn dressing for hands, face, and partial burns.",
      },
      {
        id: "a-npa",
        name: "Nasopharyngeal Airway (NPA) Set — 28–32Fr with Lube",
        qty: "× 1 set",
        section: "optional",
        expiry: "none",
        narUrl: "https://www.narescue.com/search?q=nasopharyngeal+airway",
        note: "TRAINED USE ONLY. Maintains airway in unconscious or seizing patient. Requires Stop the Bleed or EMT-level airway training.",
      },
      {
        id: "a-pulse-ox",
        name: "Pulse Oximeter — Fingertip",
        qty: "× 1",
        section: "optional",
        expiry: "none",
        walmartUrl: "https://www.walmart.com/search?q=fingertip+pulse+oximeter+SpO2+medical",
        amazonUrl: "https://www.amazon.com/s?k=pulse+oximeter+fingertip+medical+grade+SpO2",
        note: "Monitors blood oxygen saturation (SpO2) and pulse rate. Normal SpO2 is 95–100%. Under 90% is a medical emergency.",
      },
      {
        id: "a-bp-cuff",
        name: "Manual Blood Pressure Cuff + Stethoscope",
        qty: "× 1 set",
        section: "optional",
        expiry: "none",
        walmartUrl: "https://www.walmart.com/search?q=manual+blood+pressure+cuff+stethoscope+aneroid",
        amazonUrl: "https://www.amazon.com/s?k=manual+blood+pressure+cuff+stethoscope+aneroid+sphygmomanometer",
        note: "For ongoing patient assessment in prolonged care situations. Learn how to take BP before you need to.",
      },
      {
        id: "a-eye-wash",
        name: "Sterile Eye Wash / Saline Eye Irrigation (4 oz)",
        qty: "× 1",
        section: "optional",
        expiry: "2-3yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=sterile+eye+wash+saline+irrigation",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=sterile+eye+wash+saline+irrigation",
        walmartUrl: "https://www.walmart.com/search?q=sterile+eye+wash+saline+irrigation",
        amazonUrl: "https://www.amazon.com/s?k=sterile+eye+wash+saline+eye+irrigation+first+aid",
        note: "For chemical exposure, debris, or irritant in the eyes. Flush continuously for 15 minutes.",
      },
      {
        id: "a-ncd",
        name: "Chest Needle Decompression Kit — 14g × 3.25\" Needle (NCD Kit)",
        qty: "× 2",
        section: "optional",
        expiry: "3-5yr",
        narUrl: "https://www.narescue.com/search?q=needle+decompression",
        amazonUrl: "https://www.amazon.com/s?k=14g+3.25+needle+decompression+chest+trauma+kit",
        note: "TRAINED USE ONLY — TCCC or clinical certification required. Used to relieve tension pneumothorax (a collapsed, pressurized lung) — a life-threatening emergency caused by penetrating chest wounds or blunt trauma. Standard TCCC protocol: 2nd intercostal space, mid-clavicular line, dominant side. Two kits allow for bilateral treatment if both sides are compromised. Incorrect technique can puncture major vessels or worsen the injury. Do not purchase or carry this item unless you have completed TCCC, Wilderness First Responder (WFR), or equivalent clinical training.",
      },

      // ── Pills ziplock ─────────────────────────────────────────────────────
      {
        id: "a-aspirin",
        name: "Aspirin 325mg — Uncoated (cardiac emergency)",
        qty: "× 4 tablets",
        section: "pills",
        expiry: "4-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=aspirin+325mg+uncoated",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=aspirin+325mg+uncoated",
        walmartUrl: "https://www.walmart.com/search?q=aspirin+325mg+uncoated",
        amazonUrl: "https://www.amazon.com/s?k=aspirin+325mg+uncoated+tablets+full+strength",
        note: "For suspected heart attack — chew 1 full tablet (325mg) immediately if no aspirin allergy. Store labeled and separate.",
        alternative: "Aspirin allergy: Do NOT substitute ibuprofen during a cardiac event. Consult your physician in advance about alternatives (e.g., prescription Clopidogrel/Plavix). If aspirin-allergic, remove this item and attach a note to your pill bag.",
      },
      {
        id: "a-tylenol",
        name: "Tylenol Extra Strength 500mg (Acetaminophen)",
        qty: "× 6 tablets",
        section: "pills",
        expiry: "4-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=tylenol+extra+strength+500mg",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=tylenol+extra+strength+500mg",
        walmartUrl: "https://www.walmart.com/search?q=tylenol+extra+strength+500mg",
        amazonUrl: "https://www.amazon.com/s?k=tylenol+extra+strength+500mg+caplets+travel+pack",
        note: "Pain and fever relief. Max dose: 1000mg (2 tablets) every 6 hours. Do not exceed 3000mg/day.",
        alternative: "Liver condition or acetaminophen sensitivity: Use Ibuprofen 200mg instead. Do not combine Tylenol with alcohol or other acetaminophen-containing products.",
      },
      {
        id: "a-ibuprofen",
        name: "Ibuprofen 200mg — NSAID Anti-Inflammatory",
        qty: "× 6 packets",
        section: "pills",
        expiry: "4-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=ibuprofen+200mg",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=ibuprofen+200mg",
        walmartUrl: "https://www.walmart.com/search?q=ibuprofen+200mg+travel+packets",
        amazonUrl: "https://www.amazon.com/s?k=ibuprofen+200mg+single+dose+packets+travel",
        note: "Anti-inflammatory and pain relief. Max dose: 400–600mg every 6–8 hours with food. Do not give if suspected internal bleeding or kidney issues.",
        alternative: "NSAID allergy, GI sensitivity, or kidney concerns: Use Tylenol 500mg instead. Alternative NSAID: Naproxen (Aleve) 220mg, longer-acting but same cautions apply.",
      },
      {
        id: "a-diphen",
        name: "Diphenhydramine (Benadryl) 25mg — Antihistamine",
        qty: "× 4 tablets",
        section: "pills",
        expiry: "4-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=benadryl+diphenhydramine+25mg",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=benadryl+diphenhydramine+25mg",
        walmartUrl: "https://www.walmart.com/search?q=benadryl+diphenhydramine+25mg",
        amazonUrl: "https://www.amazon.com/s?k=diphenhydramine+25mg+antihistamine+individual+packets",
        note: "For allergic reactions, insect stings, mild anaphylaxis. Causes drowsiness. NOT a substitute for epinephrine in severe anaphylaxis.",
        alternative: "If drowsiness is a concern or Benadryl sensitivity: Non-drowsy alternatives — Cetirizine (Zyrtec) 10mg, Loratadine (Claritin) 10mg, or Fexofenadine (Allegra) 180mg. Note: non-drowsy options are slower-acting in acute reactions.",
      },
      {
        id: "a-imodium",
        name: "Loperamide (Imodium) 2mg — Anti-Diarrheal",
        qty: "× 4 tablets",
        section: "pills",
        expiry: "4-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=imodium+loperamide+2mg",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=imodium+loperamide+2mg",
        walmartUrl: "https://www.walmart.com/search?q=imodium+loperamide+2mg+anti-diarrheal",
        amazonUrl: "https://www.amazon.com/s?k=imodium+loperamide+2mg+anti+diarrheal+travel",
        note: "Critical in grid-down scenarios — severe diarrhea leads to fatal dehydration. Do not use if fever is present (possible bacterial infection).",
        alternative: "If Loperamide unavailable or contraindicated: Bismuth subsalicylate (Pepto-Bismol) — do NOT use if aspirin-allergic (contains salicylate). Both reduce symptoms differently. Oral rehydration salts are equally critical alongside either option.",
      },
      {
        id: "a-neosporin",
        name: "Neosporin Triple Antibiotic Ointment",
        qty: "× 1 tube + 4 packets",
        section: "pills",
        expiry: "2-3yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=neosporin+triple+antibiotic+ointment",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=neosporin+triple+antibiotic+ointment",
        walmartUrl: "https://www.walmart.com/search?q=neosporin+triple+antibiotic+ointment",
        amazonUrl: "https://www.amazon.com/s?k=neosporin+triple+antibiotic+ointment+packets+first+aid",
        note: "Apply to cleaned wounds before dressing to prevent bacterial infection.",
        alternative: "Neomycin allergy (common contact allergy in triple antibiotic ointments): Use Bacitracin-only ointment instead. Same application — do NOT use triple antibiotic if the patient has a known neomycin sensitivity.",
      },
      {
        id: "a-burn-pkt",
        name: "Burn Relief Gel Packets",
        qty: "× 4",
        section: "pills",
        expiry: "3-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=burn+relief+gel+first+aid",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=burn+relief+gel+packets",
        walmartUrl: "https://www.walmart.com/search?q=burn+relief+gel+packets+first+aid",
        amazonUrl: "https://www.amazon.com/s?k=burn+relief+gel+packets+single+use+first+aid",
        note: "Immediate topical cooling relief. Apply directly before burn dressings.",
        alternative: "If gel packets unavailable: Cool (not cold) running water for at least 20 minutes is the first-line burn treatment. Never use ice, butter, toothpaste, or oils — they worsen tissue damage.",
      },
      {
        id: "a-sting",
        name: "Sting Relief Pads (medicated — lidocaine/ammonia)",
        qty: "× 4",
        section: "pills",
        expiry: "4-5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=sting+relief+pads",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=sting+relief+pads",
        walmartUrl: "https://www.walmart.com/search?q=sting+relief+pads+after+bite",
        amazonUrl: "https://www.amazon.com/s?k=sting+relief+pads+medicated+after+bite+sting",
        note: "For insect stings and minor bites. Apply immediately after removing stinger.",
        alternative: "If sting pads unavailable: Hydrocortisone 1% cream reduces inflammation. For severe allergic reaction to stings — this is not sufficient; administer Benadryl and call 911.",
      },
      {
        id: "a-alka",
        name: "Alka-Seltzer Heartburn Relief",
        qty: "× 4",
        section: "pills",
        expiry: "5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=alka-seltzer+heartburn",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=alka-seltzer+heartburn+relief",
        walmartUrl: "https://www.walmart.com/search?q=alka-seltzer+heartburn+relief",
        amazonUrl: "https://www.amazon.com/s?k=alka-seltzer+heartburn+relief+individual+packets",
        note: "Sodium bicarbonate-based antacid for heartburn and indigestion.",
        alternative: "Alka-Seltzer Original contains aspirin — do NOT use if aspirin-allergic. Aspirin-free alternatives: TUMS (calcium carbonate) chewables, or Famotidine (Pepcid AC) 20mg for longer-lasting heartburn relief.",
      },

      // ── Personal Needs & Hydration ────────────────────────────────────────
      // Hot Emergencies
      {
        id: "a-liquid-iv",
        name: "Liquid IV Hydration Multiplier",
        qty: "× 6",
        section: "extra",
        group: "Hot Emergencies",
        expiry: "18-24mo",
        cvsUrl: "https://www.cvs.com/search?searchTerm=liquid+iv+hydration+multiplier",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=liquid+iv+hydration+multiplier",
        walmartUrl: "https://www.walmart.com/search?q=liquid+iv+hydration+multiplier+packets",
        amazonUrl: "https://www.amazon.com/s?k=liquid+iv+hydration+multiplier+electrolyte+packets",
        note: "Electrolyte-enhanced hydration. Critical for heat casualty, blood loss recovery, and dehydration. Mix with 16oz water.",
      },
      {
        id: "a-water-purif",
        name: "Water Purification Tablets (Potable Aqua)",
        qty: "× 1 bottle (50 tabs)",
        section: "extra",
        group: "Hot Emergencies",
        expiry: "4-5yr",
        walmartUrl: "https://www.walmart.com/search?q=potable+aqua+water+purification+tablets",
        amazonUrl: "https://www.amazon.com/s?k=potable+aqua+water+purification+tablets+iodine",
        note: "Each tablet purifies 1 liter of water in 30 minutes. For grid-down or disaster scenarios where tap water is unsafe. Iodine-based — avoid if thyroid condition.",
      },
      {
        id: "a-emergen-c",
        name: "Emergen-C 1000mg Vitamin C Powder",
        qty: "× 4",
        section: "extra",
        group: "Hot Emergencies",
        expiry: "2-3yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=emergen-c+vitamin+c+1000mg",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=emergen-c+1000mg+vitamin+c",
        walmartUrl: "https://www.walmart.com/search?q=emergen-c+1000mg+vitamin+c+packets",
        amazonUrl: "https://www.amazon.com/s?k=emergen-c+1000mg+vitamin+c+powder+packets",
        note: "Immune support and supplemental electrolytes during prolonged heat stress or illness.",
      },
      {
        id: "a-cooling-towel",
        name: "Instant Cooling Towel (evaporative)",
        qty: "× 2",
        section: "extra",
        group: "Hot Emergencies",
        expiry: "none",
        walmartUrl: "https://www.walmart.com/search?q=instant+cooling+towel+evaporative",
        amazonUrl: "https://www.amazon.com/s?k=instant+cooling+towel+evaporative+emergency+heat",
        note: "Wet, wring, snap to activate. For heat exhaustion and heat stroke — apply to neck, wrists, and armpits to reduce core temperature rapidly.",
      },
      // Cold Emergencies
      {
        id: "a-poncho",
        name: "Emergency Rain Poncho",
        qty: "× 2",
        section: "extra",
        group: "Cold Emergencies",
        expiry: "none",
        walmartUrl: "https://www.walmart.com/search?q=emergency+rain+poncho+compact",
        amazonUrl: "https://www.amazon.com/s?k=emergency+rain+poncho+compact+reusable",
        note: "Wind and rain barrier. Also functions as casualty ground cover and improvised shelter in wet environments.",
      },
      {
        id: "a-space-blanket",
        name: "Emergency Mylar Blanket (personal bag)",
        qty: "× 2",
        section: "extra",
        group: "Cold Emergencies",
        expiry: "none",
        walmartUrl: "https://www.walmart.com/search?q=emergency+mylar+space+blanket",
        amazonUrl: "https://www.amazon.com/s?k=emergency+mylar+space+blanket+compact+survival",
        note: "Dedicated cold-weather blankets for this bag — separate from the trauma blankets inside the main kit. For hypothermia prevention and wind block.",
      },
      {
        id: "a-hand-warmers",
        name: "Hand Warmers — Air-Activated (HeatMax or similar)",
        qty: "× 4 packs",
        section: "extra",
        group: "Cold Emergencies",
        expiry: "3-5yr",
        walmartUrl: "https://www.walmart.com/search?q=hand+warmers+air+activated+emergency",
        amazonUrl: "https://www.amazon.com/s?k=hand+warmers+air+activated+heatmax+emergency",
        note: "Air-activated, single-use, 8–12 hours of heat. For extremity warming in cold exposure and hypothermia prevention. Can also be placed under armpits for core warming.",
      },
      // Personal Care
      {
        id: "a-energy-bar",
        name: "Emergency Ration / Energy Bars (2400 cal)",
        qty: "× 2",
        section: "extra",
        group: "Personal Care",
        expiry: "5yr",
        walmartUrl: "https://www.walmart.com/search?q=emergency+ration+bars+2400+calorie",
        amazonUrl: "https://www.amazon.com/s?k=emergency+ration+bars+2400+calorie+survival",
        note: "5-year shelf-life caloric reserves. Not a meal replacement — for emergency caloric intake when no food is available.",
      },
      {
        id: "a-wipes",
        name: "Baby Wipes — Unscented (travel pack)",
        qty: "× 1 pack",
        section: "extra",
        group: "Personal Care",
        expiry: "2-3yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=baby+wipes+unscented+travel+pack",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=baby+wipes+unscented+travel+pack",
        walmartUrl: "https://www.walmart.com/search?q=baby+wipes+unscented+travel+pack",
        amazonUrl: "https://www.amazon.com/s?k=baby+wipes+unscented+travel+pack+hygiene",
        note: "For wound-area hygiene, patient cleanup, and general sanitation when water is unavailable.",
      },
      {
        id: "a-hand-sani",
        name: "Hand Sanitizer Packets (62% alcohol)",
        qty: "× 6",
        section: "extra",
        group: "Personal Care",
        expiry: "2-3yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=hand+sanitizer+single+use+packets",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=hand+sanitizer+single+use+packets",
        walmartUrl: "https://www.walmart.com/search?q=hand+sanitizer+single+use+packets",
        amazonUrl: "https://www.amazon.com/s?k=hand+sanitizer+single+use+packets+62+percent+alcohol",
        note: "Pre-treatment hygiene before gloving up, and responder hand decontamination after treatment.",
      },
      {
        id: "a-n95",
        name: "N95 Respirator Masks (NIOSH-approved)",
        qty: "× 2",
        section: "extra",
        group: "Personal Care",
        expiry: "none",
        walmartUrl: "https://www.walmart.com/search?q=n95+respirator+mask+niosh+approved",
        amazonUrl: "https://www.amazon.com/s?k=n95+respirator+mask+niosh+approved+first+aid",
        note: "For dust, smoke, and pathogen exposure. NIOSH-approved only — blue surgical masks do not filter fine particles.",
      },
      {
        id: "a-personal-meds",
        name: "Personal Medications — Separate Labeled Bag",
        qty: "as prescribed",
        section: "extra",
        group: "Personal Care",
        expiry: "none",
        note: "This is a placeholder — not a purchasable item. Any personal prescription medications (EpiPen, insulin, inhalers, heart medications, etc.) should be stored in their own clearly labeled separate bag inside this kit. Label the bag with: Medication name, Dose, Frequency, Prescribing physician, and Allergy information. Use a waterproof bag and laminate the label if possible.",
        alternative: "Recommendation: Use a small ziplock or medical pouch dedicated entirely to personal prescriptions. Store with a printed card listing all medications, known allergies, blood type, and emergency contact. This bag should be checked and refreshed every 30–90 days based on individual expiration dates.",
      },

      // ── Band-Aid ziplock (medium) ────────────────────────────────────────
      {
        id: "a-ba-alcohol",
        name: "Alcohol Prep Pads (sterile)",
        qty: "× 20",
        section: "bandaid",
        expiry: "1-2yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=alcohol+prep+pads",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=alcohol+prep+pads+sterile",
        walmartUrl: "https://www.walmart.com/search?q=alcohol+prep+pads+sterile",
        amazonUrl: "https://www.amazon.com/s?k=alcohol+prep+pads+sterile+200+count",
      },
      {
        id: "a-ba-one",
        name: "Bandages, All One Size",
        qty: "× 15",
        section: "bandaid",
        expiry: "5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=band-aid+all+one+size",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=band-aid+adhesive+bandages",
        walmartUrl: "https://www.walmart.com/search?q=band-aid+adhesive+bandages+one+size",
        amazonUrl: "https://www.amazon.com/s?k=band-aid+flexible+fabric+all+one+size+bandages",
      },
      {
        id: "a-ba-xl",
        name: "Bandages, Extra-Large",
        qty: "× 10",
        section: "bandaid",
        expiry: "5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=band-aid+extra+large",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=band-aid+extra+large",
        walmartUrl: "https://www.walmart.com/search?q=band-aid+extra+large+adhesive+bandages",
        amazonUrl: "https://www.amazon.com/s?k=band-aid+extra+large+adhesive+bandages",
      },
      {
        id: "a-ba-universal",
        name: "Bandages, Universal Sizes (assorted)",
        qty: "× assorted",
        section: "bandaid",
        expiry: "5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=band-aid+variety+pack",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=band-aid+variety+pack",
        walmartUrl: "https://www.walmart.com/search?q=band-aid+variety+pack+assorted",
        amazonUrl: "https://www.amazon.com/s?k=band-aid+variety+pack+assorted+sizes+universal",
      },
      {
        id: "a-ba-moleskin",
        name: "Moleskin — Pre-Cut Blister Pads",
        qty: "× 1 pack",
        section: "bandaid",
        expiry: "5yr",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=moleskin+blister+pads",
        walmartUrl: "https://www.walmart.com/search?q=moleskin+blister+pads",
        amazonUrl: "https://www.amazon.com/s?k=dr+scholl+moleskin+blister+prevention+pre+cut",
      },
      {
        id: "a-ba-gauze",
        name: "Gauze Pads (sterile) 2×2\" and 4×4\"",
        qty: "× 10 each",
        section: "bandaid",
        expiry: "none",
        cvsUrl: "https://www.cvs.com/search?searchTerm=sterile+gauze+pads",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=sterile+gauze+pads",
        walmartUrl: "https://www.walmart.com/search?q=sterile+gauze+pads+first+aid",
        amazonUrl: "https://www.amazon.com/s?k=sterile+gauze+pads+2x2+4x4+first+aid+combo",
      },
      {
        id: "a-ba-tegaderm",
        name: "Tegaderm Transparent Film Dressings",
        qty: "× 1 pack",
        section: "bandaid",
        expiry: "5yr",
        cvsUrl: "https://www.cvs.com/search?searchTerm=tegaderm+film+dressing",
        walgreensUrl: "https://www.walgreens.com/search/results.jsp?Ntt=tegaderm+transparent+film+dressing",
        walmartUrl: "https://www.walmart.com/search?q=tegaderm+transparent+film+dressing",
        amazonUrl: "https://www.amazon.com/s?k=tegaderm+transparent+film+dressing+3m+wound",
        note: "Waterproof, breathable film for minor wounds and IV site coverage. Good for extended-duration wound care.",
      },
    ],
  },
};

// ─── Section ordering per tier ────────────────────────────────────────────────

const SECTION_ORDER: Record<string, SectionKey[]> = {
  basic:    ["cvs-checklist", "supplement", "pills"],
  medium:   ["outside", "inside", "optional", "pills", "extra", "bandaid"],
  advanced: ["outside", "inside", "optional", "pills", "extra", "bandaid"],
};

const TIER_TAB: Record<string, string> = {
  basic:    "bg-secondary text-gray-100 border-border",
  medium:   "bg-blue-900/50 text-blue-100 border-blue-800/60",
  advanced: "bg-green-900/50 text-green-100 border-green-800/60",
};

const TIER_ORDER = ["basic", "medium", "advanced"];

// ─── Download helpers ──────────────────────────────────────────────────────────

const CF_FOOTER = `
${"=".repeat(60)}
CONCEALED FLORIDA — ConcealedFlorida.com
We are ready. We are watching. We are hiding in plain sight. We are Concealed Florida.
Template Version 1.0
${"=".repeat(60)}`;

function generateChecklistTxt(kit: KitTier): string {
  const line = "=".repeat(60);
  const thin = "-".repeat(60);
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  let out = `${line}\nCONCEALED FLORIDA — ${kit.label}\n${kit.subtitle} — Kit Checklist\n${line}\n\nDate: ${date}\nKit Owner: ___________\nLast Checked: ___________\nNext Check Due: ___________\n\n`;
  for (const sk of SECTION_ORDER[kit.tier] ?? []) {
    const items = kit.items.filter(i => i.section === sk);
    if (!items.length) continue;
    const label = kit.sectionOverrideLabels?.[sk] ?? SECTION_LABEL[sk];
    out += `${thin}\n${label.toUpperCase()}\n${thin}\n\n`;
    for (const item of items) {
      out += `[ ] ${item.name}  ${item.qty}\n`;
      out += `    Expiry: ${EXPIRY[item.expiry].label}\n`;
      if (item.expiry !== "none") out += `    My Exp Date: ___________\n`;
      out += "\n";
    }
  }
  out += CF_FOOTER;
  return out;
}

function generateChecklistCsv(kit: KitTier): string {
  let csv = '"Section","Item","Quantity","Expiry","My Expiration Date","Owned (Y/N)"\n';
  for (const sk of SECTION_ORDER[kit.tier] ?? []) {
    const items = kit.items.filter(i => i.section === sk);
    if (!items.length) continue;
    const label = kit.sectionOverrideLabels?.[sk] ?? SECTION_LABEL[sk];
    for (const item of items) {
      const exp = EXPIRY[item.expiry].label;
      csv += `"${label}","${item.name.replace(/"/g, '""')}","${item.qty}","${exp}","",""\n`;
    }
  }
  csv += `\n"","CONCEALED FLORIDA — ConcealedFlorida.com","","","",""\n`;
  csv += `"","We are ready. We are watching. We are hiding in plain sight. We are Concealed Florida.","","","",""\n`;
  return csv;
}

function downloadKitAsTxt(kit: KitTier) {
  const blob = new Blob([generateChecklistTxt(kit)], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `CF_${kit.label.replace(/[^a-z0-9]+/gi, "_")}_Checklist.txt`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function downloadKitAsWord(kit: KitTier) {
  const raw = generateChecklistTxt(kit);
  const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = `<html><head><meta charset="utf-8"><title>${kit.label} Checklist</title></head><body style="font-family:Arial,sans-serif;max-width:800px;margin:20px auto;line-height:1.7;white-space:pre-wrap;font-size:12pt">${escaped}</body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `CF_${kit.label.replace(/[^a-z0-9]+/gi, "_")}_Checklist.doc`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function downloadKitAsExcel(kit: KitTier) {
  const blob = new Blob([generateChecklistCsv(kit)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `CF_${kit.label.replace(/[^a-z0-9]+/gi, "_")}_Checklist.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function printKitAsPdf(kit: KitTier) {
  const raw = generateChecklistTxt(kit);
  const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<html><head><title>${kit.label} Checklist — Concealed Florida</title><style>body{font-family:monospace;font-size:11pt;white-space:pre-wrap;margin:24px;line-height:1.6}@media print{body{margin:12px}}</style></head><body>${escaped}</body></html>`);
  w.document.close(); w.focus(); setTimeout(() => { w.print(); }, 400);
}

function KitDownloadMenu({ kit }: { kit: KitTier }) {
  return (
    <div className="relative group" data-testid="kit-download-menu">
      <Button variant="secondary" size="sm" className="flex items-center gap-2">
        <Download className="w-3.5 h-3.5" />
        Download Checklist
      </Button>
      <div className="absolute right-0 top-full mt-1 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-150">
        <button onClick={() => downloadKitAsTxt(kit)} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" data-testid="kit-download-txt">
          <FileText className="w-3.5 h-3.5 shrink-0" /> TXT File
        </button>
        <button onClick={() => downloadKitAsWord(kit)} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" data-testid="kit-download-word">
          <FileText className="w-3.5 h-3.5 shrink-0" /> Word (.doc)
        </button>
        <button onClick={() => downloadKitAsExcel(kit)} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" data-testid="kit-download-excel">
          <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" /> Excel (.csv)
        </button>
        <button onClick={() => printKitAsPdf(kit)} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" data-testid="kit-download-pdf">
          <Printer className="w-3.5 h-3.5 shrink-0" /> PDF / Print
        </button>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MedKitPage() {
  const params = useParams<{ tier: string }>();
  const [, navigate] = useLocation();
  const tier = params.tier as string;
  const kit = KITS[tier];

  const [owned, setOwned] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(`medkit-owned-${tier}`);
      return new Set(stored ? JSON.parse(stored) : []);
    } catch { return new Set(); }
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`medkit-owned-${tier}`);
      setOwned(new Set(stored ? JSON.parse(stored) : []));
    } catch { setOwned(new Set()); }
  }, [tier]);

  if (!kit) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
          <p className="text-gray-400">Kit not found.</p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate("/first-aid")}>
            Back to First Aid
          </Button>
        </div>
      </Layout>
    );
  }

  const toggleOwned = (id: string) => {
    setOwned(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem(`medkit-owned-${tier}`, JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const totalItems = kit.items.length;
  const ownedCount = kit.items.filter(i => owned.has(i.id)).length;
  const progress = totalItems > 0 ? Math.round((ownedCount / totalItems) * 100) : 0;

  const sections = SECTION_ORDER[tier] || [];
  const currentIdx = TIER_ORDER.indexOf(tier);
  const prevTier = currentIdx > 0 ? TIER_ORDER[currentIdx - 1] : null;
  const nextTier = currentIdx < TIER_ORDER.length - 1 ? TIER_ORDER[currentIdx + 1] : null;

  const handlePrint = () => window.print();

  const renderItem = (item: KitItem) => {
    const isOwned = owned.has(item.id);
    const exp = EXPIRY[item.expiry];
    return (
      <div
        key={item.id}
        className={`bg-secondary border rounded-md p-4 transition-colors ${
          isOwned ? "border-green-800/50" : item.optional ? "border-border/50 opacity-80" : "border-border"
        }`}
        data-testid={`item-${item.id}`}
      >
        <div className="flex flex-wrap items-start gap-3">
          {/* Owned toggle */}
          <button
            onClick={() => toggleOwned(item.id)}
            data-testid={`toggle-${item.id}`}
            className="mt-0.5 shrink-0 text-gray-500 hover:text-green-400 transition-colors"
            aria-label={isOwned ? "Mark as not owned" : "Mark as owned"}
          >
            {isOwned
              ? <CheckSquare className="w-5 h-5 text-green-400" />
              : <Square className="w-5 h-5" />
            }
          </button>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
              <span className={`font-semibold text-base leading-snug ${isOwned ? "text-gray-400 line-through" : "text-white"}`}>
                {item.name}
              </span>
              <span className="text-gray-300 text-sm shrink-0">{item.qty}</span>
              {item.optional && (
                <Badge variant="secondary" className="text-xs shrink-0">Optional</Badge>
              )}
            </div>
            {/* Expiry */}
            <span className={`flex items-center gap-1.5 text-xs ${exp.textColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${exp.dotColor} shrink-0`} />
              {exp.label}
            </span>
            {item.note && (
              <p className="text-gray-300 text-xs mt-1.5 leading-relaxed">{item.note}</p>
            )}
            {item.alternative && (
              <div className="flex gap-1.5 items-start mt-2 bg-blue-950/30 border border-blue-800/30 rounded px-2.5 py-2">
                <Info className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                <p className="text-blue-200/80 text-xs leading-relaxed">{item.alternative}</p>
              </div>
            )}
          </div>

          {/* Buy buttons */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {item.narUrl && (
              <Button variant="secondary" size="sm" asChild data-testid={`nar-${item.id}`}>
                <a href={item.narUrl} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  NAR
                </a>
              </Button>
            )}
            {item.cvsUrl && (
              <Button variant="secondary" size="sm" asChild data-testid={`cvs-${item.id}`}>
                <a href={item.cvsUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  CVS
                </a>
              </Button>
            )}
            {item.walgreensUrl && (
              <Button variant="secondary" size="sm" asChild data-testid={`wag-${item.id}`}>
                <a href={item.walgreensUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Walgreens
                </a>
              </Button>
            )}
            {item.walmartUrl && (
              <Button variant="secondary" size="sm" asChild data-testid={`wmt-${item.id}`}>
                <a href={item.walmartUrl} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Walmart
                </a>
              </Button>
            )}
            {item.amazonUrl && (
              <Button variant="secondary" size="sm" asChild data-testid={`amz-${item.id}`}>
                <a href={item.amazonUrl} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Amazon
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <SEOHead
        title={`${kit.label} — ${kit.subtitle} | Medical Kit Builder | Concealed Florida`}
        description={kit.concept.slice(0, 155)}
        path={`/first-aid/kit/${tier}`}
      />

      {/* Print styles — only applied during window.print() */}
      <style>{`
        @media print {
          .screen-only { display: none !important; }
          .print-only  { display: block !important; }
          body { background: white !important; color: black !important; font-family: Arial, sans-serif; font-size: 12pt; }
          .print-checklist { padding: 24px; }
          .print-checklist h1 { font-size: 18pt; font-weight: bold; margin-bottom: 4px; }
          .print-checklist h2 { font-size: 10pt; font-weight: normal; margin-bottom: 16px; color: #555; }
          .print-section-title { font-size: 11pt; font-weight: bold; border-bottom: 1px solid #000; margin: 16px 0 8px; padding-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
          .print-item { display: flex; align-items: flex-start; gap: 8px; margin: 6px 0; font-size: 11pt; }
          .print-checkbox { width: 14px; height: 14px; border: 1px solid #000; display: inline-block; flex-shrink: 0; margin-top: 2px; }
          .print-item-name { flex: 1; }
          .print-item-qty  { white-space: nowrap; font-size: 10pt; color: #555; margin-left: 4px; }
          .print-item-exp  { white-space: nowrap; font-size: 10pt; color: #555; margin-left: 8px; }
          .print-exp-line  { white-space: nowrap; font-size: 10pt; border-bottom: 1px solid #aaa; display: inline-block; min-width: 100px; }
          .print-footer { margin-top: 32px; font-size: 10pt; border-top: 1px solid #000; padding-top: 12px; }
          .print-nameplate { border: 1px solid #000; margin: 16px 0; padding: 12px; page-break-inside: avoid; }
          .print-nameplate-title { font-weight: bold; font-size: 10pt; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
          .print-nameplate-row { display: flex; gap: 8px; margin: 6px 0; font-size: 10pt; }
          .print-nameplate-label { font-weight: bold; white-space: nowrap; }
          .print-nameplate-blank { flex: 1; border-bottom: 1px solid #555; }
        }
        @media screen { .print-only { display: none !important; } }
      `}</style>

      {/* ── Print-only checklist view ── */}
      <div className="print-only print-checklist">
        <h1>Concealed Florida — {kit.label}</h1>
        <h2>{kit.subtitle} · Inspection Checklist</h2>

        {sections.map(sectionKey => {
          const items = kit.items.filter(i => i.section === sectionKey);
          if (!items.length) return null;
          return (
            <div key={sectionKey}>
              <div className="print-section-title">{kit.sectionOverrideLabels?.[sectionKey] ?? SECTION_LABEL[sectionKey]}</div>
              {items.map(item => (
                <div key={item.id} className="print-item">
                  <span className="print-checkbox" />
                  <span className="print-item-name">{item.name}</span>
                  <span className="print-item-qty">{item.qty}</span>
                  {item.expiry !== "none" && (
                    <span className="print-item-exp">
                      Exp: <span className="print-exp-line">&nbsp;</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          );
        })}

        {/* Pill bag name plate */}
        <div className="print-nameplate">
          <div className="print-nameplate-title">Pill Bag Name Plate — Print &amp; Laminate</div>
          {["KIT OWNER", "PRODUCT", "EXPIRATION DATE", "CONTENTS"].map(label => (
            <div key={label} className="print-nameplate-row">
              <span className="print-nameplate-label">{label}:</span>
              <span className="print-nameplate-blank">&nbsp;</span>
            </div>
          ))}
        </div>

        <div className="print-footer">
          <span>Last checked: <span className="print-exp-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span>Next check due: <span className="print-exp-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
          <br /><br />
          <span style={{ fontSize: "9pt", color: "#777" }}>CONCEALED FLORIDA — ConcealedFlorida.com · We are ready. We are watching. We are hiding in plain sight. We are Concealed Florida.</span>
        </div>
      </div>

      {/* ── Screen view ── */}
      <Layout>
        <div className="screen-only container mx-auto px-4 py-12 max-w-5xl">

          {/* Back + Video Resources */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/first-aid")}
              data-testid="button-back-first-aid"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              First Aid & Skills
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/first-aid/videos")}
              data-testid="button-video-resources-medkit"
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Video Resources
            </Button>
          </div>

          {/* Tier tabs */}
          <div className="flex items-center gap-2 mb-7 flex-wrap">
            {TIER_ORDER.map(t => (
              <button
                key={t}
                data-testid={`tab-kit-${t}`}
                onClick={() => navigate(`/first-aid/kit/${t}`)}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize transition-colors border ${
                  t === tier ? TIER_TAB[t] : "bg-transparent border-border text-gray-400 hover:text-gray-200"
                }`}
              >
                {KITS[t].label}
              </button>
            ))}
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-1" data-testid={`heading-kit-${tier}`}>
              {kit.label}
            </h1>
            <p className="text-gray-400 text-base font-medium mb-3">{kit.subtitle}</p>
            <p className="text-gray-300 text-base leading-relaxed max-w-3xl">{kit.concept}</p>
          </div>

          {/* Stats + progress bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-secondary border border-border rounded-md p-4">
              <p className="text-gray-200 text-xs font-semibold uppercase tracking-wide mb-1">Items</p>
              <p className="text-white text-2xl font-bold">{totalItems}</p>
            </div>
            <div className="bg-secondary border border-border rounded-md p-4">
              <p className="text-gray-200 text-xs font-semibold uppercase tracking-wide mb-1">Est. Total</p>
              <p className="text-white text-2xl font-bold">${kit.totalLow}–${kit.totalHigh}</p>
            </div>
            <div className="bg-secondary border border-border rounded-md p-4">
              <p className="text-gray-200 text-xs font-semibold uppercase tracking-wide mb-1">Designed For</p>
              <p className="text-gray-100 text-sm leading-snug">{kit.forWho}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-secondary border border-border rounded-md p-4 mb-4">
            <div className="flex items-center justify-between mb-2 gap-4 flex-wrap">
              <p className="text-gray-200 text-sm font-medium">
                Kit Progress: <span className="text-white font-bold">{ownedCount}</span>
                <span className="text-gray-300"> / {totalItems} items owned</span>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{progress}%</span>
                <KitDownloadMenu kit={kit} />
              </div>
            </div>
            <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: progress === 100 ? "#22c55e" : progress >= 50 ? "#eab308" : "#3b82f6",
                }}
              />
            </div>
          </div>

          {/* Expiry legend */}
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Expiry:</span>
            {(["none","5yr","1-2yr","6mo-2yr"] as ExpiryKey[]).map(k => (
              <span key={k} className="flex items-center gap-1.5 text-xs">
                <span className={`w-2 h-2 rounded-full ${EXPIRY[k].dotColor}`} />
                <span className={EXPIRY[k].textColor}>{EXPIRY[k].label}</span>
              </span>
            ))}
          </div>

          {/* Assembly video placeholder */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-3">Assembly Tutorial</h2>
            <div
              className="w-full rounded-md border border-border bg-secondary flex flex-col items-center justify-center gap-4"
              style={{ aspectRatio: "16/9", maxHeight: "400px" }}
              data-testid={`placeholder-video-kit-${tier}`}
            >
              <div className="w-14 h-14 rounded-full border-2 border-border flex items-center justify-center">
                <Play className="w-6 h-6 text-gray-500 ml-0.5" />
              </div>
              <div className="text-center">
                <p className="text-gray-200 text-sm font-medium">{kit.label} — How to Assemble Your Kit</p>
                <p className="text-gray-400 text-xs mt-1">Video coming soon</p>
              </div>
            </div>
          </div>

          {/* CTA to First Aid Videos */}
          <a
            href={`/first-aid/videos#kit-${tier}`}
            className="group block w-full mb-10 border border-red-900/40 bg-red-900/10 rounded-md p-5 text-center hover-elevate active-elevate-2 transition-colors"
            data-testid={`button-first-aid-videos-${tier}`}
          >
            <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">First Aid Video Resources</p>
            <p className="text-white font-bold text-base">More Videos for This Kit</p>
            <p className="text-gray-400 text-xs mt-1">Browse curated assembly and technique videos for the {kit.label}</p>
            <div className="mt-3 flex items-center justify-center gap-2 text-red-400 text-sm font-semibold">
              <Play className="w-4 h-4" />
              View Videos
            </div>
          </a>

          {/* Recommended Bags */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-3">Recommended Bags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kit.bags.map((bag, i) => (
                <div
                  key={i}
                  className="bg-secondary border border-border rounded-md p-5"
                  data-testid={`bag-${tier}-${i}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white font-bold leading-tight">{bag.name}</p>
                        {bag.primary && <Badge variant="secondary" className="text-xs">Recommended</Badge>}
                      </div>
                      <p className="text-gray-300 text-xs">{bag.brand}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap shrink-0">
                      {bag.brandUrl && (
                        <Button variant="secondary" size="sm" asChild>
                          <a href={bag.brandUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                            Brand Site
                          </a>
                        </Button>
                      )}
                      {bag.amazonUrl && (
                        <Button variant="secondary" size="sm" asChild>
                          <a href={bag.amazonUrl} target="_blank" rel="noopener noreferrer">
                            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                            Amazon
                          </a>
                        </Button>
                      )}
                      {bag.altUrls?.map(alt => (
                        <Button key={alt.name} variant="secondary" size="sm" asChild>
                          <a href={alt.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                            {alt.name}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-2">{bag.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-200 border-t border-border pt-2.5">
                    <span><span className="text-white font-medium">Size:</span> {bag.dimensions}</span>
                    <span><span className="text-white font-medium">Color:</span> {bag.color}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Item sections */}
          <div className="space-y-10 mb-10">
            <h2 className="text-xl font-bold text-white">Full Item List</h2>

            {sections.map(sectionKey => {
              const items = kit.items.filter(i => i.section === sectionKey);
              if (!items.length) return null;
              const zlOpt = SECTION_ZIPLOCK[sectionKey];
              const ownedInSection = items.filter(i => owned.has(i.id)).length;

              const sectionNote = kit.sectionNotes?.[sectionKey];
              const groups: string[] = items.reduce((acc: string[], item) => {
                const g = item.group ?? "";
                if (!acc.includes(g)) acc.push(g);
                return acc;
              }, []);
              const hasGroups = groups.some(g => g !== "");

              return (
                <div key={sectionKey}>
                  {/* Section header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3 pb-2 border-b border-border">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-gray-100">{kit.sectionOverrideLabels?.[sectionKey] ?? SECTION_LABEL[sectionKey]}</h3>
                      <span className="text-gray-500 text-xs">{ownedInSection}/{items.length} owned</span>
                    </div>
                    {zlOpt && (
                      <div className="flex flex-col items-end gap-1.5">
                        <p className="text-orange-300 text-xs font-medium">{zlOpt.label}</p>
                        <p className="text-gray-400 text-xs max-w-xs text-right">{zlOpt.note}</p>
                        <div className="flex flex-wrap gap-1.5 justify-end mt-0.5">
                          {zlOpt.cvs && (
                            <Button variant="secondary" size="sm" asChild>
                              <a href={zlOpt.cvs} target="_blank" rel="noopener noreferrer">
                                <ShoppingCart className="w-3 h-3 mr-1" />CVS
                              </a>
                            </Button>
                          )}
                          {zlOpt.walgreens && (
                            <Button variant="secondary" size="sm" asChild>
                              <a href={zlOpt.walgreens} target="_blank" rel="noopener noreferrer">
                                <ShoppingCart className="w-3 h-3 mr-1" />Walgreens
                              </a>
                            </Button>
                          )}
                          {zlOpt.walmart && (
                            <Button variant="secondary" size="sm" asChild>
                              <a href={zlOpt.walmart} target="_blank" rel="noopener noreferrer">
                                <ShoppingCart className="w-3 h-3 mr-1" />Walmart
                              </a>
                            </Button>
                          )}
                          {zlOpt.amazon && (
                            <Button variant="secondary" size="sm" asChild>
                              <a href={zlOpt.amazon} target="_blank" rel="noopener noreferrer">
                                <ShoppingCart className="w-3 h-3 mr-1" />Amazon
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section note / disclaimer */}
                  {sectionNote && (
                    <div className="flex gap-2.5 items-start bg-yellow-950/30 border border-yellow-800/40 rounded-md p-3 mb-4">
                      <AlertCircle className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
                      <p className="text-yellow-200/80 text-xs leading-relaxed">{sectionNote}</p>
                    </div>
                  )}

                  {/* Items — optionally grouped */}
                  <div className="space-y-3">
                    {hasGroups ? (
                      groups.map(group => {
                        const groupItems = items.filter(i => (i.group ?? "") === group);
                        return (
                          <div key={group}>
                            {group && (
                              <div className="flex items-center gap-2 mt-5 mb-2">
                                <span className="text-xs font-bold text-gray-200 uppercase tracking-widest">{group}</span>
                                <div className="flex-1 h-px bg-border" />
                              </div>
                            )}
                            <div className="space-y-3">
                              {groupItems.map(item => renderItem(item))}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      items.map(item => renderItem(item))
                    )}
                  </div>

                  {/* Pill bag nameplate */}
                  {sectionKey === "pills" && (
                    <div className="mt-4 bg-secondary border border-dashed border-border rounded-md p-4">
                      <p className="text-gray-200 text-xs font-semibold uppercase tracking-wide mb-3">
                        Pill Bag Name Plate — Fill in &amp; Laminate
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {["Kit Owner", "Product", "Expiration Date", "Contents"].map(label => (
                          <div key={label} className="flex items-center gap-2">
                            <span className="text-gray-200 text-xs font-medium w-28 shrink-0">{label}:</span>
                            <div className="flex-1 border-b border-gray-500 h-4" />
                          </div>
                        ))}
                      </div>
                      <p className="text-gray-400 text-xs mt-3">
                        Use "Print Checklist" above to print a clean version for laminating.
                      </p>
                    </div>
                  )}

                  {/* Personal medications bag nameplate (advanced extra section) */}
                  {sectionKey === "extra" && tier === "advanced" && (
                    <div className="mt-6 bg-secondary border border-dashed border-border rounded-md p-4">
                      <p className="text-gray-200 text-xs font-semibold uppercase tracking-wide mb-1">
                        Personal Medications Bag Label — Fill in &amp; Laminate
                      </p>
                      <p className="text-gray-300 text-xs mb-4 leading-relaxed">
                        Keep a laminated label on your personal prescription bag. Update every time medications change.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          "Name",
                          "Blood Type",
                          "Known Allergies",
                          "Medication 1",
                          "Medication 2",
                          "Medication 3",
                          "Prescribing Physician",
                          "Emergency Contact",
                        ].map(label => (
                          <div key={label} className="flex items-center gap-2">
                            <span className="text-gray-200 text-xs font-medium w-36 shrink-0">{label}:</span>
                            <div className="flex-1 border-b border-gray-500 h-4" />
                          </div>
                        ))}
                      </div>
                      <p className="text-gray-400 text-xs mt-3">
                        Use "Print Checklist" above to print a clean version for laminating.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Resources footer */}
          <div className="bg-secondary border border-border rounded-md p-5 mb-6">
            <p className="text-gray-300 text-sm font-semibold mb-3">Training Resources</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Stop the Bleed", url: "https://www.stopthebleed.org" },
                { label: "Red Cross CPR", url: "https://www.redcross.org/take-a-class" },
                { label: "PrepMedic (YouTube)", url: "https://www.youtube.com/@PrepMedic" },
                { label: "EMS Crash Course (Kieran's)", url: "https://www.youtube.com/results?search_query=masters+of+disasters+kieran+EMS" },
              ].map(r => (
                <Button key={r.label} variant="secondary" size="sm" asChild>
                  <a href={r.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1.5" />
                    {r.label}
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Tier nav */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div>
              {prevTier && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/first-aid/kit/${prevTier}`)}
                  data-testid="button-prev-tier"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {KITS[prevTier].label}
                </Button>
              )}
            </div>
            <div>
              {nextTier && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/first-aid/kit/${nextTier}`)}
                  data-testid="button-next-tier"
                  className="flex items-center gap-2"
                >
                  {KITS[nextTier].label}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-secondary border border-border rounded-md p-4 flex gap-3 items-start">
            <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            <p className="text-gray-500 text-sm">
              Concealed Florida does not receive compensation from any vendor listed here. All links are for your convenience. Buy only authentic, manufacturer-direct products for trauma items — counterfeit tourniquets and gauze have caused preventable deaths. Complete a Stop the Bleed course and CPR certification before depending on this kit. Consult a physician before beginning any medication regimen.
            </p>
          </div>

        </div>
      </Layout>
    </>
  );
}
