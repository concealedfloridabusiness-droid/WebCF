export type AgeKey = "u13" | "teen" | "young" | "adult" | "senior";

export interface CategoryRow {
  cardio: string;
  strength: string;
  endurance: string;
  flexibility: string;
  grip: string;
  bodyFat: string;
  neuromotor: string;
}

export const ageGroups: { key: AgeKey; label: string }[] = [
  { key: "u13", label: "Under 13" },
  { key: "teen", label: "13–17" },
  { key: "young", label: "18–25" },
  { key: "adult", label: "26–39" },
  { key: "senior", label: "40+" },
];

export const categoryKeys: (keyof CategoryRow)[] = [
  "cardio",
  "strength",
  "endurance",
  "flexibility",
  "grip",
  "bodyFat",
  "neuromotor",
];

export const fitnessCategories = [
  {
    num: 1,
    key: "cardio" as keyof CategoryRow,
    name: "Cardio Endurance",
    test: "12-Min Cooper Run (miles)",
    why: "Heart health, lifespan",
    howToTest: "On a flat track or measured course, run as far as possible in exactly 12 minutes. Distance is recorded in miles. This is the standard Cooper Test used globally to estimate VO₂ max — your body's ability to use oxygen under sustained effort.",
    improve: [
      "Zone 2 cardio: 3–4× per week at a conversational pace for 30–45 min builds aerobic base.",
      "Interval training: 400m repeats at hard effort with 90-second rest between sets.",
      "Consistency over intensity: running 5 days/week at easy effort beats 1 hard session.",
      "Track progress monthly — small gains in distance compound quickly over time.",
    ],
  },
  {
    num: 2,
    key: "strength" as keyof CategoryRow,
    name: "Muscular Strength",
    test: "1-Rep Max Bench Press (× bodyweight)",
    why: "Functional strength",
    howToTest: "After a thorough warm-up, attempt progressively heavier bench press lifts with full range of motion (bar to chest, full lockout). The heaviest successful single rep is your 1RM. Divide by bodyweight to get your ratio. Always use a spotter.",
    improve: [
      "Progressive overload: add 2.5–5 lbs each session when you can complete all target reps.",
      "Prioritize compound movements: bench press, overhead press, and rows build the full upper body.",
      "Adequate protein: 0.7–1g per pound of bodyweight supports muscle repair.",
      "Rest: muscle grows during recovery, not during the workout. 48–72 hrs between chest sessions.",
    ],
  },
  {
    num: 3,
    key: "endurance" as keyof CategoryRow,
    name: "Muscular Endurance",
    test: "Max Push-Ups (unbroken) / Plank Hold (seconds)",
    why: "Daily carry capacity",
    howToTest: "Push-ups: perform as many consecutive repetitions as possible with full range of motion (chest near floor, arms fully extended). No rest at top. Plank: hold a forearm plank with straight spine and neutral hips as long as possible. Both are standard military fitness assessments.",
    improve: [
      "Greasing the groove: perform submaximal push-up sets throughout the day, every day.",
      "Pyramid sets: 1, 2, 3... up to max then back down builds volume without failure.",
      "Plank holds: 3 × max holds with 60-second rest builds time under tension rapidly.",
      "Reduce rest between sets over time — this is the fastest path to endurance gains.",
    ],
  },
  {
    num: 4,
    key: "flexibility" as keyof CategoryRow,
    name: "Flexibility",
    test: "Sit-and-Reach (inches past toes)",
    why: "Injury prevention",
    howToTest: 'Sit on the floor with legs fully extended against a wall or box. Slowly reach forward with both hands as far as possible and hold for 2 seconds. Measure in inches: positive (+) means you reached past your toes, negative (−) means you fell short. Used in ACSM health assessments nationwide.',
    improve: [
      "Daily static stretching: hold each stretch 30–60 seconds, never bounce.",
      "Hamstring and hip flexor focus: these are the primary limiters for most people.",
      "Yoga 2–3× per week dramatically improves flexibility within 6–8 weeks.",
      "Foam rolling before stretching increases tissue pliability and range of motion.",
    ],
  },
  {
    num: 5,
    key: "grip" as keyof CategoryRow,
    name: "Grip Strength",
    test: "Hand Dynamometer — dominant hand (lbs)",
    why: "Overall strength predictor",
    howToTest: "Hold a calibrated hand dynamometer at your side with elbow slightly bent. Squeeze with maximum effort for 3 seconds. Record the peak reading. Grip strength is one of the strongest predictors of all-cause mortality and overall muscular strength in large population studies.",
    improve: [
      "Dead hangs from a pull-up bar: start with 3 × 20–30 seconds, build to 60+ seconds.",
      "Farmer carries: walk with heavy dumbbells or kettlebells at your sides — simple and brutally effective.",
      "Towel pull-ups: grip instability forces the hands and forearms to work harder.",
      "Grip trainers: use a hand gripper tool during idle time (TV, commute).",
    ],
  },
  {
    num: 6,
    key: "bodyFat" as keyof CategoryRow,
    name: "Body Composition",
    test: "Body Fat Percentage",
    why: "Metabolic health",
    howToTest: "Body fat % can be measured by: DEXA scan (gold standard, most accurate), skinfold calipers (trained tester required), bioelectrical impedance scale (convenient, less precise), or Navy Circumference Method (tape measure around neck and waist). All methods provide an estimate — DEXA is the benchmark for clinical use.",
    improve: [
      "Strength training: building muscle raises resting metabolism and improves fat-to-muscle ratio.",
      "Caloric awareness: a moderate deficit (300–500 cal/day) drives fat loss without muscle loss.",
      "Sleep: poor sleep raises cortisol, which directly drives fat storage especially at the midsection.",
      "Reduce ultra-processed foods: this single change has the largest impact for most people.",
    ],
  },
  {
    num: 7,
    key: "neuromotor" as keyof CategoryRow,
    name: "Neuromotor / Balance",
    test: "Single-Leg Balance — eyes closed (seconds)",
    why: "Fall prevention, reaction time",
    howToTest: "Stand barefoot on one foot with eyes closed. Hover the other foot off the ground without touching anything. Time how long you can hold without touching down or opening eyes. The eyes-closed version removes the visual compensation system and tests true proprioception and neuromotor control.",
    improve: [
      "Single-leg stands: practice eyes-open first, then progress to eyes-closed as you improve.",
      "Balance board or BOSU training: unstable surfaces force rapid neuromotor adaptation.",
      "Single-leg deadlifts, step-ups, and lunges build proprioceptive strength under load.",
      "Agility ladder drills improve foot speed, reaction time, and dynamic balance simultaneously.",
    ],
  },
];

export const maleStandards: Record<AgeKey, { baseline: CategoryRow; military: CategoryRow }> = {
  u13: {
    baseline: { cardio: "1.0–1.3", strength: "0.4–0.6×", endurance: "10–15 / 30s", flexibility: '+2–+4"', grip: "50–70", bodyFat: "10–20%", neuromotor: "10–20s" },
    military: { cardio: "1.3–1.5", strength: "0.6–0.75×", endurance: "20–30 / 45s", flexibility: '+3–+5"', grip: "65–80", bodyFat: "8–16%", neuromotor: "20–35s" },
  },
  teen: {
    baseline: { cardio: "1.2–1.5", strength: "0.6–0.85×", endurance: "20–35 / 45s", flexibility: '+1–+4"', grip: "80–110", bodyFat: "10–18%", neuromotor: "20–40s" },
    military: { cardio: "1.5–1.8", strength: "0.85–1.0×", endurance: "35–50 / 75s", flexibility: '+3–+6"', grip: "105–130", bodyFat: "8–15%", neuromotor: "35–55s" },
  },
  young: {
    baseline: { cardio: "1.4–1.7", strength: "0.9–1.1×", endurance: "30–45 / 60s", flexibility: '+2–+5"', grip: "100–130", bodyFat: "8–20%", neuromotor: "30–55s" },
    military: { cardio: "1.7–2.0", strength: "1.1–1.5×", endurance: "45–65 / 120s", flexibility: '+4–+7"', grip: "125–150", bodyFat: "6–17%", neuromotor: "50–70s" },
  },
  adult: {
    baseline: { cardio: "1.2–1.5", strength: "0.8–1.0×", endurance: "25–40 / 60s", flexibility: '+1–+4"', grip: "105–135", bodyFat: "10–22%", neuromotor: "20–45s" },
    military: { cardio: "1.5–1.8", strength: "1.0–1.3×", endurance: "40–55 / 90s", flexibility: '+3–+6"', grip: "130–155", bodyFat: "8–18%", neuromotor: "40–60s" },
  },
  senior: {
    baseline: { cardio: "1.0–1.3", strength: "0.65–0.85×", endurance: "20–35 / 45s", flexibility: '0–+3"', grip: "90–120", bodyFat: "12–25%", neuromotor: "15–35s" },
    military: { cardio: "1.3–1.6", strength: "0.85–1.1×", endurance: "35–50 / 75s", flexibility: '+2–+5"', grip: "115–140", bodyFat: "10–20%", neuromotor: "30–50s" },
  },
};

export const femaleStandards: Record<AgeKey, { baseline: CategoryRow; military: CategoryRow }> = {
  u13: {
    baseline: { cardio: "0.9–1.1", strength: "0.3–0.45×", endurance: "8–12 / 30s", flexibility: '+3–+5"', grip: "40–55", bodyFat: "15–25%", neuromotor: "10–25s" },
    military: { cardio: "1.1–1.3", strength: "0.45–0.6×", endurance: "15–25 / 45s", flexibility: '+4–+7"', grip: "50–65", bodyFat: "12–22%", neuromotor: "20–40s" },
  },
  teen: {
    baseline: { cardio: "1.0–1.3", strength: "0.45–0.65×", endurance: "15–25 / 45s", flexibility: '+3–+6"', grip: "60–80", bodyFat: "15–24%", neuromotor: "20–45s" },
    military: { cardio: "1.3–1.55", strength: "0.65–0.8×", endurance: "25–40 / 75s", flexibility: '+5–+8"', grip: "75–95", bodyFat: "12–20%", neuromotor: "35–55s" },
  },
  young: {
    baseline: { cardio: "1.15–1.45", strength: "0.55–0.75×", endurance: "20–35 / 60s", flexibility: '+4–+7"', grip: "65–90", bodyFat: "14–24%", neuromotor: "30–55s" },
    military: { cardio: "1.45–1.7", strength: "0.75–1.0×", endurance: "35–50 / 100s", flexibility: '+6–+9"', grip: "85–110", bodyFat: "10–20%", neuromotor: "50–70s" },
  },
  adult: {
    baseline: { cardio: "1.0–1.3", strength: "0.5–0.7×", endurance: "15–30 / 60s", flexibility: '+3–+6"', grip: "65–85", bodyFat: "15–26%", neuromotor: "20–45s" },
    military: { cardio: "1.3–1.55", strength: "0.7–0.9×", endurance: "28–42 / 90s", flexibility: '+5–+8"', grip: "80–105", bodyFat: "12–22%", neuromotor: "38–58s" },
  },
  senior: {
    baseline: { cardio: "0.85–1.1", strength: "0.4–0.6×", endurance: "12–25 / 45s", flexibility: '+2–+5"', grip: "55–75", bodyFat: "18–30%", neuromotor: "15–35s" },
    military: { cardio: "1.1–1.35", strength: "0.6–0.8×", endurance: "22–35 / 70s", flexibility: '+4–+7"', grip: "70–90", bodyFat: "14–24%", neuromotor: "30–50s" },
  },
};
