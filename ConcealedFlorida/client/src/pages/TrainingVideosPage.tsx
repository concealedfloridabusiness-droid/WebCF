import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Play, Shield, Home, Package, Target, Crosshair,
  Activity, Dumbbell, Timer, Move, Hand, Scale, Brain, ChevronDown
} from "lucide-react";

const FIREARM_SECTIONS = [
  {
    id: "concealed-carry",
    title: "Concealed Carry Training",
    icon: Shield,
    color: "text-amber-400",
    videos: [
      { title: "Florida CWL Application Walkthrough" },
      { title: "Concealed Draw from Holster — Fundamentals" },
      { title: "Legal Considerations for Concealed Carriers" },
    ],
  },
  {
    id: "home-defense",
    title: "Home Defense Training",
    icon: Home,
    color: "text-blue-400",
    videos: [
      { title: "Home Defense Shotgun vs. Pistol — Comparison" },
      { title: "Clearing Rooms Safely — Fundamentals" },
      { title: "Night Stand Setup and Access Under Stress" },
    ],
  },
  {
    id: "edc",
    title: "EDC Training",
    icon: Package,
    color: "text-green-400",
    videos: [
      { title: "Choosing Your EDC Loadout" },
      { title: "Reholstering Safely — Common Mistakes" },
      { title: "EDC Under Clothing — Concealment Considerations" },
    ],
  },
  {
    id: "dry-fire",
    title: "Dry Fire Practice",
    icon: Target,
    color: "text-purple-400",
    videos: [
      { title: "Dry Fire Safety Setup — Non-Negotiables" },
      { title: "Trigger Reset and Reset Drills" },
      { title: "Dry Fire Draw Stroke — 10-Minute Daily Routine" },
    ],
  },
  {
    id: "pistol",
    title: "Pistol Fundamentals",
    icon: Crosshair,
    color: "text-red-400",
    videos: [
      { title: "Grip Fundamentals — High and Tight" },
      { title: "Sight Alignment vs. Sight Picture" },
      { title: "Trigger Control — Breaking the Shot Clean" },
    ],
  },
];

const FITNESS_SECTIONS = [
  { id: "fitness-1", title: "Cardio Endurance",     icon: Activity,  color: "text-red-400"    },
  { id: "fitness-2", title: "Muscular Strength",     icon: Dumbbell,  color: "text-orange-400" },
  { id: "fitness-3", title: "Muscular Endurance",    icon: Timer,     color: "text-yellow-400" },
  { id: "fitness-4", title: "Flexibility",           icon: Move,      color: "text-green-400"  },
  { id: "fitness-5", title: "Grip Strength",         icon: Hand,      color: "text-cyan-400"   },
  { id: "fitness-6", title: "Body Composition",      icon: Scale,     color: "text-blue-400"   },
  { id: "fitness-7", title: "Neuromotor Fitness",    icon: Brain,     color: "text-purple-400" },
];

const FITNESS_VIDEOS: Record<string, { title: string }[]> = {
  "fitness-1": [
    { title: "2-Mile Run — Pacing Strategy for Beginners" },
    { title: "Zone 2 Cardio — Why It Matters for Preparedness" },
    { title: "Ruck Training — Starting Your First Loaded Ruck" },
  ],
  "fitness-2": [
    { title: "Deadlift Form — Building a Safe Foundation" },
    { title: "Overhead Press — Full Body Tension Technique" },
    { title: "Pull-Up Progression — Zero to Ten in 8 Weeks" },
  ],
  "fitness-3": [
    { title: "Push-Up Test Prep — Max Reps Protocol" },
    { title: "Sit-Up Endurance — Building Core Stamina" },
    { title: "Air Squat Endurance — High-Rep Lower Body Work" },
  ],
  "fitness-4": [
    { title: "Hip Flexor Mobility — Key for Carrier and Runner" },
    { title: "Thoracic Spine Mobility — Desk Worker Reset" },
    { title: "Daily Flexibility Routine — 10 Minutes Morning" },
  ],
  "fitness-5": [
    { title: "Farmers Carry — Building Functional Grip Strength" },
    { title: "Dead Hang — Shoulder and Grip Development" },
    { title: "Crush Grip vs. Support Grip — Training Both" },
  ],
  "fitness-6": [
    { title: "Body Fat Percentage — What It Is and Why It Matters" },
    { title: "Cutting vs. Bulking — Basics for Fitness Standards" },
    { title: "Nutrition Basics — Protein, Carbs, and Fat Explained" },
  ],
  "fitness-7": [
    { title: "Balance Training — Single-Leg Progressions" },
    { title: "Agility Ladder — Foot Speed and Coordination" },
    { title: "Reaction Drills — Training the Nervous System" },
  ],
};

function PlaceholderVideoCard({ title }: { title: string }) {
  return (
    <Card className="bg-secondary border-secondary overflow-hidden">
      <div className="relative bg-black/50 border-b border-border" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center">
            <Play className="w-4 h-4 text-white/30 ml-0.5" />
          </div>
        </div>
      </div>
      <CardContent className="pt-3 pb-4 px-3">
        <p className="text-white/50 text-sm font-medium leading-snug line-clamp-2">{title}</p>
        <p className="text-gray-600 text-xs mt-1">Coming soon</p>
      </CardContent>
    </Card>
  );
}

interface SplitNavButtonProps {
  label: string;
  mainPath: string;
  items: { label: string; path: string }[];
  navigate: (to: string) => void;
  testId: string;
}

function SplitNavButton({ label, mainPath, items, navigate, testId }: SplitNavButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative flex items-center" ref={ref}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => navigate(mainPath)}
        className="flex items-center gap-2 rounded-r-none border-r border-gray-700"
        data-testid={testId}
      >
        <ArrowLeft className="w-4 h-4" />
        {label}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className="rounded-l-none px-2"
        data-testid={`${testId}-chevron`}
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </Button>
      <div
        className={`absolute top-full left-0 mt-1 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 transition-all duration-100 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {items.map((item) => (
          <button
            key={item.path}
            className="flex items-center w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left"
            onClick={() => { navigate(item.path); setOpen(false); }}
            data-testid={`${testId}-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TrainingVideosPage() {
  const [, navigate] = useLocation();

  return (
    <>
      <SEOHead
        title="Training Video Resources | Concealed Florida"
        description="Curated video resources for firearm training and physical fitness — concealed carry, home defense, cardio, strength, and more."
        path="/training/videos"
      />
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/training/firearm")}
              className="flex items-center gap-2"
              data-testid="button-back-firearm-training"
            >
              <ArrowLeft className="w-4 h-4" />
              Firearm Training
            </Button>
            <SplitNavButton
              label="Fitness Standards"
              mainPath="/fitness"
              items={[
                { label: "Men's Fitness",   path: "/fitness/male"   },
                { label: "Women's Fitness", path: "/fitness/female" },
              ]}
              navigate={navigate}
              testId="button-back-fitness"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/we-are-watching/news")}
              className="flex items-center gap-2"
              data-testid="button-back-liberty-watch"
            >
              <ArrowLeft className="w-4 h-4" />
              Liberty Watch
            </Button>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" data-testid="heading-training-videos">
              Training Video Resources
            </h1>
            <p className="text-gray-400 text-base max-w-2xl">
              Curated video content for firearm training and physical fitness standards. Content added as it's vetted — no paid promotion.
            </p>
          </div>

          {/* Firearm Training */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-0.5 w-6 rounded-full bg-amber-400" />
              <h2 className="text-2xl font-extrabold uppercase tracking-wide text-amber-400">Firearm Training</h2>
            </div>
            <p className="text-gray-500 text-sm mb-8 ml-9">Concealed carry, home defense, EDC, dry fire, and pistol fundamentals.</p>

            {FIREARM_SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <section key={section.id} id={section.id} className="mb-12 scroll-mt-24" data-testid={`section-videos-${section.id}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <Icon className={`w-5 h-5 ${section.color} shrink-0`} />
                    <h3 className={`text-xl font-bold ${section.color}`}>{section.title}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {section.videos.map((video, i) => (
                      <PlaceholderVideoCard key={i} title={video.title} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Fitness Standards */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-0.5 w-6 rounded-full bg-green-400" />
              <h2 className="text-2xl font-extrabold uppercase tracking-wide text-green-400">Fitness Standards</h2>
            </div>
            <p className="text-gray-500 text-sm mb-8 ml-9">Cardio, strength, endurance, flexibility, grip, body composition, and neuromotor fitness.</p>

            {FITNESS_SECTIONS.map((section) => {
              const Icon = section.icon;
              const videos = FITNESS_VIDEOS[section.id] ?? [];
              return (
                <section key={section.id} id={section.id} className="mb-12 scroll-mt-24" data-testid={`section-videos-${section.id}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <Icon className={`w-5 h-5 ${section.color} shrink-0`} />
                    <h3 className={`text-xl font-bold ${section.color}`}>{section.title}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {videos.map((video, i) => (
                      <PlaceholderVideoCard key={i} title={video.title} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="border-t border-gray-800 pt-8 mt-4">
            <p className="text-gray-600 text-xs text-center">
              All video recommendations are curated independently. No paid promotion.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}
