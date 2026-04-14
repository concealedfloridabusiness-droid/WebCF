import {
  fitnessCategories,
  maleStandards,
  femaleStandards,
  ageGroups,
} from "@/data/fitnessData";
import type { AgeKey, CategoryRow } from "@/data/fitnessData";

export type Gender = "male" | "female";
export type DocType = "civilian" | "military" | "assessment";

const LINE = "================================================================";
const DIV  = "----------------------------------------------------------------";

function header(title: string, subtitle: string, gender: Gender, date: string): string[] {
  return [
    LINE,
    `  CONCEALED FLORIDA — FITNESS GUIDE`,
    `  ${title}`,
    `  ${subtitle}`,
    `  Gender: ${gender === "male" ? "Male" : "Female"}`,
    `  Generated: ${date}`,
    `  Source: concealedfl.com/fitness`,
    LINE,
    "",
  ];
}

function standardsTable(catKey: keyof CategoryRow, gender: Gender, catName: string, testName: string): string[] {
  const standards = gender === "male" ? maleStandards : femaleStandards;
  const lines: string[] = [];
  lines.push("STANDARDS REFERENCE TABLE");
  lines.push(DIV);
  lines.push(`  Category : ${catName}`);
  lines.push(`  Test     : ${testName}`);
  lines.push("");
  lines.push(`  Age Group   | Baseline (Civilian)     | Military Standard`);
  lines.push(`  ------------|-------------------------|-------------------------`);
  for (const ag of ageGroups) {
    const row = standards[ag.key as AgeKey];
    const bl  = row.baseline[catKey] ?? "N/A";
    const mil = row.military[catKey] ?? "N/A";
    const label = ag.label.padEnd(11);
    lines.push(`  ${label} | ${String(bl).padEnd(23)} | ${mil}`);
  }
  lines.push("");
  return lines;
}

// ── 1. CARDIO ENDURANCE ────────────────────────────────────────────────────

function cardioCivilian(gender: Gender, date: string): string[] {
  const lines: string[] = [];
  lines.push(...header("Cardio Endurance — Civilian Guide", "12-Minute Cooper Run", gender, date));
  lines.push("SOURCE & AUTHORITY");
  lines.push(DIV);
  lines.push("  Cooper Institute (1968, validated annually)");
  lines.push("  ACSM Guidelines for Exercise Testing and Prescription, 11th Ed.");
  lines.push("  President's Council on Physical Fitness, Sports & Nutrition");
  lines.push("");
  lines.push(...standardsTable("cardio", gender, "Cardio Endurance", "12-Min Cooper Run (miles)"));
  lines.push("WHAT YOU ARE MEASURING");
  lines.push(DIV);
  lines.push("  VO2 max — the maximum rate at which your body can consume oxygen");
  lines.push("  during intense exercise. It is the single best predictor of");
  lines.push("  cardiovascular health and aerobic fitness. Higher VO2 max =");
  lines.push("  lower all-cause mortality risk (Harvard Health, 2022).");
  lines.push("");
  lines.push("EQUIPMENT NEEDED");
  lines.push(DIV);
  lines.push("  - Flat, measured track (standard track = 400m per lap)");
  lines.push("  - Stopwatch or phone timer");
  lines.push("  - Proper running shoes with arch support");
  lines.push("  - Water");
  lines.push("");
  lines.push("PRE-TRAINING SAFETY");
  lines.push(DIV);
  lines.push("  - Consult a physician if you are 40+ or have any cardiac history.");
  lines.push("  - Do not train with a resting heart rate above 100 bpm.");
  lines.push("  - Warm up for 5–10 minutes with easy walking/jogging before every run.");
  lines.push("  - Stop and walk if you feel chest pain, dizziness, or nausea.");
  lines.push("");
  lines.push("8-WEEK CIVILIAN TRAINING PROGRAM");
  lines.push(DIV);
  lines.push("  Goal: Reach or exceed the Baseline standard for your age group.");
  lines.push("  Frequency: 4 sessions per week. One rest day between each run.");
  lines.push("");
  lines.push("  ZONE 2 AEROBIC BASE (the foundation of all cardio improvement)");
  lines.push("  Definition: Running at a pace where you can hold a full sentence.");
  lines.push("  Heart rate: 60–70% of max HR. Max HR = 220 minus your age.");
  lines.push("  Why: Zone 2 builds mitochondrial density. Every elite athlete's");
  lines.push("  base is 80% Zone 2 running (Dr. Iñigo San Millán, Stanford).");
  lines.push("");
  lines.push("  WEEK 1–2  (Building Base)");
  lines.push("    Day 1: Easy run 20 min at conversational pace (Zone 2)");
  lines.push("    Day 2: Easy run 25 min Zone 2");
  lines.push("    Day 3: Rest or light walk");
  lines.push("    Day 4: Easy run 30 min Zone 2");
  lines.push("    Day 5: Rest");
  lines.push("    Day 6: Easy run 20 min + 4 × 100m strides at 80% effort");
  lines.push("    Day 7: Full rest");
  lines.push("");
  lines.push("  WEEK 3–4  (Volume Increase)");
  lines.push("    Day 1: Easy run 30 min Zone 2");
  lines.push("    Day 2: 6 × 400m at hard effort (3:00 walk recovery between)");
  lines.push("    Day 3: Rest");
  lines.push("    Day 4: Easy run 35 min Zone 2");
  lines.push("    Day 5: Rest");
  lines.push("    Day 6: Tempo run 20 min at a comfortably hard effort");
  lines.push("    Day 7: Full rest");
  lines.push("");
  lines.push("  WEEK 5–6  (Intensity Introduction)");
  lines.push("    Day 1: Easy run 35 min Zone 2");
  lines.push("    Day 2: 8 × 400m at hard effort (90-sec walk recovery)");
  lines.push("    Day 3: Rest");
  lines.push("    Day 4: Easy run 40 min Zone 2");
  lines.push("    Day 5: Rest");
  lines.push("    Day 6: Cooper Test Simulation — run 12 min at race effort");
  lines.push("    Day 7: Full rest (note your distance for baseline tracking)");
  lines.push("");
  lines.push("  WEEK 7  (Peak)");
  lines.push("    Day 1: Easy run 30 min");
  lines.push("    Day 2: 4 × 800m at hard effort (2:00 walk recovery)");
  lines.push("    Day 3: Rest");
  lines.push("    Day 4: Easy run 25 min");
  lines.push("    Day 5: Rest");
  lines.push("    Day 6: Easy run 20 min");
  lines.push("    Day 7: Full rest");
  lines.push("");
  lines.push("  WEEK 8  (Test Week)");
  lines.push("    Day 1–2: Easy run 15–20 min each (shakeout runs only)");
  lines.push("    Day 3: Rest");
  lines.push("    Day 4: Cooper Test — 12-min race effort on measured track");
  lines.push("    Day 5–7: Rest and recovery");
  lines.push("");
  lines.push("FORM & EXECUTION NOTES");
  lines.push(DIV);
  lines.push("  - Midfoot strike reduces impact and injury risk vs. heel striking.");
  lines.push("  - Arms swing forward/backward (not across body) at 90 degrees.");
  lines.push("  - Maintain upright posture — do not hunch forward.");
  lines.push("  - Cadence goal: 170–180 steps per minute (use a metronome app).");
  lines.push("  - Breathe in through nose, out through mouth. Never hold breath.");
  lines.push("");
  lines.push("NUTRITION SUPPORT");
  lines.push(DIV);
  lines.push("  - Eat a light meal 2–3 hours before running (avoid heavy fats).");
  lines.push("  - Hydrate: 16–20 oz water 2 hours before, 8 oz immediately before.");
  lines.push("  - Post-run: 20–30g protein + carbohydrates within 60 minutes.");
  lines.push("");
  lines.push(LINE);
  lines.push("  In any emergency, always call 911.");
  lines.push("  Concealed Florida — concealedfl.com");
  lines.push(LINE);
  return lines;
}

function cardioMilitary(gender: Gender, date: string): string[] {
  const lines: string[] = [];
  lines.push(...header("Cardio Endurance — Military Standard Guide", "2-Mile Run & Aerobic Conditioning", gender, date));
  lines.push("SOURCE & AUTHORITY");
  lines.push(DIV);
  lines.push("  Army FM 7-22 Holistic Health and Fitness (H2F), October 2020");
  lines.push("  Army ACFT — Two-Mile Run Event");
  lines.push("  USMC MCO 6100.13A — Marine Corps Physical Fitness Program");
  lines.push("  Navy OPNAVINST 6110.1J — Physical Readiness Program");
  lines.push("");
  lines.push(...standardsTable("cardio", gender, "Cardio Endurance", "12-Min Cooper Run (miles)"));
  lines.push("MILITARY TRAINING PHILOSOPHY");
  lines.push(DIV);
  lines.push("  Army FM 7-22 distinguishes between Physical Readiness Training (PRT)");
  lines.push("  and Endurance and Mobility activities. The goal is not merely to pass");
  lines.push("  a test but to build sustained operational endurance — the ability to");
  lines.push("  perform physical tasks over 8–24+ hour periods under load and stress.");
  lines.push("  Aerobic base + interval work + ruck training is the triad.");
  lines.push("");
  lines.push("ARMY ACFT — TWO-MILE RUN OVERVIEW");
  lines.push(DIV);
  lines.push("  The 2MR (Two-Mile Run) is the aerobic event in the Army ACFT.");
  lines.push("  Soldiers must complete 2 miles on a flat course as fast as possible.");
  lines.push("  Scoring: time-based (not distance-based like the Cooper Test).");
  lines.push("  Passing standard: varies by MOS and age — consult AR 670-1.");
  lines.push("  Minimum passing range: typically 21:00 (male), 23:22 (female) for ages 17-21.");
  lines.push("  Maximum score (600 pts): typically sub-13:30 (male), sub-15:29 (female).");
  lines.push("");
  lines.push("8-WEEK MILITARY AEROBIC CONDITIONING PROGRAM");
  lines.push(DIV);
  lines.push("  Protocol: Based on Army FM 7-22 Recovery and Aerobic Toughness training.");
  lines.push("  The program combines Formation Runs, Ability Group Runs (AGR), and");
  lines.push("  High-Intensity Repetition Running (HIRR).");
  lines.push("");
  lines.push("  WEEK 1–2  (PRT Foundation)");
  lines.push("    Mon: Recovery Run — 20 min at 50–60% effort");
  lines.push("    Tue: Ability Group Run — 3 miles at 70% effort, moderate pace");
  lines.push("    Wed: PRT Circuit + 4 × 400m at race pace with 2:00 rest");
  lines.push("    Thu: Recovery — easy walk/jog 20 min");
  lines.push("    Fri: 4-mile easy run (Army 'Road March pace' equivalent)");
  lines.push("    Sat/Sun: Active rest (ruck walk 2–3 miles at own pace)");
  lines.push("");
  lines.push("  WEEK 3–4  (HIRR Introduction — FM 7-22 Appendix D)");
  lines.push("    Mon: Recovery Run — 25 min");
  lines.push("    Tue: 6 × 400m at 2-mile race pace (90-sec jog recovery)");
  lines.push("    Wed: Sustained run 4 miles at AGR pace");
  lines.push("    Thu: Recovery + Army PRT: Conditioning Drill 1 (CD1)");
  lines.push("    Fri: 3 × 1-mile at goal 2-mile pace with 3:00 rest");
  lines.push("    Sat: Light ruck (25 lb) 3–4 miles");
  lines.push("    Sun: Rest");
  lines.push("");
  lines.push("  WEEK 5–6  (Intensity Block)");
  lines.push("    Mon: 30-min easy run");
  lines.push("    Tue: 8 × 400m at 5-10 sec faster than race pace (60-sec rest)");
  lines.push("    Wed: 5-mile easy run");
  lines.push("    Thu: 2 × 1-mile at max sustainable effort with 4:00 rest");
  lines.push("    Fri: 2-mile time trial (record time — benchmark progress)");
  lines.push("    Sat: Ruck (30–35 lb) 4 miles for aerobic/load adaptation");
  lines.push("    Sun: Rest");
  lines.push("");
  lines.push("  WEEK 7  (Peak Loading)");
  lines.push("    Mon: 35-min easy run");
  lines.push("    Tue: 4 × 800m at race pace (2:00 jog recovery)");
  lines.push("    Wed: Recovery run 20 min + CD1 circuit");
  lines.push("    Thu: 3-mile easy run");
  lines.push("    Fri: Rest");
  lines.push("    Sat: 20-min shakeout run");
  lines.push("    Sun: Full rest");
  lines.push("");
  lines.push("  WEEK 8  (Test Week)");
  lines.push("    Mon–Tue: Easy runs 15–20 min");
  lines.push("    Wed: 4 × 100m strides + rest");
  lines.push("    Thu: Cooper Test or 2MR — full race effort");
  lines.push("    Fri–Sun: Recovery and reassessment");
  lines.push("");
  lines.push("ARMY PRT WARM-UP PROTOCOL (Use Before Every Session)");
  lines.push(DIV);
  lines.push("  Per FM 7-22 Chapter 7 (Preparation and Recovery Drills):");
  lines.push("  1. Bend and Reach — 5 reps: arms overhead reach, then forward fold");
  lines.push("  2. Rear Lunge — 5 reps each leg: step back, knee near floor");
  lines.push("  3. High Jumper — 5 reps: arm swing + calf raise / jump");
  lines.push("  4. Rower — 5 reps: seated lean-back, simulating rowing motion");
  lines.push("  5. Squat Bender — 5 reps: full squat + reach overhead at top");
  lines.push("  6. Windmill — 5 reps: standing forward fold, alternate hand to foot");
  lines.push("  7. Forward Lunge — 5 reps each leg: long step, upright torso");
  lines.push("  8. Prone Row — 5 reps: face down, pull elbows back");
  lines.push("  9. Bent Leg Body Twist — 5 reps each: knees fall side to side");
  lines.push(" 10. Push-Up — 5 reps: full PRT standard (chest to 2\" from ground)");
  lines.push("");
  lines.push(LINE);
  lines.push("  Source: Army FM 7-22 (2020). Public domain.");
  lines.push("  Concealed Florida — concealedfl.com");
  lines.push(LINE);
  return lines;
}

function strengthCivilian(gender: Gender, date: string): string[] {
  const lines: string[] = [];
  lines.push(...header("Muscular Strength — Civilian Guide", "1-Rep Max Bench Press", gender, date));
  lines.push("SOURCE & AUTHORITY");
  lines.push(DIV);
  lines.push("  NSCA Essentials of Strength Training and Conditioning, 4th Ed.");
  lines.push("  ACSM's Exercise Management for Persons with Chronic Diseases, 4th Ed.");
  lines.push("  Starting Strength — Mark Rippetoe (NSCA-certified strength coach)");
  lines.push("");
  lines.push(...standardsTable("strength", gender, "Muscular Strength", "1-Rep Max Bench Press (× bodyweight)"));
  lines.push("HOW TO CALCULATE YOUR RATIO");
  lines.push(DIV);
  lines.push("  1RM Bench Press ÷ Bodyweight = Ratio");
  lines.push("  Example: 185 lb bench press ÷ 185 lb bodyweight = 1.0×");
  lines.push("  If you do not know your 1RM, use this formula:");
  lines.push("  Estimated 1RM = Weight × (1 + Reps ÷ 30)   [Epley Formula]");
  lines.push("  Example: 10 reps of 135 lbs → 135 × (1 + 10/30) = 135 × 1.33 = ~180 lbs");
  lines.push("");
  lines.push("EQUIPMENT NEEDED");
  lines.push(DIV);
  lines.push("  - Flat bench");
  lines.push("  - Olympic barbell (45 lbs) + weight plates");
  lines.push("  - A spotter (mandatory for 1RM testing)");
  lines.push("  - Collars (clips) to secure plates");
  lines.push("  - Chalk or grip straps (optional)");
  lines.push("");
  lines.push("BENCH PRESS FORM — STEP BY STEP");
  lines.push(DIV);
  lines.push("  Setup:");
  lines.push("    1. Lie flat. Eyes directly under the bar.");
  lines.push("    2. Plant feet flat on the floor, hip-width apart.");
  lines.push("    3. Squeeze shoulder blades together and down (retract and depress).");
  lines.push("    4. Maintain a natural arch in the lower back (just enough for a hand to fit).");
  lines.push("    5. Grip the bar slightly wider than shoulder-width. Thumbs around the bar.");
  lines.push("  Unrack:");
  lines.push("    6. Lift the bar off the rack with straight arms, move it over your chest.");
  lines.push("  Descent:");
  lines.push("    7. Lower the bar to your lower chest (nipple line) in a controlled arc.");
  lines.push("    8. Keep elbows at 45–75 degrees (not fully flared, not tucked).");
  lines.push("    9. Touch the chest — do not bounce.");
  lines.push("  Press:");
  lines.push("   10. Drive the bar up and slightly back toward the rack.");
  lines.push("   11. Lock out arms fully at the top. Re-rack only after full lockout.");
  lines.push("  Safety:");
  lines.push("   12. Always have a spotter for sets above 85% of your max.");
  lines.push("");
  lines.push("8-WEEK LINEAR PROGRESSION PROGRAM (NSCA Protocol)");
  lines.push(DIV);
  lines.push("  Frequency: 2× per week bench press sessions.");
  lines.push("  Rule: Add 2.5–5 lbs each session when you complete all target reps.");
  lines.push("  Start: Determine your estimated 1RM using the Epley formula above.");
  lines.push("");
  lines.push("  WEEK 1–2  (Technique & Baseline)");
  lines.push("    Session A: 3 × 8 @ 60–65% of estimated 1RM  (technique focus)");
  lines.push("    Session B: 3 × 8 @ 65–70%  (+2.5–5 lbs from Session A)");
  lines.push("");
  lines.push("  WEEK 3–4  (Linear Load)");
  lines.push("    Session A: 3 × 5 @ 70–75%");
  lines.push("    Session B: 3 × 5 @ 72.5–77.5%  (+5 lbs)");
  lines.push("");
  lines.push("  WEEK 5–6  (Strength Phase)");
  lines.push("    Session A: 5 × 3 @ 80–85%");
  lines.push("    Session B: 5 × 3 @ 82.5–87.5%  (+2.5 lbs)");
  lines.push("");
  lines.push("  WEEK 7  (Peaking)");
  lines.push("    Session A: 3 × 2 @ 87–92%");
  lines.push("    Session B: 3 × 1 @ 92–95%  (near-max singles)");
  lines.push("");
  lines.push("  WEEK 8  (Test Week)");
  lines.push("    Day 1: Rest / light accessory work only");
  lines.push("    Day 3: Warm-up, then attempt 1RM:");
  lines.push("      - Set 1: 10 reps @ 40%");
  lines.push("      - Set 2: 5 reps @ 60%");
  lines.push("      - Set 3: 3 reps @ 75%");
  lines.push("      - Set 4: 1 rep @ 85%");
  lines.push("      - Set 5: 1 rep @ 92–95% (should feel hard but clean)");
  lines.push("      - Set 6: 1 rep @ 100%+ attempt (add 5–10 lbs)");
  lines.push("    Rest 3–5 minutes between test sets. Abort if form breaks down.");
  lines.push("");
  lines.push("ACCESSORY EXERCISES");
  lines.push(DIV);
  lines.push("  Incline Dumbbell Press: 3 × 10  (upper chest and shoulder stability)");
  lines.push("  Dips: 3 × max reps  (triceps and lower chest strength)");
  lines.push("  Cable Rows or Dumbbell Rows: 3 × 10  (back balance — critical for shoulder health)");
  lines.push("  Face Pulls: 3 × 15  (rear delt and rotator cuff health)");
  lines.push("");
  lines.push(LINE);
  lines.push("  Concealed Florida — concealedfl.com");
  lines.push(LINE);
  return lines;
}

function strengthMilitary(gender: Gender, date: string): string[] {
  const lines: string[] = [];
  lines.push(...header("Muscular Strength — Military Standard Guide", "Strength Dead Lift & Upper Body Strength", gender, date));
  lines.push("SOURCE & AUTHORITY");
  lines.push(DIV);
  lines.push("  Army FM 7-22 Holistic Health and Fitness (H2F), October 2020");
  lines.push("  Army ACFT — Strength Dead Lift (SDL) Event");
  lines.push("  Army ACFT — Standing Power Throw, Hand-Release Push-Up (HRP)");
  lines.push("  USMC Physical Fitness and Combat Fitness Test (PFT/CFT) Manual");
  lines.push("");
  lines.push(...standardsTable("strength", gender, "Muscular Strength", "1-Rep Max Bench Press (× bodyweight)"));
  lines.push("ARMY ACFT STRENGTH DEAD LIFT (SDL) — OVERVIEW");
  lines.push(DIV);
  lines.push("  The SDL is Event 1 of the Army ACFT. Soldiers perform 3 repetitions");
  lines.push("  of a hex bar (trap bar) dead lift at the heaviest weight they can safely");
  lines.push("  complete with proper form. Weight options: 120, 140, 160, 180, 200 lbs.");
  lines.push("  Scoring: The heaviest successful 3-rep lift earns points.");
  lines.push("  Goal score for full points: typically 200+ lbs for combat arms.");
  lines.push("");
  lines.push("SDL FORM — STEP BY STEP (per FM 7-22)");
  lines.push(DIV);
  lines.push("  1. Stand inside the hex bar, feet hip-width apart.");
  lines.push("  2. Bend at the hips and knees to grip the handles.");
  lines.push("  3. Neutral spine — do NOT round the lower back.");
  lines.push("  4. Pull the slack out of the bar before breaking the floor.");
  lines.push("  5. Drive through the heels, extending knees and hips simultaneously.");
  lines.push("  6. Stand fully upright — do not hyperextend at the top.");
  lines.push("  7. Lower the bar under control to the floor. Reset before next rep.");
  lines.push("  CRITICAL: Any rounding of the lumbar spine = failed rep.");
  lines.push("");
  lines.push("8-WEEK ARMY-STANDARD STRENGTH PROGRAM");
  lines.push(DIV);
  lines.push("  Based on Army FM 7-22 Chapter 9 (Strength and Mobility Activities)");
  lines.push("");
  lines.push("  WEEK 1–2  (Movement Skill & Base Strength)");
  lines.push("    Mon: Hex bar or conventional dead lift 4 × 6 @ 50–60% max");
  lines.push("         Bench press 3 × 8 @ 60%   |   Bent-over row 3 × 10");
  lines.push("    Wed: Goblet squat 4 × 8   |   Push-up 4 × max   |   Plank 3 × 45s");
  lines.push("    Fri: Dead lift 4 × 5 @ 65%   |   Overhead press 3 × 8   |   Pull-up 3 × max");
  lines.push("");
  lines.push("  WEEK 3–4  (Progressive Load)");
  lines.push("    Mon: Dead lift 5 × 5 @ 70–75%   |   Bench 4 × 5 @ 70%   |   Row 4 × 8");
  lines.push("    Wed: Sandbag carry 4 × 40m   |   Push-up 5 × max   |   Ring row 3 × 10");
  lines.push("    Fri: Dead lift 4 × 4 @ 77%   |   OHP 4 × 6   |   Pull-up 4 × max");
  lines.push("");
  lines.push("  WEEK 5–6  (Intensity Block)");
  lines.push("    Mon: Dead lift 5 × 3 @ 80–85%   |   Bench 4 × 3 @ 80%   |   Row 4 × 6");
  lines.push("    Wed: Farmer carry 4 × 40m heavy   |   Dips 4 × max   |   L-hang 3 × 20s");
  lines.push("    Fri: Dead lift 3 × 2 @ 87–90%   |   OHP 3 × 3 @ 80%   |   Pull-up 3 × max");
  lines.push("");
  lines.push("  WEEK 7  (Peaking + Accessory)");
  lines.push("    Mon: Dead lift 3 × 1 @ 90–95%   |   Bench 3 × 2 @ 87%   |   Row 3 × 8");
  lines.push("    Wed: Light circuit: push-up × 20, row × 10, plank 60s × 3 sets");
  lines.push("    Fri: Rest or mobility only");
  lines.push("");
  lines.push("  WEEK 8  (Test Week)");
  lines.push("    Mon: Full warm-up + SDL 1RM attempt / Bench 1RM attempt");
  lines.push("    Wed–Sun: Recovery");
  lines.push("");
  lines.push("ARMY CONDITIONING DRILLS (CD1, CD2) — SUPPLEMENT TO LIFTING");
  lines.push(DIV);
  lines.push("  CD1 includes: Power jump, V-up, Mountain climber, Leg tuck and twist,");
  lines.push("               Single-leg dead lift, Squat and reach, Bent-leg body twist.");
  lines.push("  Perform CD1 2× per week as a finisher or warm-up supplement.");
  lines.push("  Source: FM 7-22, Chapter 9 Appendix.");
  lines.push("");
  lines.push(LINE);
  lines.push("  Source: Army FM 7-22 (2020). Public domain.");
  lines.push("  Concealed Florida — concealedfl.com");
  lines.push(LINE);
  return lines;
}

function enduranceCivilian(gender: Gender, date: string): string[] {
  const lines: string[] = [];
  lines.push(...header("Muscular Endurance — Civilian Guide", "Max Push-Ups & Plank Hold", gender, date));
  lines.push("SOURCE & AUTHORITY");
  lines.push(DIV);
  lines.push("  ACSM's Guidelines for Exercise Testing and Prescription, 11th Ed.");
  lines.push("  American Council on Exercise (ACE) Personal Trainer Manual");
  lines.push("  FitnessGram / Cooper Institute — Push-Up and Trunk Lift Standards");
  lines.push("");
  lines.push(...standardsTable("endurance", gender, "Muscular Endurance", "Max Push-Ups (unbroken) / Plank Hold (seconds)"));
  lines.push("PUSH-UP FORM — STEP BY STEP");
  lines.push(DIV);
  lines.push("  Starting Position:");
  lines.push("    1. Arms straight, hands slightly wider than shoulder-width.");
  lines.push("    2. Body in a straight line from heels to crown of head.");
  lines.push("    3. Core engaged — do not let hips sag or pike up.");
  lines.push("  Descent:");
  lines.push("    4. Lower body until chest is within 2–3 inches of the floor.");
  lines.push("    5. Elbows at ~45 degrees from the body (not fully flared).");
  lines.push("    6. Controlled descent — do not drop.");
  lines.push("  Press:");
  lines.push("    7. Push evenly through both palms back to full arm extension.");
  lines.push("    8. Do not lock elbows aggressively. Maintain tension.");
  lines.push("  Counting rule: Only reps with full range of motion count.");
  lines.push("  Failure: When you cannot complete a full rep without form breakdown.");
  lines.push("");
  lines.push("PLANK HOLD FORM");
  lines.push(DIV);
  lines.push("    1. Forearms on the floor, elbows directly under shoulders.");
  lines.push("    2. Body in a straight line — hips, spine, and neck neutral.");
  lines.push("    3. Squeeze glutes and core throughout the hold.");
  lines.push("    4. Breathe steadily — do not hold your breath.");
  lines.push("    5. Test ends when hips drop >2 inches or you tap out.");
  lines.push("");
  lines.push("8-WEEK CIVILIAN ENDURANCE PROGRAM");
  lines.push(DIV);
  lines.push("  Core Method: GREASE THE GROOVE (Pavel Tsatsouline / StrongFirst)");
  lines.push("  Principle: Perform submaximal sets frequently throughout the day.");
  lines.push("  Never train to failure during the program — save that for test day.");
  lines.push("");
  lines.push("  WEEK 1–2  (Establish Volume)");
  lines.push("    Every morning: 3 × 50% of your current max push-ups");
  lines.push("    Every evening: 3 × 50% of your current max push-ups");
  lines.push("    Plank: 3 × 30 seconds after each push-up session");
  lines.push("    Total daily volume: 6 sets of push-ups + 6 plank holds");
  lines.push("");
  lines.push("  WEEK 3–4  (Volume Increase)");
  lines.push("    Every morning: 4 × 60% max push-ups");
  lines.push("    Every evening: 4 × 60% max push-ups");
  lines.push("    Plank: 3 × 45 seconds after each session");
  lines.push("    Add: Tempo push-ups 2× per week — 3-second lowering, 1-second hold at bottom");
  lines.push("");
  lines.push("  WEEK 5–6  (Intensity Layer)");
  lines.push("    Morning: 5 × 60% max push-ups + 1 max-minus-2 set");
  lines.push("    Evening: 4 × 60% max push-ups");
  lines.push("    Plank: 3 × 60 seconds");
  lines.push("    Pyramid: Once per week — 1, 2, 3, 4, 5...work up to near-max, back down");
  lines.push("");
  lines.push("  WEEK 7  (Pre-Test Volume Reduction)");
  lines.push("    Morning: 3 × 50% max push-ups");
  lines.push("    Evening: 2 × 50% max push-ups");
  lines.push("    Plank: 2 × 45 seconds");
  lines.push("    Goal: Arrive at test day fully recovered");
  lines.push("");
  lines.push("  WEEK 8  (Test Week)");
  lines.push("    Day 1–3: Minimal volume (1–2 easy sets)");
  lines.push("    Day 4: Max push-up test + max plank hold test");
  lines.push("    Day 5–7: Rest");
  lines.push("");
  lines.push(LINE);
  lines.push("  Concealed Florida — concealedfl.com");
  lines.push(LINE);
  return lines;
}

function enduranceMilitary(gender: Gender, date: string): string[] {
  const lines: string[] = [];
  lines.push(...header("Muscular Endurance — Military Standard Guide", "Hand-Release Push-Up, Pull-Up & Sit-Up", gender, date));
  lines.push("SOURCE & AUTHORITY");
  lines.push(DIV);
  lines.push("  Army FM 7-22 — ACFT Hand-Release Push-Up (HRP) Standards");
  lines.push("  USMC MCO 6100.13A — PFT Pull-Up/Push-Up Standards");
  lines.push("  Navy OPNAVINST 6110.1J — Curl-Up (Sit-Up) Standards");
  lines.push("");
  lines.push(...standardsTable("endurance", gender, "Muscular Endurance", "Max Push-Ups (unbroken) / Plank Hold (seconds)"));
  lines.push("ARMY ACFT — HAND-RELEASE PUSH-UP (HRP) STANDARD");
  lines.push(DIV);
  lines.push("  The HRP tests muscular endurance over 2 minutes.");
  lines.push("  FORM (per FM 7-22):");
  lines.push("    1. Start in push-up position, body straight.");
  lines.push("    2. Lower chest to the floor.");
  lines.push("    3. Lift both hands off the ground (this is the 'release').");
  lines.push("    4. Re-place hands and push back to start. That = 1 rep.");
  lines.push("  Key difference from standard push-up: hands MUST leave the ground.");
  lines.push("  Scoring: 2-minute max reps. Passing: typically 10–42 depending on MOS/age.");
  lines.push("  Max score (100 pts) for ages 17–21: typically 60+ reps (male), 40+ reps (female).");
  lines.push("");
  lines.push("USMC PFT — PULL-UP STANDARD");
  lines.push(DIV);
  lines.push("  Pull-ups are the primary upper body test for the Marine Corps PFT.");
  lines.push("  FORM:");
  lines.push("    - Overhand grip, arms fully extended at start.");
  lines.push("    - Pull until chin clears the bar.");
  lines.push("    - Lower under control to full arm extension. No kipping.");
  lines.push("  Male scoring: 3 = minimum pass | 23 = maximum score");
  lines.push("  Female scoring: Push-up option (may substitute push-ups).");
  lines.push("  Pull-up alternative for female: max push-ups in 2 min (any USMC-standard rep).");
  lines.push("");
  lines.push("8-WEEK MILITARY ENDURANCE PROGRAM");
  lines.push(DIV);
  lines.push("  WEEK 1–2  (Base Volume)");
  lines.push("    Mon: HRP 5 × 10 + Pull-up 5 × max-minus-2");
  lines.push("    Wed: Push-up pyramid: 5, 10, 15, 10, 5 with 60s rest");
  lines.push("    Fri: Pull-up cluster: 10 sets × max-minus-3 with 90s rest");
  lines.push("");
  lines.push("  WEEK 3–4  (Volume + HRP Simulation)");
  lines.push("    Mon: 2-min HRP test simulation + 5 × max push-ups");
  lines.push("    Wed: Superset: 10 pull-ups + 30 push-ups × 3 rounds");
  lines.push("    Fri: Push-up ladder: 1-rep, 2-rep... up to 10-rep, back down");
  lines.push("");
  lines.push("  WEEK 5–6  (High Volume)");
  lines.push("    Mon: 2-min HRP test simulation × 2 attempts (3 min rest between)");
  lines.push("    Wed: Pull-up 8 × max-minus-1   |   Plank 5 × 60s");
  lines.push("    Fri: 100 push-up challenge: in as few sets as needed, no time limit");
  lines.push("");
  lines.push("  WEEK 7–8  (Taper and Test)");
  lines.push("    Week 7: Reduce to 60% volume. Maintain technique.");
  lines.push("    Week 8 Day 1: Max HRP test (2 minutes)");
  lines.push("              Day 2: Max pull-ups + max plank");
  lines.push("              Day 3+: Rest");
  lines.push("");
  lines.push(LINE);
  lines.push("  Source: Army FM 7-22 (2020) and USMC MCO 6100.13A. Public domain.");
  lines.push("  Concealed Florida — concealedfl.com");
  lines.push(LINE);
  return lines;
}

function flexibilityCivilian(gender: Gender, date: string): string[] {
  const lines: string[] = [];
  lines.push(...header("Flexibility — Civilian Guide", "Sit-and-Reach Test", gender, date));
  lines.push("SOURCE & AUTHORITY");
  lines.push(DIV);
  lines.push("  ACSM FitnessGram — Sit-and-Reach Protocol");
  lines.push("  YMCA Fitness Testing and Assessment Manual, 5th Ed.");
  lines.push("  ACSM's Guidelines for Exercise Testing and Prescription, 11th Ed.");
  lines.push("");
  lines.push(...standardsTable("flexibility", gender, "Flexibility", "Sit-and-Reach (inches past toes)"));
  lines.push("HOW TO PERFORM THE SIT-AND-REACH TEST");
  lines.push(DIV);
  lines.push("  Equipment: Sit-and-reach box (or tape measure + book spine at the foot).");
  lines.push("  1. Remove shoes. Sit on the floor with legs fully extended.");
  lines.push("  2. Press soles of feet flat against the box edge (or a wall).");
  lines.push("  3. Slowly reach forward with both hands (fingers overlapping).");
  lines.push("  4. Hold the maximum reach for 2 full seconds.");
  lines.push("  5. Measure: distance beyond the toes = positive, short of toes = negative.");
  lines.push("  6. Perform 3 trials. Record the best result.");
  lines.push("  Note: Do not bounce. Keep knees fully extended throughout.");
  lines.push("");
  lines.push("8-WEEK FLEXIBILITY PROGRAM");
  lines.push(DIV);
  lines.push("  Frequency: Daily. Stretching is safe every day — unlike lifting.");
  lines.push("  Best time: Morning after a warm shower, or after any cardio session.");
  lines.push("  Hold time: 30–60 seconds per stretch. ACSM recommendation.");
  lines.push("");
  lines.push("  CORE STRETCHES — PERFORM IN THIS ORDER DAILY:");
  lines.push("");
  lines.push("  1. Supine Hamstring Stretch (primary limiter for sit-and-reach)");
  lines.push("     - Lie on back. Lift one leg, holding behind the thigh or calf.");
  lines.push("     - Gently pull leg toward chest, knee as straight as possible.");
  lines.push("     - Hold 30–60 sec each leg. Do not bounce.");
  lines.push("");
  lines.push("  2. Seated Forward Fold");
  lines.push("     - Sit with legs straight. Reach forward as far as possible.");
  lines.push("     - Hold 30–60 sec. Breathe into the stretch on the exhale.");
  lines.push("     - Relax further with each breath — do not force.");
  lines.push("");
  lines.push("  3. Hip Flexor Lunge Stretch");
  lines.push("     - Kneeling lunge position. Back knee on the floor.");
  lines.push("     - Shift hips forward until you feel a stretch in the front of the hip.");
  lines.push("     - Hold 30–60 sec each side. Arms overhead intensifies the stretch.");
  lines.push("");
  lines.push("  4. Pigeon Pose (advanced hip opener)");
  lines.push("     - From push-up position, bring one knee toward the same-side wrist.");
  lines.push("     - Extend the back leg straight. Lower torso toward the floor.");
  lines.push("     - Hold 45–60 sec each side. Significant hip flexor and glute release.");
  lines.push("");
  lines.push("  5. Cat-Cow Spinal Mobility");
  lines.push("     - On hands and knees. Round the spine up (cat), then arch down (cow).");
  lines.push("     - 10 slow repetitions. Improves lumbar and thoracic mobility.");
  lines.push("");
  lines.push("  6. Standing Calf/Achilles Stretch");
  lines.push("     - Hands on wall. One foot back, heel on ground, knee straight.");
  lines.push("     - Hold 30 sec each side.");
  lines.push("");
  lines.push("  WEEK 1–4: Perform all 6 stretches once daily, 30 sec holds.");
  lines.push("  WEEK 5–8: Perform all 6 stretches twice daily, 45–60 sec holds.");
  lines.push("            Add 1–2 yoga sessions per week for full-body flexibility.");
  lines.push("");
  lines.push("PROGRESS TRACKING");
  lines.push(DIV);
  lines.push("  Measure your sit-and-reach every 2 weeks. Flexibility gains are");
  lines.push("  gradual — expect +0.5\" to +1.5\" per 4 weeks of consistent practice.");
  lines.push("");
  lines.push(LINE);
  lines.push("  Concealed Florida — concealedfl.com");
  lines.push(LINE);
  return lines;
}

function flexibilityMilitary(gender: Gender, date: string): string[] {
  const lines: string[] = [];
  lines.push(...header("Flexibility — Military Standard Guide", "Army PRT Hip & Mobility Drills", gender, date));
  lines.push("SOURCE & AUTHORITY");
  lines.push(DIV);
  lines.push("  Army FM 7-22 Holistic Health and Fitness (H2F), Chapter 9");
  lines.push("  Army Preparation and Recovery (PD/RD) Drills");
  lines.push("  Army 4 For the Core (4C) and Hip Stability Drill (HSD)");
  lines.push("");
  lines.push(...standardsTable("flexibility", gender, "Flexibility", "Sit-and-Reach (inches past toes)"));
  lines.push("MILITARY CONTEXT FOR FLEXIBILITY");
  lines.push(DIV);
  lines.push("  Army FM 7-22 emphasizes mobility as a prerequisite for all physical");
  lines.push("  readiness. Soldiers who lack hip, hamstring, and ankle mobility cannot");
  lines.push("  safely perform the SDL dead lift, Sprint Drag Carry, or ruck marching");
  lines.push("  at required loads. Flexibility directly prevents duty-limiting injuries.");
  lines.push("");
  lines.push("ARMY HIP STABILITY DRILL (HSD) — FM 7-22 STANDARD");
  lines.push(DIV);
  lines.push("  Perform HSD as a daily warm-up or standalone mobility session.");
  lines.push("  Each drill: 10 repetitions per side unless otherwise noted.");
  lines.push("");
  lines.push("  HSD 1 — Lateral Leg Raise");
  lines.push("    Starting position: Side-lying, body aligned.");
  lines.push("    Action: Lift top leg to 45 degrees. Hold 1 sec. Lower slowly.");
  lines.push("    Purpose: Hip abductor strength and glute med activation.");
  lines.push("");
  lines.push("  HSD 2 — Medial Leg Raise");
  lines.push("    Starting position: Side-lying, top leg crossed forward.");
  lines.push("    Action: Lift bottom leg to 12 inches. Hold 1 sec. Lower.");
  lines.push("    Purpose: Hip adductor and inner-thigh strength.");
  lines.push("");
  lines.push("  HSD 3 — Bent-Leg Lateral Raise");
  lines.push("    Starting position: Side-lying, both knees bent 90 degrees.");
  lines.push("    Action: Open top knee like a clamshell. Hold. Return.");
  lines.push("    Purpose: External hip rotation mobility.");
  lines.push("");
  lines.push("  HSD 4 — Single-Leg Bent Hip and Knee Extension");
  lines.push("    Starting position: On back, both knees bent.");
  lines.push("    Action: Straighten one leg and hold 45 degrees off the floor.");
  lines.push("    Purpose: Hip flexor and lower abdominal control.");
  lines.push("");
  lines.push("ARMY 4 FOR THE CORE (4C) — SPINAL MOBILITY");
  lines.push(DIV);
  lines.push("  4C Exercise 1 — Bent-Leg Raise");
  lines.push("    On back. Bring one knee to chest at a time, alternating. 10 reps.");
  lines.push("  4C Exercise 2 — Straight-Leg Raise");
  lines.push("    On back. Raise both legs to 90 degrees, lower slowly. 10 reps.");
  lines.push("  4C Exercise 3 — Alternate-Leg Push-Away");
  lines.push("    On back. Push one leg away, other leg stationary. 10 reps each.");
  lines.push("  4C Exercise 4 — Leg-Over");
  lines.push("    On back. Cross one leg over the body to the opposite side. Spinal rotation.");
  lines.push("");
  lines.push("8-WEEK MILITARY FLEXIBILITY PROTOCOL");
  lines.push(DIV);
  lines.push("  Weeks 1–4: HSD (all 4) + 4C (all 4) daily before any physical training.");
  lines.push("             Add sit-and-reach daily hold 30 sec × 3 sets.");
  lines.push("  Weeks 5–8: HSD + 4C + supine hamstring stretch 60 sec each side.");
  lines.push("             Add Army Recovery Drill (RD) after every PRT session:");
  lines.push("             Overhead arm pull, Rear lunge, Extend and flex, Thigh stretch,");
  lines.push("             Single-leg over (spinal twist hold 30 sec each side).");
  lines.push("");
  lines.push(LINE);
  lines.push("  Source: Army FM 7-22 (2020). Public domain.");
  lines.push("  Concealed Florida — concealedfl.com");
  lines.push(LINE);
  return lines;
}

function gripCivilian(gender: Gender, date: string): string[] {
  const lines: string[] = [];
  lines.push(...header("Grip Strength — Civilian Guide", "Hand Dynamometer Dominant Hand", gender, date));
  lines.push("SOURCE & AUTHORITY");
  lines.push(DIV);
  lines.push("  Mathiowetz V et al. (1985) — Grip and Pinch Strength Normative Data");
  lines.push("  ACSM's Guidelines for Exercise Testing and Prescription, 11th Ed.");
  lines.push("  Journal of Strength and Conditioning Research — Grip Strength Norms");
  lines.push("");
  lines.push(...standardsTable("grip", gender, "Grip Strength", "Hand Dynamometer — dominant hand (lbs)"));
  lines.push("WHAT GRIP STRENGTH PREDICTS");
  lines.push(DIV);
  lines.push("  A 2015 Lancet study (n=140,000, 17 countries) found that every 11-lb");
  lines.push("  decrease in grip strength was associated with a 17% greater risk of");
  lines.push("  cardiovascular mortality and 9% greater risk of all-cause mortality.");
  lines.push("  Grip is the single best functional proxy for overall muscle strength.");
  lines.push("");
  lines.push("HOW TO TEST WITH A DYNAMOMETER");
  lines.push(DIV);
  lines.push("  1. Sit upright with elbow bent at 90 degrees, forearm neutral.");
  lines.push("  2. Hold the dynamometer with no forearm contact on the body or chair.");
  lines.push("  3. Squeeze with maximum effort for 3 seconds.");
  lines.push("  4. Read peak value in lbs. Record and reset.");
  lines.push("  5. Perform 3 trials each hand. Average the 3 trials for final score.");
  lines.push("  Note: Commercially available Jamar-style dynamometers cost $30–$150.");
  lines.push("        Baseline-accurate devices: Camry EH101, Jamar Plus+.");
  lines.push("");
  lines.push("8-WEEK GRIP STRENGTH PROGRAM");
  lines.push(DIV);
  lines.push("  Frequency: Grip training can be done 4–5 days/week. Forearms recover fast.");
  lines.push("");
  lines.push("  EXERCISE 1 — DEAD HANG (most effective single grip exercise)");
  lines.push("    - Hang from a pull-up bar with overhand grip, arms straight.");
  lines.push("    - Hold as long as possible. Step off safely.");
  lines.push("    - Week 1–2: 3 × 20–30 sec  |  Week 3–4: 3 × 35–45 sec");
  lines.push("    - Week 5–6: 3 × 50–60 sec  |  Week 7–8: 3 × 60–75 sec");
  lines.push("    - Progress: add a weight belt once you can hold 60+ sec consistently.");
  lines.push("");
  lines.push("  EXERCISE 2 — FARMER CARRY");
  lines.push("    - Hold the heaviest dumbbells or kettlebells you can safely control.");
  lines.push("    - Walk 40 meters (down and back = 1 set). Keep upright posture.");
  lines.push("    - Week 1–2: 3 × 30m  |  Week 3–4: 4 × 40m  |  Week 5–8: 5 × 40m heavy");
  lines.push("");
  lines.push("  EXERCISE 3 — PLATE PINCH HOLD");
  lines.push("    - Grip the smooth side of two 25-lb plates (or one 45-lb plate).");
  lines.push("    - Pinch between thumb and fingers. Hold at side for time.");
  lines.push("    - 3 × 20–30 sec. Progress weight as grip improves.");
  lines.push("");
  lines.push("  EXERCISE 4 — HAND GRIPPER");
  lines.push("    - Use a Captains of Crush (CoC) style gripper.");
  lines.push("    - Choose a resistance you can close 10–15 times.");
  lines.push("    - 3 × 10–15 each hand, rest 60 sec between sets.");
  lines.push("    - Progress: when 15 reps is easy, move to the next resistance level.");
  lines.push("");
  lines.push("  EXERCISE 5 — TOWEL PULL-UP (advanced)");
  lines.push("    - Drape two towels over a pull-up bar. Grip both towels.");
  lines.push("    - Perform pull-ups gripping the towels (no bar contact).");
  lines.push("    - 3 × max reps. The instability forces deep grip and forearm recruitment.");
  lines.push("");
  lines.push("  SAMPLE WEEKLY SCHEDULE:");
  lines.push("    Mon: Dead hang 3 × max  +  Farmer carry 4 × 40m");
  lines.push("    Tue: Hand gripper 3 × 15 each hand  +  Plate pinch 3 × 25s");
  lines.push("    Wed: Rest grip / light finger stretches");
  lines.push("    Thu: Dead hang 3 × max  +  Towel pull-up 3 × max");
  lines.push("    Fri: Farmer carry 4 × 40m heavy  +  Hand gripper 3 × 15");
  lines.push("    Sat/Sun: Rest grip or light stretches");
  lines.push("");
  lines.push(LINE);
  lines.push("  Concealed Florida — concealedfl.com");
  lines.push(LINE);
  return lines;
}

function gripMilitary(gender: Gender, date: string): string[] {
  const lines: string[] = [];
  lines.push(...header("Grip Strength — Military Standard Guide", "SDL, Ruck, and Load-Bearing Grip Training", gender, date));
  lines.push("SOURCE & AUTHORITY");
  lines.push(DIV);
  lines.push("  Army FM 7-22 — Strength Dead Lift (SDL) and Loaded Carry Standards");
  lines.push("  Army ACFT — Sprint Drag Carry (SDC) Event");
  lines.push("  USMC Combat Fitness Test (CFT) — Ammunition Can Lift");
  lines.push("");
  lines.push(...standardsTable("grip", gender, "Grip Strength", "Hand Dynamometer — dominant hand (lbs)"));
  lines.push("MILITARY CONTEXT FOR GRIP STRENGTH");
  lines.push(DIV);
  lines.push("  Grip strength is load-critical in military operations. Soldiers and");
  lines.push("  Marines must carry equipment, drag casualties, scale obstacles, and");
  lines.push("  handle weapons under extended fatigue. The Army ACFT tests grip");
  lines.push("  implicitly through the SDL (dead lift handles) and SDC (drag handle).");
  lines.push("  The USMC CFT directly tests grip via 30-lb ammunition can lifts.");
  lines.push("");
  lines.push("ARMY ACFT — SPRINT DRAG CARRY (SDC) GRIP DEMANDS");
  lines.push(DIV);
  lines.push("  The SDC requires: 50m sprint, 50m sled drag (90 lb), 50m lateral");
  lines.push("  shuffle, 50m kettlebell carry (2 × 40 lb), 50m sprint.");
  lines.push("  The sled drag uses a strap handle — grip endurance under fatigue.");
  lines.push("  The KB carry requires sustained grip while moving at speed.");
  lines.push("  Minimum time targets vary by MOS — combat arms: sub 1:40 (male/female).");
  lines.push("");
  lines.push("USMC CFT — AMMO CAN LIFT");
  lines.push(DIV);
  lines.push("  Lift a 30-lb ammunition can overhead from shoulder height repeatedly.");
  lines.push("  Max reps in 2 minutes. Overhand grip throughout.");
  lines.push("  Max score: 112 lifts (male) | 98 lifts (female)");
  lines.push("");
  lines.push("8-WEEK MILITARY GRIP PROGRAM");
  lines.push(DIV);
  lines.push("  WEEK 1–2  (Foundation)");
  lines.push("    Mon: SDL 4 × 5 @ 60–70%  (grip focus — no straps)");
  lines.push("         Farmer carry 3 × 30m with 35 lb each hand");
  lines.push("    Wed: Dead hang 3 × max  |  Sled drag simulation (belt+resistance band)");
  lines.push("    Fri: SDL 4 × 5 @ 65–75%  |  KB carry 3 × 40m (35–40 lb each)");
  lines.push("");
  lines.push("  WEEK 3–4  (Progressive Load)");
  lines.push("    Mon: SDL 4 × 4 @ 72–80%  (no straps)  |  Farmer carry 4 × 40m");
  lines.push("    Wed: Ammo can lift drill: 3 × 90-sec max reps (30 lb)");
  lines.push("         Dead hang 3 × max  |  Plate pinch 3 × 25s");
  lines.push("    Fri: SDL 3 × 3 @ 80%  |  KB carry 4 × 40m (40–45 lb each)");
  lines.push("");
  lines.push("  WEEK 5–6  (SDC-Specific Simulation)");
  lines.push("    Mon: SDC simulation — 50m sprint + 50m sled drag + 50m KB carry × 3 rounds");
  lines.push("    Wed: SDL 3 × 2 @ 85%  |  Ammo can lift 3 × 2-min  |  Dead hang 4 × max");
  lines.push("    Fri: Farmer carry 5 × 40m (heaviest manageable)  |  Towel pull-up 3 × max");
  lines.push("");
  lines.push("  WEEK 7–8  (Taper and Test)");
  lines.push("    Week 7: Reduce volume 40%. Maintain grip exercises.");
  lines.push("    Week 8: Test day — SDL, dynamometer, SDC simulation.");
  lines.push("");
  lines.push(LINE);
  lines.push("  Source: Army FM 7-22 (2020) and USMC MCO 6100.13A. Public domain.");
  lines.push("  Concealed Florida — concealedfl.com");
  lines.push(LINE);
  return lines;
}

function bodyFatCivilian(gender: Gender, date: string): string[] {
  const lines: string[] = [];
  lines.push(...header("Body Composition — Civilian Guide", "Body Fat % Reduction & Measurement", gender, date));
  lines.push("SOURCE & AUTHORITY");
  lines.push(DIV);
  lines.push("  ACSM's Guidelines for Exercise Testing and Prescription, 11th Ed.");
  lines.push("  American Council on Exercise (ACE) Body Composition Guidelines");
  lines.push("  NIH National Heart, Lung, and Blood Institute — Obesity Guidelines");
  lines.push("  CDC Physical Activity Guidelines for Americans, 2nd Ed. (2018)");
  lines.push("");
  lines.push(...standardsTable("bodyFat", gender, "Body Composition", "Body Fat Percentage"));
  lines.push("HOW TO MEASURE BODY FAT %");
  lines.push(DIV);
  lines.push("  Method 1: DEXA Scan (Gold Standard)");
  lines.push("    - Dual-Energy X-ray Absorptiometry. Accuracy: ±1–2%.");
  lines.push("    - Available at medical facilities and some gyms ($50–$150).");
  lines.push("    - Best method if precision matters for tracking progress.");
  lines.push("");
  lines.push("  Method 2: Skinfold Calipers (Field Standard)");
  lines.push("    - Requires a trained tester. Accuracy: ±3–5%.");
  lines.push("    - 3-site or 7-site protocol (Jackson-Pollock).");
  lines.push("    - Available at most university gyms and fitness centers.");
  lines.push("");
  lines.push("  Method 3: Navy Circumference Tape Method (No Equipment)");
  lines.push(gender === "male"
    ? "    - Male: Measure neck circumference + waist circumference at navel."
    : "    - Female: Measure neck + waist at narrowest + hip at widest.");
  lines.push("    - Use the DoD circumference formula (online calculators available).");
  lines.push("    - Accuracy: ±3–4%. Official DoD method for military assessments.");
  lines.push("");
  lines.push("  Method 4: Bioelectrical Impedance Scale (BIA)");
  lines.push("    - Consumer scales (Renpho, Withings, Tanita). Accuracy: ±3–7%.");
  lines.push("    - Highly variable with hydration. Measure same time each day.");
  lines.push("    - Use for trend tracking, not precise point-in-time measurement.");
  lines.push("");
  lines.push("8-WEEK BODY COMPOSITION PROGRAM");
  lines.push(DIV);
  lines.push("  Body fat reduction requires two things: a moderate caloric deficit");
  lines.push("  + strength training to preserve/build muscle. Both are required.");
  lines.push("  Target rate: 0.5–1% body fat per month is realistic and sustainable.");
  lines.push("");
  lines.push("  TRAINING (3–4 days/week strength + 3 days cardio)");
  lines.push("    Strength: Full-body compound program (squat, hinge, push, pull).");
  lines.push("      - 3 × 8–12 per exercise. 3–4 exercises per session.");
  lines.push("      - Minimum: bench press or push-up, squat or goblet squat,");
  lines.push("                 deadlift or hip hinge, row or pull-up.");
  lines.push("    Cardio: Zone 2 (30–45 min) × 3 days/week.");
  lines.push("      - Any sustained aerobic activity: walking, cycling, swimming.");
  lines.push("");
  lines.push("  NUTRITION (the dominant driver of fat loss)");
  lines.push("    Step 1: Calculate TDEE (Total Daily Energy Expenditure).");
  lines.push("      TDEE = BMR × Activity Factor.");
  lines.push("      Use Mifflin-St Jeor formula or an online TDEE calculator.");
  lines.push("    Step 2: Create a deficit of 300–500 calories/day.");
  lines.push("      Do NOT exceed 500 cal/day deficit — this accelerates muscle loss.");
  lines.push("    Step 3: Protein target: 0.7–1.0 g per pound of bodyweight per day.");
  lines.push("      Protein spares muscle mass during a caloric deficit.");
  lines.push("    Step 4: Reduce ultra-processed foods (the single highest impact change).");
  lines.push("      Replace with whole foods, lean proteins, vegetables, and whole grains.");
  lines.push("");
  lines.push("  SLEEP (often overlooked but critical)");
  lines.push("    - Under 7 hours of sleep raises cortisol, which drives visceral fat storage.");
  lines.push("    - Under 7 hours also increases ghrelin (hunger hormone) by ~24%.");
  lines.push("    - Target: 7–9 hours per night. Consistency matters more than total hours.");
  lines.push("");
  lines.push(LINE);
  lines.push("  Concealed Florida — concealedfl.com");
  lines.push(LINE);
  return lines;
}

function bodyFatMilitary(gender: Gender, date: string): string[] {
  const lines: string[] = [];
  lines.push(...header("Body Composition — Military Standard Guide", "Army/DoD Body Composition Program", gender, date));
  lines.push("SOURCE & AUTHORITY");
  lines.push(DIV);
  lines.push("  Army AR 600-9 — Army Body Composition Program (ABCP)");
  lines.push("  DoD Directive 1308.1 — DoD Physical Fitness and Body Fat Program");
  lines.push("  Army FM 7-22 — Physical Fitness as Combat Multiplier");
  lines.push("  USMC Weight and Body Fat Standards (MCO 6100.3)");
  lines.push("");
  lines.push(...standardsTable("bodyFat", gender, "Body Composition", "Body Fat Percentage"));
  lines.push("ARMY ABCP — OFFICIAL STANDARDS");
  lines.push(DIV);
  lines.push("  Army body fat standards (AR 600-9) by age and gender:");
  lines.push("  These are SCREENING standards (the maximum allowed — not the goal).");
  lines.push(gender === "male"
    ? "  Male max body fat: Age 17-20: 20% | Age 21-27: 22% | Age 28-39: 24% | Age 40+: 26%"
    : "  Female max body fat: Age 17-20: 30% | Age 21-27: 32% | Age 28-39: 34% | Age 40+: 36%");
  lines.push("  Operational standard (optimal performance): 10–18% (male), 18–24% (female).");
  lines.push("  Source: AR 600-9, published by Department of the Army.");
  lines.push("");
  lines.push("ARMY MEASUREMENT METHOD — CIRCUMFERENCE TAPE (Official)");
  lines.push(DIV);
  if (gender === "male") {
    lines.push("  Male measurement sites:");
    lines.push("    Neck: Measure just below the Adam's apple, perpendicular to long axis.");
    lines.push("    Abdomen: At the navel, horizontal, parallel to the floor.");
    lines.push("  Formula: % BF = 86.010 × log10(abdomen − neck) − 70.041 × log10(height) + 36.76");
  } else {
    lines.push("  Female measurement sites:");
    lines.push("    Neck: Measure just below the larynx, perpendicular to long axis.");
    lines.push("    Waist: At the narrowest point, typically above the navel.");
    lines.push("    Hips: At the maximum extension of the buttocks.");
    lines.push("  Formula: % BF = 163.205 × log10(waist + hip − neck) − 97.684 × log10(height) − 78.387");
  }
  lines.push("  All measurements in inches. Height in inches. Perform twice, average.");
  lines.push("");
  lines.push("ARMY BODY COMPOSITION TRAINING PROTOCOL");
  lines.push(DIV);
  lines.push("  Per AR 600-9, soldiers flagged for body composition must complete");
  lines.push("  a monitored Body Composition Improvement Program (BCIP) which includes:");
  lines.push("");
  lines.push("  Physical Training (5 days/week minimum):");
  lines.push("    - 45–60 min aerobic training at 60–80% max HR (cardio priority).");
  lines.push("    - 3 days strength training: full-body compound movements.");
  lines.push("    - Include at least 20–30 min Zone 2 cardio every session.");
  lines.push("");
  lines.push("  Nutrition counseling:");
  lines.push("    - Army provides nutritional counseling through Military Treatment Facilities.");
  lines.push("    - Civilian equivalent: USDA MyPlate + 300–500 calorie deficit.");
  lines.push("    - High-protein diet: 0.7–1.0g/lb bodyweight.");
  lines.push("");
  lines.push("  Progress Assessment:");
  lines.push("    - Monthly tape measurements using Army circumference method.");
  lines.push("    - Weigh-in: Same time each day, after voiding, before eating.");
  lines.push("    - Army goal: 1–2 lb per week fat loss maximum (to preserve muscle).");
  lines.push("");
  lines.push(LINE);
  lines.push("  Source: AR 600-9 (2019). Public domain. Issued by Department of the Army.");
  lines.push("  Concealed Florida — concealedfl.com");
  lines.push(LINE);
  return lines;
}

function neuromotorCivilian(gender: Gender, date: string): string[] {
  const lines: string[] = [];
  lines.push(...header("Neuromotor / Balance — Civilian Guide", "Single-Leg Balance, Eyes Closed", gender, date));
  lines.push("SOURCE & AUTHORITY");
  lines.push(DIV);
  lines.push("  ACSM's Guidelines for Exercise Testing and Prescription, 11th Ed.");
  lines.push("  CDC STEADI Program — Stopping Elderly Accidents, Deaths & Injuries");
  lines.push("  National Strength and Conditioning Association (NSCA) — Balance Norms");
  lines.push("  Journal of Aging Research (Springer) — Proprioceptive Training Studies");
  lines.push("");
  lines.push(...standardsTable("neuromotor", gender, "Neuromotor / Balance", "Single-Leg Balance — eyes closed (seconds)"));
  lines.push("WHY EYES-CLOSED BALANCE IS THE STANDARD");
  lines.push(DIV);
  lines.push("  The eyes-closed single-leg stand removes visual compensation and tests");
  lines.push("  true proprioception — your nervous system's ability to detect position");
  lines.push("  without visual input. This is the primary system that catches you when");
  lines.push("  you slip, stumble, or are startled in darkness or under stress.");
  lines.push("  Research: A sub-10-second eyes-closed SLS in adults under 60 predicts");
  lines.push("  significantly elevated fall risk (Springer Nature, 2022).");
  lines.push("");
  lines.push("HOW TO PERFORM THE TEST");
  lines.push(DIV);
  lines.push("  1. Remove shoes. Stand barefoot on a hard, flat surface.");
  lines.push("  2. Place hands on hips. Close eyes.");
  lines.push("  3. Lift one foot approximately 6 inches off the floor.");
  lines.push("  4. Start timer the moment the foot lifts.");
  lines.push("  5. Stop timer when:");
  lines.push("     - The raised foot touches the floor OR");
  lines.push("     - The raised foot touches the standing leg OR");
  lines.push("     - Eyes open OR");
  lines.push("     - Hands leave hips OR");
  lines.push("     - The standing foot moves");
  lines.push("  6. Perform 3 trials each leg. Record the best result.");
  lines.push("  Safety: Perform near a wall. If you lose balance, catch yourself.");
  lines.push("");
  lines.push("8-WEEK BALANCE AND NEUROMOTOR PROGRAM");
  lines.push(DIV);
  lines.push("  Frequency: Daily. Balance training is safe every day.");
  lines.push("  Best practiced: Barefoot on hard floor. Progress to unstable surfaces.");
  lines.push("");
  lines.push("  PROGRESSION LADDER (start at your current level):");
  lines.push("  Level 1: Two-leg stand, eyes closed, 60 seconds");
  lines.push("  Level 2: Single-leg stand, eyes open, 60 seconds");
  lines.push("  Level 3: Single-leg stand, eyes closed, 10–15 seconds");
  lines.push("  Level 4: Single-leg stand, eyes closed, 20–30 seconds");
  lines.push("  Level 5: Single-leg stand on balance board, eyes open, 30 seconds");
  lines.push("  Level 6: Single-leg stand on balance board, eyes closed, 15+ seconds");
  lines.push("");
  lines.push("  WEEK 1–2  (Establish Baseline)");
  lines.push("    Daily: Single-leg stand eyes-open 3 × 30 sec each leg");
  lines.push("           Single-leg stand eyes-closed 3 × 10 sec each leg (near wall)");
  lines.push("    Exercises: Single-leg deadlift (bodyweight) 3 × 10 each leg");
  lines.push("               Step-up on a 12\" box 3 × 12 each leg");
  lines.push("");
  lines.push("  WEEK 3–4  (Eyes-Closed Progression)");
  lines.push("    Daily: Single-leg stand eyes-closed 3 × 20 sec each leg");
  lines.push("    Exercises: Single-leg deadlift (light dumbbell 10–15 lb) 3 × 10");
  lines.push("               Lateral step-up 3 × 10 each leg");
  lines.push("               BOSU or balance board eyes-open 3 × 30 sec");
  lines.push("");
  lines.push("  WEEK 5–6  (Loaded Instability)");
  lines.push("    Daily: Single-leg stand eyes-closed 3 × 30 sec each leg");
  lines.push("    Exercises: Single-leg RDL with dumbbell (20–30 lb) 3 × 8");
  lines.push("               Bosu single-leg balance eyes-closed 3 × 20 sec");
  lines.push("               Agility ladder: two-foot and one-foot drills 5 min");
  lines.push("");
  lines.push("  WEEK 7–8  (Test Prep)");
  lines.push("    Daily: SLS eyes-closed 3 × max hold each leg");
  lines.push("    Exercises: Full balance circuit + test simulation on Day 8");
  lines.push("");
  lines.push(LINE);
  lines.push("  Concealed Florida — concealedfl.com");
  lines.push(LINE);
  return lines;
}

function neuromotorMilitary(gender: Gender, date: string): string[] {
  const lines: string[] = [];
  lines.push(...header("Neuromotor / Balance — Military Standard Guide", "Army PRT Agility & Balance Drills", gender, date));
  lines.push("SOURCE & AUTHORITY");
  lines.push(DIV);
  lines.push("  Army FM 7-22 — Conditioning Drill 2 (CD2) and Agility Drills");
  lines.push("  Army ACFT — Sprint Drag Carry (SDC) Agility Demands");
  lines.push("  Army Combat Readiness Test — Lateral Movement and Balance Standards");
  lines.push("");
  lines.push(...standardsTable("neuromotor", gender, "Neuromotor / Balance", "Single-Leg Balance — eyes closed (seconds)"));
  lines.push("MILITARY CONTEXT FOR BALANCE AND NEUROMOTOR FITNESS");
  lines.push(DIV);
  lines.push("  Army FM 7-22 identifies 'agility' and 'coordination' as key physical");
  lines.push("  domains. Soldiers must move rapidly over uneven terrain, change direction");
  lines.push("  under load, and maintain balance while using equipment or supporting");
  lines.push("  a casualty. The ACFT Sprint Drag Carry (SDC) tests lateral agility");
  lines.push("  directly (50m lateral shuffle while carrying equipment).");
  lines.push("");
  lines.push("ARMY CONDITIONING DRILL 2 (CD2) — NEUROMOTOR FOCUS");
  lines.push(DIV);
  lines.push("  Per FM 7-22, CD2 is the primary agility and coordination circuit.");
  lines.push("  Perform all exercises in sequence with 10 reps each (5 each side):");
  lines.push("");
  lines.push("  CD2 Exercise 1 — Power Jump");
  lines.push("    Start: Standing, feet shoulder-width. Action: Full squat, then");
  lines.push("    explosive jump to full extension, arms overhead. Controlled landing.");
  lines.push("");
  lines.push("  CD2 Exercise 2 — V-Up");
  lines.push("    Start: On back, arms and legs extended. Action: Simultaneously lift");
  lines.push("    arms and legs to form a V. Controlled return.");
  lines.push("");
  lines.push("  CD2 Exercise 3 — Mountain Climber");
  lines.push("    Start: Push-up position. Action: Alternate driving knees to chest");
  lines.push("    rapidly for 30 seconds. Core and hip flexor coordination.");
  lines.push("");
  lines.push("  CD2 Exercise 4 — Leg Tuck and Twist");
  lines.push("    Start: On back, knees to chest. Action: Extend legs and rotate knees");
  lines.push("    to each side alternately. Control through full range of motion.");
  lines.push("");
  lines.push("  CD2 Exercise 5 — Single-Leg Dead Lift");
  lines.push("    Start: Standing one-leg. Action: Hinge at hip, reach forward hand");
  lines.push("    toward floor while extending the free leg behind. Return upright.");
  lines.push("    Balance + hip hinge + posterior chain. 10 reps each leg.");
  lines.push("");
  lines.push("ARMY SDC LATERAL SHUFFLE PREPARATION");
  lines.push(DIV);
  lines.push("  The ACFT SDC includes a 50m lateral shuffle (5m × 5 each direction).");
  lines.push("  Training drills per FM 7-22:");
  lines.push("    - Shuttle run: 5m × 6 sprints, touch the line on each end.");
  lines.push("    - Lateral shuffle: 10m down-back × 4 sets, push off outside foot.");
  lines.push("    - Zig-zag agility course: cones at 2m spacing, sharp cuts each cone.");
  lines.push("    - Box drill: 4 cones in a square, all 4 movement patterns (sprint,");
  lines.push("      lateral, back-pedal, diagonal) × 3 rounds.");
  lines.push("");
  lines.push("8-WEEK MILITARY NEUROMOTOR PROGRAM");
  lines.push(DIV);
  lines.push("  Week 1–2: CD2 circuit daily + single-leg stands 3 × 30s each.");
  lines.push("  Week 3–4: CD2 + agility ladder (5 patterns × 3 reps) + SLS eyes-closed.");
  lines.push("  Week 5–6: CD2 + SDC lateral shuffle simulation + SLS BOSU 3 × 20s.");
  lines.push("  Week 7–8: Full CD2 × 3 rounds + SDC full simulation + SLS max holds.");
  lines.push("");
  lines.push(LINE);
  lines.push("  Source: Army FM 7-22 (2020). Public domain.");
  lines.push("  Concealed Florida — concealedfl.com");
  lines.push(LINE);
  return lines;
}

// ── Assessment Sheet Generator ──────────────────────────────────────────────

function assessmentSheet(catKey: keyof CategoryRow, gender: Gender, date: string): string[] {
  const cat = fitnessCategories.find((c) => c.key === catKey)!;
  const standards = gender === "male" ? maleStandards : femaleStandards;
  const lines: string[] = [];
  const genderLabel = gender === "male" ? "Male" : "Female";

  lines.push(LINE);
  lines.push(`  CONCEALED FLORIDA — FITNESS ASSESSMENT SHEET`);
  lines.push(`  ${cat.name} | ${genderLabel}`);
  lines.push(`  Test: ${cat.test}`);
  lines.push(LINE);
  lines.push(`  Date of Assessment : ___________________________`);
  lines.push(`  Assessor Name      : ___________________________`);
  lines.push(`  Subject Name       : ___________________________`);
  lines.push(`  Subject Age        : _______   Age Group: _______`);
  lines.push(`  Subject Bodyweight : _______ lbs   Height: _______ in`);
  lines.push(LINE);
  lines.push("");
  lines.push("PRE-TEST REQUIREMENTS");
  lines.push(DIV);
  lines.push("  [ ] Subject has not engaged in intense exercise in past 24 hours.");
  lines.push("  [ ] Subject is adequately hydrated.");
  lines.push("  [ ] Appropriate footwear / environment confirmed.");
  lines.push("  [ ] Safety equipment present (spotter, mat, wall for balance, etc.).");
  lines.push("  [ ] Subject has reviewed the test protocol and understands the standard.");
  lines.push("");
  lines.push("TEST PROTOCOL — STEP BY STEP");
  lines.push(DIV);
  lines.push(`  Test: ${cat.test}`);
  lines.push("");
  lines.push(cat.howToTest.split(". ").map((s, i) => `  ${i + 1}. ${s.trim()}.`).join("\n"));
  lines.push("");
  lines.push("RESULT RECORDING");
  lines.push(DIV);
  lines.push(`  Trial 1: _______________`);
  lines.push(`  Trial 2: _______________`);
  lines.push(`  Trial 3: _______________`);
  lines.push(`  Best Result: _______________`);
  lines.push(`  Unit: ${cat.test.includes("miles") ? "miles" : cat.test.includes("lbs") ? "lbs" : cat.test.includes("seconds") ? "seconds" : cat.test.includes("inches") ? "inches" : cat.test.includes("%") ? "%" : "value"}`);
  lines.push("");
  lines.push("STANDARDS COMPARISON TABLE");
  lines.push(DIV);
  lines.push(`  Gender: ${genderLabel}`);
  lines.push(`  Category: ${cat.name}`);
  lines.push("");
  lines.push(`  Age Group   | Baseline (Civilian) Standard | Military Standard  | Your Result`);
  lines.push(`  ------------|------------------------------|--------------------|-----------`);
  for (const ag of ageGroups) {
    const row = standards[ag.key as AgeKey];
    const bl  = row.baseline[catKey] ?? "N/A";
    const mil = row.military[catKey] ?? "N/A";
    const label = ag.label.padEnd(11);
    lines.push(`  ${label} | ${String(bl).padEnd(28)} | ${String(mil).padEnd(18)} | `);
  }
  lines.push("");
  lines.push("PASS / FAIL DETERMINATION");
  lines.push(DIV);
  lines.push(`  Subject Age Group   : ___________________________`);
  lines.push(`  Subject's Result    : ___________________________`);
  lines.push(`  Baseline Standard   : ___________________________`);
  lines.push(`  Military Standard   : ___________________________`);
  lines.push("");
  lines.push(`  [ ] PASS — Baseline   (meets or exceeds civilian standard for age group)`);
  lines.push(`  [ ] PASS — Military   (meets or exceeds military standard for age group)`);
  lines.push(`  [ ] FAIL — Below Baseline  (result is below civilian standard)`);
  lines.push(`  [ ] CONDITIONAL     (within ___ % of baseline standard)`);
  lines.push("");
  lines.push("PROGRESS TRACKING (repeat assessments over time)");
  lines.push(DIV);
  lines.push(`  Assessment Date      | Result         | Standard Met         | Notes`);
  lines.push(`  ---------------------|----------------|----------------------|---------------------`);
  for (let i = 0; i < 6; i++) {
    lines.push(`  _____________________|________________|______________________|_____________________`);
  }
  lines.push("");
  lines.push("IMPROVEMENT NOTES & RECOMMENDATIONS");
  lines.push(DIV);
  lines.push("  Assessor Observations:");
  lines.push("  _________________________________________________________________________");
  lines.push("  _________________________________________________________________________");
  lines.push("  _________________________________________________________________________");
  lines.push("");
  lines.push("  Recommended Focus Areas:");
  cat.improve.forEach((tip, i) => {
    lines.push(`  ${i + 1}. ${tip}`);
  });
  lines.push("");
  lines.push("CERTIFICATIONS");
  lines.push(DIV);
  lines.push(`  Assessor Signature: ___________________________  Date: _______________`);
  lines.push(`  Subject Signature : ___________________________  Date: _______________`);
  lines.push("");
  lines.push(LINE);
  lines.push("  This document is for fitness tracking and informational purposes only.");
  lines.push("  It does not constitute a medical evaluation. Consult a physician before");
  lines.push("  beginning any new exercise program.");
  lines.push("  Concealed Florida — concealedfl.com");
  lines.push(LINE);
  return lines;
}

// ── Master Generator ─────────────────────────────────────────────────────────

const CIVILIAN_GENERATORS: Record<keyof CategoryRow, (g: Gender, d: string) => string[]> = {
  cardio:      cardioCivilian,
  strength:    strengthCivilian,
  endurance:   enduranceCivilian,
  flexibility: flexibilityCivilian,
  grip:        gripCivilian,
  bodyFat:     bodyFatCivilian,
  neuromotor:  neuromotorCivilian,
};

const MILITARY_GENERATORS: Record<keyof CategoryRow, (g: Gender, d: string) => string[]> = {
  cardio:      cardioMilitary,
  strength:    strengthMilitary,
  endurance:   enduranceMilitary,
  flexibility: flexibilityMilitary,
  grip:        gripMilitary,
  bodyFat:     bodyFatMilitary,
  neuromotor:  neuromotorMilitary,
};

export function generateFitnessGuide(
  catKey: keyof CategoryRow,
  gender: Gender,
  docType: DocType
): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  let lines: string[];
  if (docType === "civilian")   lines = CIVILIAN_GENERATORS[catKey](gender, date);
  else if (docType === "military") lines = MILITARY_GENERATORS[catKey](gender, date);
  else                          lines = assessmentSheet(catKey, gender, date);
  return lines.join("\n");
}

export function buildFilename(catKey: keyof CategoryRow, gender: Gender, docType: DocType, ext: string): string {
  const cat = fitnessCategories.find((c) => c.key === catKey)!;
  const g   = gender === "male" ? "Male" : "Female";
  const d   = docType === "civilian" ? "Civilian_Guide" : docType === "military" ? "Military_Guide" : "Assessment_Sheet";
  return `CF_${g}_${cat.name.replace(/[^a-z0-9]+/gi, "_")}_${d}.${ext}`;
}

// ── Download Helpers ─────────────────────────────────────────────────────────

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadFitnessAsTxt(catKey: keyof CategoryRow, gender: Gender, docType: DocType) {
  const content = generateFitnessGuide(catKey, gender, docType);
  const blob    = new Blob([content], { type: "text/plain;charset=utf-8" });
  triggerDownload(URL.createObjectURL(blob), buildFilename(catKey, gender, docType, "txt"));
}

export function downloadFitnessAsWord(catKey: keyof CategoryRow, gender: Gender, docType: DocType) {
  const raw     = generateFitnessGuide(catKey, gender, docType);
  const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html    = `<html><head><meta charset="utf-8"><title>${buildFilename(catKey, gender, docType, "doc")}</title></head><body style="font-family:Arial,sans-serif;max-width:800px;margin:20px auto;line-height:1.7;white-space:pre-wrap;font-size:12pt">${escaped}</body></html>`;
  const blob    = new Blob([html], { type: "application/msword" });
  triggerDownload(URL.createObjectURL(blob), buildFilename(catKey, gender, docType, "doc"));
}

export function downloadFitnessAsCsv(catKey: keyof CategoryRow, gender: Gender, docType: DocType) {
  const cat       = fitnessCategories.find((c) => c.key === catKey)!;
  const standards = gender === "male" ? maleStandards : femaleStandards;
  const gLabel    = gender === "male" ? "Male" : "Female";
  const docLabel  = docType === "civilian" ? "Civilian" : docType === "military" ? "Military" : "Assessment";
  const rows: string[][] = [];
  rows.push(["Concealed Florida — Fitness Guide", "", "", "", ""]);
  rows.push([`${cat.name}`, gLabel, docLabel, "", ""]);
  rows.push([`Test: ${cat.test}`, "", "", "", ""]);
  rows.push([`Generated`, new Date().toLocaleDateString(), "", "", ""]);
  rows.push(["", "", "", "", ""]);
  rows.push(["Age Group", "Baseline Standard", "Military Standard", "Your Result", "Date"]);
  for (const ag of ageGroups) {
    const row = standards[ag.key as AgeKey];
    rows.push([ag.label, row.baseline[catKey] ?? "", row.military[catKey] ?? "", "", ""]);
  }
  rows.push(["", "", "", "", ""]);
  rows.push(["How to Test:", cat.howToTest, "", "", ""]);
  rows.push(["Improvement Tips:", "", "", "", ""]);
  cat.improve.forEach((tip, i) => rows.push([`${i + 1}.`, tip, "", "", ""]));
  if (docType === "assessment") {
    rows.push(["", "", "", "", ""]);
    rows.push(["TRIAL LOG", "", "", "", ""]);
    rows.push(["Trial", "Date", "Result", "Standard Met (Y/N)", "Notes"]);
    for (let i = 0; i < 6; i++) rows.push([`${i + 1}`, "", "", "", ""]);
  }
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  triggerDownload(URL.createObjectURL(blob), buildFilename(catKey, gender, docType, "csv"));
}

export function printFitnessAsPdf(catKey: keyof CategoryRow, gender: Gender, docType: DocType) {
  const raw     = generateFitnessGuide(catKey, gender, docType);
  const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const w       = window.open("", "_blank");
  if (!w) return;
  const title = buildFilename(catKey, gender, docType, "pdf");
  w.document.write(`<html><head><title>${title}</title><style>body{font-family:monospace;font-size:10pt;white-space:pre-wrap;margin:20px;line-height:1.6}@media print{body{margin:12px;font-size:9pt}}</style></head><body>${escaped}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 400);
}
