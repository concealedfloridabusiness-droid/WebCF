import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// ---------- In-memory cache ----------
interface CacheEntry { data: unknown; ts: number }
const cache = new Map<string, CacheEntry>();
function getCached<T>(key: string, ttlMs: number): T | null {
  const e = cache.get(key);
  return e && Date.now() - e.ts < ttlMs ? (e.data as T) : null;
}
function setCached(key: string, data: unknown) {
  cache.set(key, { data, ts: Date.now() });
}

// ---------- Population centers per state (major cities, all on land) ----------
// Used to generate heatmap points; small scatter radius keeps points on land
const STATE_CITIES: Record<string, [number, number][]> = {
  AL:[[33.52,-86.80],[30.69,-88.04],[32.37,-86.30]],
  AK:[[61.22,-149.90],[64.84,-147.72],[60.56,-151.20]],
  AZ:[[33.45,-112.07],[32.22,-110.97],[33.42,-111.83]],
  AR:[[34.74,-92.29],[35.39,-94.43],[36.36,-94.21]],
  CA:[[34.05,-118.24],[37.77,-122.42],[38.58,-121.49],[32.72,-117.15],[36.74,-119.79],[37.34,-121.89]],
  CO:[[39.74,-104.98],[38.83,-104.82],[39.96,-105.08]],
  CT:[[41.76,-72.68],[41.31,-72.92],[41.18,-73.19]],
  DE:[[39.74,-75.55],[39.16,-75.52]],
  DC:[[38.91,-77.04]],
  FL:[[25.77,-80.19],[28.54,-81.38],[27.96,-82.46],[30.33,-81.66],[30.44,-84.28],[26.12,-80.14]],
  GA:[[33.75,-84.39],[33.47,-82.01],[32.46,-84.99],[32.08,-81.09]],
  HI:[[21.31,-157.82],[19.72,-155.09],[20.89,-156.47]],
  ID:[[43.62,-116.20],[43.59,-116.56],[42.87,-112.45]],
  IL:[[41.85,-87.65],[42.27,-89.09],[41.75,-88.32],[40.69,-89.59]],
  IN:[[39.77,-86.16],[41.13,-85.13],[37.97,-87.56],[41.67,-86.25]],
  IA:[[41.60,-93.61],[42.01,-91.64],[41.52,-90.58]],
  KS:[[37.69,-97.34],[38.98,-94.67],[39.12,-94.63]],
  KY:[[38.25,-85.76],[38.04,-84.50],[37.00,-86.44]],
  LA:[[29.95,-90.07],[30.45,-91.15],[32.53,-93.75],[30.22,-93.22]],
  ME:[[43.66,-70.26],[44.31,-69.78],[44.80,-68.78]],
  MD:[[39.29,-76.61],[39.07,-76.99],[38.97,-76.50]],
  MA:[[42.36,-71.06],[42.27,-71.80],[42.10,-72.59],[42.65,-71.32]],
  MI:[[42.33,-83.05],[42.96,-85.66],[42.73,-84.56],[43.01,-83.69]],
  MN:[[44.98,-93.27],[44.95,-93.09],[46.79,-92.10]],
  MS:[[32.30,-90.18],[30.39,-89.00],[31.33,-89.32]],
  MO:[[38.63,-90.20],[39.10,-94.58],[37.21,-93.29]],
  MT:[[45.78,-108.50],[46.87,-114.02],[47.50,-111.30]],
  NE:[[41.26,-96.01],[40.81,-96.68],[41.14,-95.91]],
  NV:[[36.17,-115.14],[39.53,-119.81],[36.03,-115.03]],
  NH:[[42.99,-71.46],[42.76,-71.47],[43.21,-71.54]],
  NJ:[[40.74,-74.17],[40.73,-74.04],[40.92,-74.17],[40.22,-74.76]],
  NM:[[35.08,-106.65],[32.32,-106.77],[35.69,-105.94]],
  NY:[[40.71,-74.01],[42.89,-78.88],[43.16,-77.61],[42.65,-73.76],[43.05,-76.15]],
  NC:[[35.23,-80.84],[35.78,-78.64],[36.07,-79.79],[35.99,-78.90],[36.00,-80.24]],
  ND:[[46.88,-96.79],[46.81,-100.78],[47.92,-97.03]],
  OH:[[39.96,-82.99],[41.50,-81.69],[39.10,-84.51],[41.66,-83.56]],
  OK:[[35.47,-97.52],[36.15,-95.99],[35.22,-97.44]],
  OR:[[45.52,-122.68],[44.94,-123.03],[44.05,-123.09],[45.52,-122.67]],
  PA:[[39.95,-75.17],[40.44,-79.99],[40.61,-75.49],[41.40,-75.67]],
  RI:[[41.82,-71.42],[41.78,-71.43],[41.70,-71.42]],
  SC:[[34.00,-81.03],[32.78,-79.94],[34.85,-82.39]],
  SD:[[43.54,-96.73],[44.08,-103.23],[45.46,-98.49]],
  TN:[[36.17,-86.78],[35.15,-90.05],[35.96,-83.92],[35.12,-89.94]],
  TX:[[29.76,-95.37],[32.79,-96.80],[29.42,-98.49],[30.27,-97.74],[32.75,-97.33],[31.76,-106.49],[27.80,-97.40]],
  UT:[[40.76,-111.89],[40.69,-112.00],[40.23,-111.66],[37.10,-113.58]],
  VT:[[44.48,-73.21],[44.47,-73.21],[43.61,-72.97]],
  VA:[[36.85,-76.29],[36.94,-76.29],[37.54,-77.43],[38.88,-77.10],[37.27,-79.94]],
  WA:[[47.61,-122.33],[47.66,-117.43],[47.25,-122.44],[47.99,-122.20]],
  WV:[[38.35,-81.63],[38.42,-82.43],[39.63,-79.96]],
  WI:[[43.04,-87.91],[43.07,-89.40],[44.52,-88.02],[43.85,-91.25]],
  WY:[[41.14,-104.82],[42.87,-106.31],[41.31,-105.59]],
};

// ---------- Static Level 1 & 2 Trauma Centers ----------
const TRAUMA_CENTERS = [
  { name:"R Adams Cowley Shock Trauma Center",address:"22 S Greene St, Baltimore, MD",level:1,lat:39.2899,lng:-76.6205,phone:"410-328-6367" },
  { name:"UCSF Medical Center",address:"500 Parnassus Ave, San Francisco, CA",level:1,lat:37.7632,lng:-122.4574,phone:"415-476-1000" },
  { name:"LAC+USC Medical Center",address:"2051 Marengo St, Los Angeles, CA",level:1,lat:34.0573,lng:-118.2044,phone:"323-409-1000" },
  { name:"Grady Memorial Hospital",address:"80 Jesse Hill Jr Dr SE, Atlanta, GA",level:1,lat:33.7479,lng:-84.3861,phone:"404-616-1000" },
  { name:"Jackson Memorial Hospital",address:"1611 NW 12th Ave, Miami, FL",level:1,lat:25.7901,lng:-80.2125,phone:"305-585-1111" },
  { name:"Tampa General Hospital",address:"1 Tampa General Cir, Tampa, FL",level:1,lat:27.9345,lng:-82.4620,phone:"813-844-7000" },
  { name:"Mayo Clinic",address:"200 First St SW, Rochester, MN",level:1,lat:44.0228,lng:-92.4663,phone:"507-284-2511" },
  { name:"Massachusetts General Hospital",address:"55 Fruit St, Boston, MA",level:1,lat:42.3632,lng:-71.0686,phone:"617-726-2000" },
  { name:"Johns Hopkins Hospital",address:"1800 Orleans St, Baltimore, MD",level:1,lat:39.2963,lng:-76.5920,phone:"410-955-5000" },
  { name:"Northwestern Memorial Hospital",address:"251 E Huron St, Chicago, IL",level:1,lat:41.8952,lng:-87.6219,phone:"312-926-2000" },
  { name:"University of Chicago Medical Center",address:"5841 S Maryland Ave, Chicago, IL",level:1,lat:41.7891,lng:-87.6028,phone:"773-702-1000" },
  { name:"Parkland Memorial Hospital",address:"5200 Harry Hines Blvd, Dallas, TX",level:1,lat:32.8126,lng:-96.8407,phone:"214-590-8000" },
  { name:"Ben Taub Hospital",address:"1504 Taub Loop, Houston, TX",level:1,lat:29.7169,lng:-95.4010,phone:"713-873-2000" },
  { name:"University Hospital San Antonio",address:"4502 Medical Dr, San Antonio, TX",level:1,lat:29.5077,lng:-98.5736,phone:"210-743-3000" },
  { name:"Denver Health Medical Center",address:"777 Bannock St, Denver, CO",level:1,lat:39.7216,lng:-104.9885,phone:"303-436-6000" },
  { name:"Harborview Medical Center",address:"325 9th Ave, Seattle, WA",level:1,lat:47.6020,lng:-122.3337,phone:"206-744-3000" },
  { name:"Oregon Health & Science University",address:"3181 SW Sam Jackson Park Rd, Portland, OR",level:1,lat:45.4975,lng:-122.6869,phone:"503-494-8311" },
  { name:"University of New Mexico Hospital",address:"2211 Lomas Blvd NE, Albuquerque, NM",level:1,lat:35.0840,lng:-106.6555,phone:"505-272-2111" },
  { name:"Detroit Receiving Hospital",address:"4201 St Antoine St, Detroit, MI",level:1,lat:42.3566,lng:-83.0555,phone:"313-745-3000" },
  { name:"Cooper University Hospital",address:"1 Cooper Plaza, Camden, NJ",level:1,lat:39.9394,lng:-75.1184,phone:"800-826-6737" },
  { name:"Temple University Hospital",address:"3401 N Broad St, Philadelphia, PA",level:1,lat:39.9998,lng:-75.1539,phone:"800-836-7536" },
  { name:"Vanderbilt University Medical Center",address:"1211 Medical Center Dr, Nashville, TN",level:1,lat:36.1432,lng:-86.8006,phone:"615-322-5000" },
  { name:"University of Louisville Hospital",address:"530 S Jackson St, Louisville, KY",level:1,lat:38.2454,lng:-85.7584,phone:"502-562-3000" },
  { name:"Wake Forest Baptist Medical Center",address:"1 Medical Center Blvd, Winston-Salem, NC",level:1,lat:36.0949,lng:-80.3430,phone:"336-716-2011" },
  { name:"MUSC Medical Center",address:"169 Ashley Ave, Charleston, SC",level:1,lat:32.7836,lng:-79.9541,phone:"843-792-2300" },
  { name:"UAB Hospital",address:"1802 6th Ave S, Birmingham, AL",level:1,lat:33.5048,lng:-86.8015,phone:"205-934-4011" },
  { name:"University of Mississippi Medical Center",address:"2500 N State St, Jackson, MS",level:1,lat:32.3515,lng:-90.1839,phone:"601-984-1000" },
  { name:"University of Iowa Hospitals",address:"200 Hawkins Dr, Iowa City, IA",level:1,lat:41.6605,lng:-91.5268,phone:"319-356-1616" },
  { name:"Nebraska Medical Center",address:"4400 Emile St, Omaha, NE",level:1,lat:41.2526,lng:-96.0258,phone:"402-559-2000" },
  { name:"University of Utah Hospital",address:"50 N Medical Dr, Salt Lake City, UT",level:1,lat:40.7660,lng:-111.8382,phone:"801-581-2121" },
  { name:"Eskenazi Health",address:"720 Eskenazi Ave, Indianapolis, IN",level:1,lat:39.7787,lng:-86.1768,phone:"317-880-0000" },
  { name:"UF Health Shands Hospital",address:"1600 SW Archer Rd, Gainesville, FL",level:1,lat:29.6378,lng:-82.3443,phone:"352-733-0111" },
  { name:"Ryder Trauma Center",address:"1800 NW 10th Ave, Miami, FL",level:1,lat:25.7980,lng:-80.2128,phone:"305-585-1234" },
  { name:"Intermountain Medical Center",address:"5121 S Cottonwood St, Murray, UT",level:2,lat:40.6574,lng:-111.8894,phone:"801-507-7000" },
  { name:"Swedish Medical Center",address:"501 E Hampden Ave, Englewood, CO",level:2,lat:39.6490,lng:-104.9853,phone:"303-788-5000" },
  { name:"Regions Hospital",address:"640 Jackson St, St Paul, MN",level:1,lat:44.9588,lng:-93.0945,phone:"651-254-3456" },
  { name:"Albany Medical Center",address:"43 New Scotland Ave, Albany, NY",level:1,lat:42.6530,lng:-73.7750,phone:"518-262-3125" },
  { name:"Strong Memorial Hospital",address:"601 Elmwood Ave, Rochester, NY",level:1,lat:43.1236,lng:-77.6268,phone:"585-275-2100" },
  { name:"Yale New Haven Hospital",address:"20 York St, New Haven, CT",level:1,lat:41.3036,lng:-72.9381,phone:"203-688-4242" },
  { name:"Rhode Island Hospital",address:"593 Eddy St, Providence, RI",level:1,lat:41.8197,lng:-71.4108,phone:"401-444-4000" },
];

// ---------- YouTube data ----------
interface YtVideo {
  id: string; title: string; channelId: string; channelName: string;
  thumbnail: string; publishedAt: string; url: string;
}

const DUMMY_CHANNELS = [
  // Legal
  { id:"UCfGMSLRjSoxbkSIi8i3jf3g",name:"US LawShield",handle:"@USLawShield",description:"Legal protection for gun owners — use-of-force coverage, attorney access, and post-incident defense support.",category:"Legal" },
  { id:"UCArmedScholar",name:"Armed Scholar",handle:"@ArmedScholar",description:"In-depth 2A legal analysis — court cases, legislation, and your constitutional rights explained clearly.",category:"Legal" },
  // News
  { id:"UCchannel4placeholder",name:"Gun Owners of America",handle:"@GunOwnersofAmerica",description:"No-compromise gun rights advocacy and legislative updates from one of America's leading 2A organizations.",category:"News" },
  { id:"UCAmericaUncovered",name:"America Uncovered",handle:"@AmericaUncovered",description:"Investigative news and political analysis covering stories the mainstream media won't touch.",category:"News" },
  // Advocate
  { id:"UCYGhQKVEkUVi5kBf-VRBHXA",name:"Colion Noir",handle:"@ColionNoir",description:"2A attorney, advocate, and cultural voice — cutting through misinformation on gun rights and self-defense.",category:"Advocate" },
  { id:"UCBrandonHerrera",name:"Brandon Herrera",handle:"@BrandonHerrera",description:"The AK Guy — high-energy firearms content, AK builds, gun culture, and unapologetic 2A advocacy.",category:"Advocate" },
  // Education
  { id:"UCjT4wSZFVFXxIulhTen3RXw",name:"Active Self Protection",handle:"@ActiveSelfProtection",description:"Real-world self-defense analysis and after-action review from law enforcement and civilian encounters.",category:"Education" },
  { id:"UCDirtyCivilian",name:"Dirty Civilian",handle:"@dirty-civilian",description:"No-fluff, street-applicable firearms and self-defense content from a civilian perspective that actually fights back.",category:"Education" },
  { id:"UCFalconClaw",name:"FalconClaw",handle:"@falconclaw_",description:"Firearms education, EDC, and preparedness content focused on practical skills for real-world scenarios.",category:"Education" },
  { id:"UCwranglerstar",name:"Wranglerstar",handle:"@wranglerstar",description:"Homesteading, off-grid living, and self-reliance skills from a Pacific Northwest family — practical preparedness rooted in hard work and Christian values.",category:"Education" },
  { id:"UCPrepMedic",name:"Prep Medic",handle:"@PrepMedic",description:"Tactical medicine and medical preparedness for civilians — tourniquet application, wound care, trauma kits, and TCCC-level skills explained clearly.",category:"Education" },
  // Gun News
  { id:"UCgun_collective",name:"The Gun Collective",handle:"@theGunCollective",description:"60-second gun news covering the latest firearm releases, industry updates, and Second Amendment developments.",category:"Gun News" },
  // Intel
  { id:"UCs2_underground",name:"S2 Underground",handle:"@s2underground",description:"Daily situational intelligence briefings — The Wire covers threat patterns, civil unrest, geopolitical developments, and preparedness-relevant events.",category:"Intel" },
];

const DUMMY_WIRE_VIDEOS: YtVideo[] = [
  { id:"wire_d001",title:"The Wire — April 14, 2026",channelId:"UCs2_underground",channelName:"S2 Underground",thumbnail:"https://picsum.photos/seed/wire001/480/270",publishedAt:"2026-04-14T07:00:00Z",url:"https://www.youtube.com/@s2underground" },
  { id:"wire_d002",title:"The Wire — April 13, 2026",channelId:"UCs2_underground",channelName:"S2 Underground",thumbnail:"https://picsum.photos/seed/wire002/480/270",publishedAt:"2026-04-13T07:00:00Z",url:"https://www.youtube.com/@s2underground" },
  { id:"wire_d003",title:"The Wire — April 12, 2026",channelId:"UCs2_underground",channelName:"S2 Underground",thumbnail:"https://picsum.photos/seed/wire003/480/270",publishedAt:"2026-04-12T07:00:00Z",url:"https://www.youtube.com/@s2underground" },
  { id:"wire_d004",title:"The Wire — April 11, 2026",channelId:"UCs2_underground",channelName:"S2 Underground",thumbnail:"https://picsum.photos/seed/wire004/480/270",publishedAt:"2026-04-11T07:00:00Z",url:"https://www.youtube.com/@s2underground" },
  { id:"wire_d005",title:"The Wire — April 10, 2026",channelId:"UCs2_underground",channelName:"S2 Underground",thumbnail:"https://picsum.photos/seed/wire005/480/270",publishedAt:"2026-04-10T07:00:00Z",url:"https://www.youtube.com/@s2underground" },
];

const DUMMY_VIDEOS: YtVideo[] = [
  { id:"dummy_vid_001",title:"Why You Must Understand Use of Force Law Before You Carry",channelId:"UCfGMSLRjSoxbkSIi8i3jf3g",channelName:"US LawShield",thumbnail:"https://picsum.photos/seed/vid001/480/270",publishedAt:"2025-04-08T14:00:00Z",url:"https://www.youtube.com/watch?v=example001" },
  { id:"dummy_vid_002",title:"ADRENALINE DUMP — How to Train for Real-World Stress",channelId:"UCjT4wSZFVFXxIulhTen3RXw",channelName:"Active Self Protection",thumbnail:"https://picsum.photos/seed/vid002/480/270",publishedAt:"2025-04-07T18:30:00Z",url:"https://www.youtube.com/watch?v=example002" },
  { id:"dummy_vid_003",title:"The Truth About Florida's New Permitless Carry Law",channelId:"UCYGhQKVEkUVi5kBf-VRBHXA",channelName:"Colion Noir",thumbnail:"https://picsum.photos/seed/vid003/480/270",publishedAt:"2025-04-06T12:00:00Z",url:"https://www.youtube.com/watch?v=example003" },
  { id:"dummy_vid_004",title:"Congress vs. the Second Amendment: What's Coming in 2025",channelId:"UCchannel4placeholder",channelName:"Gun Owners of America",thumbnail:"https://picsum.photos/seed/vid004/480/270",publishedAt:"2025-04-05T09:00:00Z",url:"https://www.youtube.com/watch?v=example004" },
  { id:"dummy_vid_005",title:"Parking Lot Attack — What He Did Right and Wrong",channelId:"UCjT4wSZFVFXxIulhTen3RXw",channelName:"Active Self Protection",thumbnail:"https://picsum.photos/seed/vid005/480/270",publishedAt:"2025-04-04T16:00:00Z",url:"https://www.youtube.com/watch?v=example005" },
  { id:"dummy_vid_006",title:"The Gun Community Has a Problem — Let's Talk About It",channelId:"UCYGhQKVEkUVi5kBf-VRBHXA",channelName:"Colion Noir",thumbnail:"https://picsum.photos/seed/vid006/480/270",publishedAt:"2025-04-03T11:00:00Z",url:"https://www.youtube.com/watch?v=example006" },
  { id:"dummy_vid_007",title:"Can You Legally Defend Someone Else? Florida Law Explained",channelId:"UCfGMSLRjSoxbkSIi8i3jf3g",channelName:"US LawShield",thumbnail:"https://picsum.photos/seed/vid007/480/270",publishedAt:"2025-04-02T10:00:00Z",url:"https://www.youtube.com/watch?v=example007" },
  { id:"dummy_vid_008",title:"Red Flag Laws Are Spreading — Here's the Map",channelId:"UCchannel4placeholder",channelName:"Gun Owners of America",thumbnail:"https://picsum.photos/seed/vid008/480/270",publishedAt:"2025-04-01T08:00:00Z",url:"https://www.youtube.com/watch?v=example008" },
  { id:"dummy_vid_009",title:"Castle Doctrine vs. Stand Your Ground — Know the Difference",channelId:"UCnra_ila_legal",channelName:"NRA-ILA",thumbnail:"https://picsum.photos/seed/vid009/480/270",publishedAt:"2025-03-30T09:00:00Z",url:"https://www.youtube.com/watch?v=example009" },
  { id:"dummy_vid_010",title:"Ammo Selection for Self-Defense: What the Data Actually Shows",channelId:"UCpaul_harrell_edu",channelName:"Paul Harrell",thumbnail:"https://picsum.photos/seed/vid010/480/270",publishedAt:"2025-03-28T15:00:00Z",url:"https://www.youtube.com/watch?v=example010" },
  { id:"dummy_vid_011",title:"Warrior Mindset: Staying Ready Without Living in Fear",channelId:"UCwps_advocate",channelName:"Warrior Poet Society",thumbnail:"https://picsum.photos/seed/vid011/480/270",publishedAt:"2025-03-26T11:00:00Z",url:"https://www.youtube.com/watch?v=example011" },
  { id:"dummy_vid_012",title:"FPC Takes on Unconstitutional Magazine Ban in Federal Court",channelId:"UCfpc_guns_legal",channelName:"Firearms Policy Coalition",thumbnail:"https://picsum.photos/seed/vid012/480/270",publishedAt:"2025-03-24T08:00:00Z",url:"https://www.youtube.com/watch?v=example012" },
  { id:"gc_d001",title:"60 Seconds: Glock G47 MOS — Duty Pistol Standard Review",channelId:"UCgun_collective",channelName:"The Gun Collective",thumbnail:"https://picsum.photos/seed/gc001/480/270",publishedAt:"2026-04-14T12:00:00Z",url:"https://www.youtube.com/@theGunCollective" },
  { id:"gc_d002",title:"60 Seconds: Sig P365 XL — The New Everyday Carry Option",channelId:"UCgun_collective",channelName:"The Gun Collective",thumbnail:"https://picsum.photos/seed/gc002/480/270",publishedAt:"2026-04-13T12:00:00Z",url:"https://www.youtube.com/@theGunCollective" },
  ...DUMMY_WIRE_VIDEOS,
];

// ---------- YouTube API helpers ----------
const YT_CHAN_TTL  = 7 * 24 * 60 * 60 * 1000; // 7 days  (uploads playlist ID)
const YT_VIDS_TTL = 2 * 60 * 60 * 1000;       // 2 hours (video list)

async function fetchYtUploadsId(apiKey: string, handle: string): Promise<string | null> {
  const cacheKey = `yt_chan_${handle}`;
  const cached = getCached<string>(cacheKey, YT_CHAN_TTL);
  if (cached) return cached;
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`;
  const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const json = await r.json() as any;
  const uploadsId: string | undefined = json.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) return null;
  setCached(cacheKey, uploadsId);
  return uploadsId;
}

async function fetchYtChannelVideos(apiKey: string, handle: string, maxResults = 5): Promise<YtVideo[]> {
  const cacheKey = `yt_vids_${handle}_${maxResults}`;
  const cached = getCached<YtVideo[]>(cacheKey, YT_VIDS_TTL);
  if (cached) return cached;
  const uploadsId = await fetchYtUploadsId(apiKey, handle);
  if (!uploadsId) return [];
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=${maxResults}&key=${apiKey}`;
  const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const json = await r.json() as any;
  const videos: YtVideo[] = (json.items ?? [])
    .map((item: any) => {
      const vid: string | undefined = item.snippet?.resourceId?.videoId;
      if (!vid) return null;
      return {
        id: vid,
        title: item.snippet?.title ?? "",
        channelId: item.snippet?.channelId ?? "",
        channelName: item.snippet?.channelTitle ?? "",
        thumbnail: item.snippet?.thumbnails?.medium?.url ?? item.snippet?.thumbnails?.default?.url ?? "",
        publishedAt: item.snippet?.publishedAt ?? "",
        url: `https://www.youtube.com/watch?v=${vid}`,
      };
    })
    .filter(Boolean) as YtVideo[];
  setCached(cacheKey, videos);
  return videos;
}

// All channel handles to pull for the Liberty Watch feed
const LIVE_CHANNEL_HANDLES = [
  "USLawShield","ArmedScholar",
  "GunOwnersofAmerica","AmericaUncovered",
  "ColionNoir","BrandonHerrera",
  "ActiveSelfProtection","dirty-civilian","falconclaw_",
  "theGunCollective","s2underground",
];

const TTL = {
  CRIME: 24*60*60*1000,
  WEATHER: 10*60*1000,
  FEMA: 60*60*1000,
  HOSPITALS: 7*24*60*60*1000,
};

export async function registerRoutes(app: Express): Promise<Server> {
  // ---- News routes ----
  app.get("/api/news/channels", (_req, res) => {
    res.json({ channels: DUMMY_CHANNELS });
  });

  app.get("/api/news/videos", async (_req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return res.json({ videos: DUMMY_VIDEOS, source: "dummy" });
    try {
      const results = await Promise.allSettled(
        LIVE_CHANNEL_HANDLES.map((h) => fetchYtChannelVideos(apiKey, h, 4))
      );
      const all: YtVideo[] = results.flatMap((r) => r.status === "fulfilled" ? r.value : []);
      all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      res.json({ videos: all.slice(0, 28), source: "live" });
    } catch (err) {
      console.error("YouTube videos fetch failed:", err);
      res.json({ videos: DUMMY_VIDEOS, source: "dummy" });
    }
  });

  app.get("/api/news/wire", async (_req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return res.json({ videos: DUMMY_WIRE_VIDEOS, source: "dummy" });
    try {
      const videos = await fetchYtChannelVideos(apiKey, "s2underground", 8);
      res.json({ videos, source: "live" });
    } catch (err) {
      console.error("S2 Wire fetch failed:", err);
      res.json({ videos: DUMMY_WIRE_VIDEOS, source: "dummy" });
    }
  });

  app.get("/api/news/gun-news", async (_req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return res.json({ videos: DUMMY_VIDEOS.filter(v => v.channelId === "UCgun_collective").slice(0, 8), source: "dummy" });
    try {
      const videos = await fetchYtChannelVideos(apiKey, "theGunCollective", 8);
      res.json({ videos, source: "live" });
    } catch (err) {
      console.error("Gun Collective fetch failed:", err);
      res.json({ videos: DUMMY_VIDEOS.filter(v => v.channelId === "UCgun_collective").slice(0, 8), source: "dummy" });
    }
  });

  app.get("/api/news/channel/:handle", async (req, res) => {
    const { handle } = req.params;
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return res.json({ videos: [], source: "dummy" });
    try {
      const videos = await fetchYtChannelVideos(apiKey, handle, 8);
      res.json({ videos, source: "live" });
    } catch (err) {
      console.error(`Channel fetch failed for ${handle}:`, err);
      res.json({ videos: [], source: "error" });
    }
  });

  app.get("/api/news/archive", async (_req, res) => {
    const archived = await storage.getArchivedVideos();
    res.json({ videos: archived });
  });

  // ---- Map: NOAA Weather Alerts ----
  app.get("/api/map/weather", async (_req, res) => {
    const cached = getCached<unknown>("weather", TTL.WEATHER);
    if (cached) return res.json(cached);
    try {
      const r = await fetch("https://api.weather.gov/alerts/active?status=actual&message_type=alert", {
        headers: { "User-Agent": "ConcealedFlorida/1.0 (info@concealedflorida.com)", "Accept": "application/geo+json" },
        signal: AbortSignal.timeout(20000),
      });
      if (!r.ok) throw new Error(`NOAA HTTP ${r.status}`);
      const json = await r.json() as any;
      const features = (json.features || []).slice(0, 300).map((f: any) => ({
        geometry: f.geometry,
        event: f.properties?.event ?? "Alert",
        severity: f.properties?.severity ?? "Unknown",
        headline: f.properties?.headline ?? "",
        areaDesc: f.properties?.areaDesc ?? "",
        expires: f.properties?.expires ?? "",
        id: f.properties?.id ?? Math.random().toString(36),
      }));
      const payload = { features, updatedAt: new Date().toISOString() };
      setCached("weather", payload);
      res.json(payload);
    } catch (err) {
      console.error("NOAA fetch failed:", err);
      res.json({ features: [], updatedAt: new Date().toISOString(), error: String(err) });
    }
  });

  // ---- Map: FEMA Disasters — OpenFEMA v1 API ----
  app.get("/api/map/fema", async (_req, res) => {
    const cached = getCached<unknown>("fema", TTL.FEMA);
    if (cached) return res.json(cached);
    try {
      const since = Date.now() - 365*24*60*60*1000;
      // v1 OpenFEMA API — no $filter (v1 OData filters are unreliable); fetch latest 200 sorted by date then filter server-side
      const url = `https://www.fema.gov/api/open/v1/FemaWebDisasterDeclarations?$orderby=declarationDate%20desc&$top=200&$select=disasterNumber,disasterName,incidentType,declarationDate,stateCode,stateName`;
      const r = await fetch(url, {
        headers: { "Accept": "application/json" },
        signal: AbortSignal.timeout(15000),
      });
      if (!r.ok) throw new Error(`FEMA HTTP ${r.status}`);
      const json = await r.json() as any;
      const rows: any[] = (json.FemaWebDisasterDeclarations ?? []).filter((d: any) =>
        d.declarationDate && new Date(d.declarationDate).getTime() >= since
      );
      const disasters = rows.map((d: any) => {
        const abbr = (d.stateCode ?? "").trim();
        const cities = STATE_CITIES[abbr];
        const coords: [number, number] = cities ? cities[0] : [39.5, -98.35];
        const jitter = () => (Math.random() - 0.5) * 2.5;
        return {
          id: d.disasterNumber,
          title: d.disasterName ?? d.incidentType,
          type: d.incidentType,
          state: abbr,
          area: (d.stateName ?? d.stateCode ?? "").trim(),
          date: d.declarationDate,
          lat: coords[0] + jitter(),
          lng: coords[1] + jitter(),
        };
      });
      const payload = { disasters, updatedAt: new Date().toISOString() };
      setCached("fema", payload);
      res.json(payload);
    } catch (err) {
      console.error("FEMA fetch failed:", err);
      res.json({ disasters: [], updatedAt: new Date().toISOString(), error: String(err) });
    }
  });

  // ---- Map: FBI Crime Heat Map ----
  // Violent crime rates per 100,000 population — FBI UCR 2022 (most recent published report)
  // Source: https://ucr.fbi.gov/crime-in-the-u.s
  const FBI_UCR_2022: Record<string, { violent: number; property: number }> = {
    AK:{violent:837,property:2913}, NM:{violent:778,property:3611}, AR:{violent:614,property:2790},
    TN:{violent:608,property:2568}, LA:{violent:584,property:2881}, SC:{violent:533,property:2770},
    NV:{violent:528,property:2566}, MO:{violent:527,property:3102}, OK:{violent:458,property:2987},
    SD:{violent:473,property:1864}, MT:{violent:415,property:2422}, IL:{violent:406,property:2182},
    TX:{violent:406,property:2421}, CO:{violent:399,property:3054}, NC:{violent:395,property:2447},
    CA:{violent:496,property:2540}, MD:{violent:456,property:2218}, AL:{violent:434,property:2848},
    KS:{violent:391,property:2671}, AZ:{violent:493,property:2915}, FL:{violent:396,property:2354},
    MI:{violent:452,property:2079}, DE:{violent:432,property:2574}, OH:{violent:291,property:1939},
    IN:{violent:273,property:2282}, GA:{violent:300,property:2427}, WI:{violent:319,property:1808},
    WA:{violent:347,property:3073}, PA:{violent:294,property:1604}, MS:{violent:272,property:2203},
    WV:{violent:273,property:1747}, OR:{violent:304,property:3095}, KY:{violent:253,property:2111},
    IA:{violent:281,property:1771}, NE:{violent:272,property:2258}, HI:{violent:272,property:3000},
    ND:{violent:293,property:1762}, NY:{violent:353,property:1617}, MA:{violent:325,property:1499},
    MN:{violent:244,property:2082}, VA:{violent:210,property:1753}, WY:{violent:222,property:1768},
    UT:{violent:232,property:2601}, ID:{violent:187,property:1611}, RI:{violent:191,property:1354},
    CT:{violent:193,property:1694}, NJ:{violent:188,property:1421}, ME:{violent:109,property:1448},
    NH:{violent:146,property:1378}, VT:{violent:127,property:1524}, DC:{violent:838,property:4066},
  };

  app.get("/api/map/crime", (_req, res) => {
    const cached = getCached<unknown>("crime", TTL.CRIME);
    if (cached) return res.json(cached);

    const maxViolent = Math.max(...Object.values(FBI_UCR_2022).map((v) => v.violent));
    const states = Object.entries(FBI_UCR_2022).map(([abbr, data]) => ({
      abbr,
      violent: data.violent,
      property: data.property,
      weight: data.violent / maxViolent,
    }));

    const payload = {
      states,
      source: "FBI UCR 2022",
      updatedAt: new Date().toISOString(),
    };
    setCached("crime", payload);
    res.json(payload);
  });

  // ---- Map: City-level crime spots — FBI UCR 2022 major cities ----
  const CITY_CRIME: { name: string; state: string; lat: number; lng: number; violent: number; property: number }[] = [
    // Very High (>1500/100k)
    {name:"Memphis",state:"TN",lat:35.15,lng:-90.05,violent:2727,property:5430},
    {name:"Detroit",state:"MI",lat:42.33,lng:-83.05,violent:2057,property:4218},
    {name:"Baltimore",state:"MD",lat:39.29,lng:-76.61,violent:2027,property:3742},
    {name:"St. Louis",state:"MO",lat:38.63,lng:-90.20,violent:1927,property:4605},
    {name:"Kansas City",state:"MO",lat:39.10,lng:-94.58,violent:1600,property:4328},
    {name:"Milwaukee",state:"WI",lat:43.04,lng:-87.91,violent:1597,property:3241},
    {name:"Cleveland",state:"OH",lat:41.50,lng:-81.69,violent:1557,property:4891},
    {name:"Little Rock",state:"AR",lat:34.74,lng:-92.29,violent:1503,property:4517},
    // High (800-1500/100k)
    {name:"Albuquerque",state:"NM",lat:35.08,lng:-106.65,violent:1369,property:7112},
    {name:"Birmingham",state:"AL",lat:33.52,lng:-86.80,violent:1399,property:5038},
    {name:"Oakland",state:"CA",lat:37.80,lng:-122.27,violent:1351,property:7854},
    {name:"New Orleans",state:"LA",lat:29.95,lng:-90.07,violent:1239,property:4729},
    {name:"Anchorage",state:"AK",lat:61.22,lng:-149.90,violent:1237,property:4028},
    {name:"Atlanta",state:"GA",lat:33.75,lng:-84.39,violent:1215,property:4387},
    {name:"Minneapolis",state:"MN",lat:44.98,lng:-93.27,violent:1170,property:4129},
    {name:"Newark",state:"NJ",lat:40.74,lng:-74.17,violent:1115,property:2876},
    {name:"Indianapolis",state:"IN",lat:39.77,lng:-86.16,violent:1015,property:4198},
    {name:"Nashville",state:"TN",lat:36.17,lng:-86.78,violent:991,property:3987},
    {name:"Seattle",state:"WA",lat:47.61,lng:-122.33,violent:978,property:6143},
    {name:"Hartford",state:"CT",lat:41.76,lng:-72.68,violent:974,property:3256},
    {name:"Tulsa",state:"OK",lat:36.15,lng:-95.99,violent:852,property:5012},
    {name:"Salt Lake City",state:"UT",lat:40.76,lng:-111.89,violent:844,property:4729},
    {name:"Washington DC",state:"DC",lat:38.91,lng:-77.04,violent:838,property:3544},
    {name:"Houston",state:"TX",lat:29.76,lng:-95.37,violent:831,property:3874},
    {name:"Wichita",state:"KS",lat:37.69,lng:-97.34,violent:824,property:3876},
    {name:"Cincinnati",state:"OH",lat:39.10,lng:-84.51,violent:819,property:3648},
    {name:"Orlando",state:"FL",lat:28.54,lng:-81.38,violent:812,property:5217},
    {name:"Miami",state:"FL",lat:25.77,lng:-80.19,violent:789,property:3892},
    {name:"Greensboro",state:"NC",lat:36.07,lng:-79.79,violent:784,property:4109},
    {name:"Phoenix",state:"AZ",lat:33.45,lng:-112.07,violent:778,property:4503},
    {name:"Louisville",state:"KY",lat:38.25,lng:-85.76,violent:756,property:3541},
    {name:"Sacramento",state:"CA",lat:38.58,lng:-121.49,violent:755,property:5234},
    {name:"Tucson",state:"AZ",lat:32.22,lng:-110.97,violent:721,property:4812},
    {name:"Fresno",state:"CA",lat:36.74,lng:-119.79,violent:716,property:5678},
    {name:"Durham",state:"NC",lat:36.00,lng:-78.90,violent:698,property:4023},
    {name:"Dallas",state:"TX",lat:32.79,lng:-96.80,violent:693,property:3987},
    {name:"Oklahoma City",state:"OK",lat:35.47,lng:-97.52,violent:683,property:4372},
    {name:"Portland",state:"OR",lat:45.52,lng:-122.68,violent:643,property:6128},
    {name:"Columbus",state:"OH",lat:39.96,lng:-82.99,violent:643,property:3872},
    {name:"Boston",state:"MA",lat:42.36,lng:-71.06,violent:610,property:2891},
    {name:"Los Angeles",state:"CA",lat:34.05,lng:-118.24,violent:601,property:2987},
    {name:"Jacksonville",state:"FL",lat:30.33,lng:-81.66,violent:587,property:2973},
    {name:"New York City",state:"NY",lat:40.71,lng:-74.01,violent:566,property:1487},
    {name:"Charlotte",state:"NC",lat:35.23,lng:-80.84,violent:565,property:3421},
    {name:"Las Vegas",state:"NV",lat:36.17,lng:-115.14,violent:574,property:3287},
    {name:"Long Beach",state:"CA",lat:33.77,lng:-118.19,violent:583,property:2876},
    {name:"Bakersfield",state:"CA",lat:35.37,lng:-119.02,violent:619,property:4521},
    {name:"Pittsburgh",state:"PA",lat:40.44,lng:-79.99,violent:596,property:2941},
    {name:"Chicago",state:"IL",lat:41.85,lng:-87.65,violent:851,property:2812},
    {name:"Denver",state:"CO",lat:39.74,lng:-104.98,violent:774,property:5329},
    {name:"San Francisco",state:"CA",lat:37.77,lng:-122.42,violent:752,property:6789},
    // Moderate (300-600/100k)
    {name:"San Antonio",state:"TX",lat:29.42,lng:-98.49,violent:485,property:3142},
    {name:"Tampa",state:"FL",lat:27.96,lng:-82.46,violent:474,property:2987},
    {name:"Providence",state:"RI",lat:41.82,lng:-71.42,violent:479,property:2543},
    {name:"Fort Worth",state:"TX",lat:32.75,lng:-97.33,violent:437,property:2917},
    {name:"Lincoln",state:"NE",lat:40.81,lng:-96.68,violent:400,property:2843},
    {name:"Riverside",state:"CA",lat:33.98,lng:-117.37,violent:425,property:2917},
    {name:"Corpus Christi",state:"TX",lat:27.80,lng:-97.40,violent:418,property:3218},
    {name:"Mesa",state:"AZ",lat:33.42,lng:-111.83,violent:389,property:2654},
    {name:"Raleigh",state:"NC",lat:35.78,lng:-78.64,violent:312,property:2218},
    {name:"Omaha",state:"NE",lat:41.26,lng:-96.01,violent:558,property:3412},
    // Low (<300/100k)
    {name:"Austin",state:"TX",lat:30.27,lng:-97.74,violent:295,property:3187},
    {name:"San Diego",state:"CA",lat:32.72,lng:-117.15,violent:392,property:2314},
    {name:"El Paso",state:"TX",lat:31.76,lng:-106.49,violent:265,property:1874},
    {name:"San Jose",state:"CA",lat:37.34,lng:-121.89,violent:284,property:3421},
    {name:"Honolulu",state:"HI",lat:21.31,lng:-157.82,violent:272,property:3012},
    {name:"Boise",state:"ID",lat:43.62,lng:-116.20,violent:245,property:1987},
    {name:"Henderson",state:"NV",lat:36.03,lng:-115.03,violent:215,property:1843},
    {name:"Virginia Beach",state:"VA",lat:36.85,lng:-76.29,violent:176,property:1654},
    {name:"Provo",state:"UT",lat:40.23,lng:-111.66,violent:148,property:1521},
    {name:"Irvine",state:"CA",lat:33.68,lng:-117.83,violent:57,property:1042},
  ];

  app.get("/api/map/city-crime", (_req, res) => {
    const cached = getCached<unknown>("city-crime", TTL.CRIME);
    if (cached) return res.json(cached);
    const maxViolent = Math.max(...CITY_CRIME.map(c => c.violent));
    const cities = CITY_CRIME.map(c => ({ ...c, weight: c.violent / maxViolent }));
    const payload = { cities, source: "FBI UCR 2022", updatedAt: new Date().toISOString() };
    setCached("city-crime", payload);
    res.json(payload);
  });

  // ---- Map: OpenWeatherMap radar tile URL (key never exposed to frontend) ----
  app.get("/api/map/radar-url", (_req, res) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.json({ url: null, error: "OPENWEATHER_API_KEY not configured" });
    }
    res.json({
      url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      updatedAt: new Date().toISOString(),
    });
  });

  // ---- Map: Trauma Centers (static dataset) ----
  app.get("/api/map/hospitals", (_req, res) => {
    const cached = getCached<unknown>("hospitals", TTL.HOSPITALS);
    if (cached) return res.json(cached);
    const payload = { centers: TRAUMA_CENTERS, updatedAt: new Date().toISOString() };
    setCached("hospitals", payload);
    res.json(payload);
  });

  // ---- Map: Emergency Alert Banner (NOAA + FEMA IPAWS) — 5 min cache ----
  app.get("/api/map/alerts", async (_req, res) => {
    const cached = getCached<unknown>("alerts", 5 * 60 * 1000);
    if (cached) return res.json(cached);
    try {
      // Source 1: NOAA Active Alerts — Extreme/Severe only
      const noaaPromise = fetch(
        "https://api.weather.gov/alerts/active?status=actual&severity=Extreme,Severe",
        {
          headers: { "User-Agent": "ConcealedFlorida/1.0 (info@concealedflorida.com)", "Accept": "application/geo+json" },
          signal: AbortSignal.timeout(15000),
        }
      ).then(async (r) => {
        if (!r.ok) return [];
        const json: any = await r.json();
        return (json.features || []).map((f: any) => ({
          id: f.properties?.id ?? Math.random().toString(36),
          source: "NOAA",
          event: f.properties?.event ?? "Alert",
          area: f.properties?.areaDesc ?? "Unknown Area",
          severity: f.properties?.severity ?? "Unknown",
          sent: f.properties?.sent ?? f.properties?.onset ?? new Date().toISOString(),
        }));
      }).catch(() => []);

      // Source 2: FEMA IPAWS Archived Alerts
      const femaPromise = fetch(
        "https://www.fema.gov/api/open/v2/ipawsArchivedAlerts?orderby=sent%20desc&%24top=20",
        { headers: { "Accept": "application/json" }, signal: AbortSignal.timeout(15000) }
      ).then(async (r) => {
        if (!r.ok) return [];
        const json: any = await r.json();
        const items: any[] = json.ipawsArchivedAlerts ?? json.value ?? json.data ?? [];
        return items.map((item: any) => {
          const info = Array.isArray(item.info) ? item.info[0] : item.info ?? {};
          return {
            id: item.identifier ?? Math.random().toString(36),
            source: "FEMA",
            event: info?.event ?? item.msgType ?? "Emergency Alert",
            area: info?.areaDesc ?? item.scope ?? "Unknown Area",
            severity: info?.severity ?? "Moderate",
            sent: item.sent ?? new Date().toISOString(),
          };
        });
      }).catch(() => []);

      const [noaaAlerts, femaAlerts] = await Promise.all([noaaPromise, femaPromise]);
      const combined: any[] = [...noaaAlerts, ...femaAlerts];
      combined.sort((a, b) => new Date(b.sent).getTime() - new Date(a.sent).getTime());
      const seen = new Set<string>();
      const alerts = combined.filter((a) => {
        const key = `${a.event}|${a.area}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      const payload = { alerts, updatedAt: new Date().toISOString() };
      setCached("alerts", payload);
      res.json(payload);
    } catch (err) {
      console.error("Alert banner fetch failed:", err);
      res.json({ alerts: [], updatedAt: new Date().toISOString(), error: String(err) });
    }
  });

  // ---- Map: Earthquakes (USGS Significant Past Week) — 1 hr cache ----
  app.get("/api/map/earthquakes", async (_req, res) => {
    const cached = getCached<unknown>("earthquakes", 60 * 60 * 1000);
    if (cached) return res.json(cached);
    try {
      const r = await fetch(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson",
        { headers: { "User-Agent": "ConcealedFlorida/1.0" }, signal: AbortSignal.timeout(15000) }
      );
      if (!r.ok) throw new Error(`USGS HTTP ${r.status}`);
      const json: any = await r.json();
      const earthquakes = (json.features ?? []).map((f: any) => ({
        id: f.id,
        place: f.properties?.place ?? "Unknown",
        magnitude: f.properties?.mag ?? 0,
        depth: f.geometry?.coordinates?.[2] ?? 0,
        time: f.properties?.time ?? Date.now(),
        lat: f.geometry?.coordinates?.[1] ?? 0,
        lng: f.geometry?.coordinates?.[0] ?? 0,
      }));
      const payload = { earthquakes, updatedAt: new Date().toISOString() };
      setCached("earthquakes", payload);
      res.json(payload);
    } catch (err) {
      console.error("USGS fetch failed:", err);
      res.json({ earthquakes: [], updatedAt: new Date().toISOString(), error: String(err) });
    }
  });

  // ---- Map: Active Wildfires (NASA FIRMS MODIS Global 24h) — 2 hr cache ----
  app.get("/api/map/wildfires", async (_req, res) => {
    const cached = getCached<unknown>("wildfires", 2 * 60 * 60 * 1000);
    if (cached) return res.json(cached);
    try {
      const r = await fetch(
        "https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_Global_24h.csv",
        { headers: { "User-Agent": "ConcealedFlorida/1.0" }, signal: AbortSignal.timeout(30000) }
      );
      if (!r.ok) throw new Error(`NASA FIRMS HTTP ${r.status}`);
      const text = await r.text();
      const lines = text.trim().split("\n");
      if (lines.length < 2) throw new Error("Empty CSV");
      const headers = lines[0].split(",");
      const latIdx = headers.indexOf("latitude");
      const lngIdx = headers.indexOf("longitude");
      const brightIdx = headers.indexOf("brightness");
      const dateIdx = headers.indexOf("acq_date");
      const timeIdx = headers.indexOf("acq_time");
      const frpIdx = headers.indexOf("frp");
      const confIdx = headers.indexOf("confidence");
      if (latIdx === -1 || lngIdx === -1) throw new Error("CSV missing lat/lng");

      // 0.1° micro-grid clustering (~7 miles per cell) — keeps actual fire locations
      // accurate while merging only truly adjacent detections.
      // Filter to US + territories bounding box; skip low-confidence detections.
      interface FireCluster {
        latSum: number; lngSum: number; frpSum: number; frpMax: number;
        brightnessMax: number; count: number;
        acq_date: string; acq_time: string; confidence: string;
      }
      const gridMap = new Map<string, FireCluster>();
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        const lat = parseFloat(cols[latIdx]);
        const lng = parseFloat(cols[lngIdx]);
        if (isNaN(lat) || isNaN(lng)) continue;
        // US bounding box (continental, Alaska, Hawaii, Puerto Rico)
        if (lat < 17 || lat > 72 || lng < -180 || lng > -65) continue;
        const confidence = confIdx >= 0 ? (cols[confIdx] ?? "").toLowerCase().trim() : "nominal";
        // Skip low-confidence detections to reduce noise
        if (confidence === "low" || confidence === "l") continue;
        const brightness = brightIdx >= 0 ? parseFloat(cols[brightIdx]) || 300 : 300;
        const frp = frpIdx >= 0 ? parseFloat(cols[frpIdx]) || 0 : 0;
        const acq_date = dateIdx >= 0 ? (cols[dateIdx] ?? "").trim() : "";
        const acq_time = timeIdx >= 0 ? (cols[timeIdx] ?? "").trim() : "";
        // 0.1° grid key
        const gLat = Math.floor(lat * 10) / 10;
        const gLng = Math.floor(lng * 10) / 10;
        const key = `${gLat.toFixed(1)},${gLng.toFixed(1)}`;
        const existing = gridMap.get(key);
        if (existing) {
          existing.latSum += lat;
          existing.lngSum += lng;
          existing.frpSum += frp;
          existing.count++;
          if (frp > existing.frpMax) existing.frpMax = frp;
          if (brightness > existing.brightnessMax) existing.brightnessMax = brightness;
          // Keep most recent timestamp
          if (acq_date > existing.acq_date || (acq_date === existing.acq_date && acq_time > existing.acq_time)) {
            existing.acq_date = acq_date;
            existing.acq_time = acq_time;
          }
        } else {
          gridMap.set(key, {
            latSum: lat, lngSum: lng, frpSum: frp, frpMax: frp,
            brightnessMax: brightness, count: 1,
            acq_date, acq_time, confidence,
          });
        }
      }
      const wildfires = Array.from(gridMap.values()).map(c => ({
        lat: Math.round((c.latSum / c.count) * 10000) / 10000,
        lng: Math.round((c.lngSum / c.count) * 10000) / 10000,
        frp: Math.round(c.frpMax * 10) / 10,
        frpTotal: Math.round(c.frpSum * 10) / 10,
        brightness: Math.round(c.brightnessMax),
        count: c.count,
        acq_date: c.acq_date,
        acq_time: c.acq_time,
      }));
      const payload = { wildfires, updatedAt: new Date().toISOString() };
      setCached("wildfires", payload);
      res.json(payload);
    } catch (err) {
      console.error("NASA FIRMS fetch failed:", err);
      res.json({ wildfires: [], updatedAt: new Date().toISOString(), error: String(err) });
    }
  });

  // ---- Map: Hurricane Tracks (NHC Atlantic RSS) — 30 min cache ----
  app.get("/api/map/hurricanes", async (_req, res) => {
    const cached = getCached<unknown>("hurricanes", 30 * 60 * 1000);
    if (cached) return res.json(cached);
    try {
      const r = await fetch("https://www.nhc.noaa.gov/index-at.xml", {
        headers: { "User-Agent": "ConcealedFlorida/1.0" },
        signal: AbortSignal.timeout(15000),
      });
      if (!r.ok) throw new Error(`NHC HTTP ${r.status}`);
      const xml = await r.text();
      const storms: any[] = [];
      const itemRe = /<item[^>]*>([\s\S]*?)<\/item>/g;
      let itemMatch;
      while ((itemMatch = itemRe.exec(xml)) !== null) {
        const block = itemMatch[1];
        const titleM = block.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i);
        const latM = block.match(/<geo:lat[^>]*>([\d.\-]+)<\/geo:lat>/i);
        const lngM = block.match(/<geo:long[^>]*>([\d.\-]+)<\/geo:long>/i);
        if (!titleM) continue;
        const title = titleM[1].trim();
        if (!title.match(/advisory|tropical storm|hurricane|tropical depression|subtropical/i)) continue;
        const typeM = title.match(/(tropical storm|tropical depression|hurricane|subtropical storm|subtropical depression)/i);
        const nameM = title.match(/(?:tropical storm|hurricane|tropical depression|subtropical storm|subtropical depression)\s+(\w+)/i);
        const catM = title.match(/category\s+(\d)/i);
        storms.push({
          id: `storm-${storms.length}`,
          name: nameM ? nameM[1] : "Unknown",
          type: typeM ? typeM[1] : "Tropical System",
          category: catM ? parseInt(catM[1]) : 0,
          lat: latM ? parseFloat(latM[1]) : null,
          lng: lngM ? parseFloat(lngM[1]) : null,
          title,
        });
      }
      const payload = { storms, updatedAt: new Date().toISOString() };
      setCached("hurricanes", payload);
      res.json(payload);
    } catch (err) {
      console.error("NHC fetch failed:", err);
      res.json({ storms: [], updatedAt: new Date().toISOString(), error: String(err) });
    }
  });

  // ---- Power Outages: ODIN (Oak Ridge / DOE, 15 min cache) ----
  app.get("/api/map/outages", async (_req, res) => {
    const cached = getCached<unknown>("outages", 15 * 60 * 1000);
    if (cached) return res.json(cached);
    try {
      const url = "https://ornl.opendatasoft.com/api/explore/v2.1/catalog/datasets/odin-real-time-outages-county/records?limit=100&order_by=metersaffected+desc";
      const r = await fetch(url, {
        headers: { "User-Agent": "ConcealedFlorida/1.0", Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      });
      if (!r.ok) throw new Error(`ODIN HTTP ${r.status}`);
      const json = await r.json() as any;
      const outages = (json.results ?? []).map((d: any) => ({
        county: d.county ?? "",
        state: d.state ?? "",
        metersAffected: typeof d.metersaffected === "number" ? d.metersaffected : parseInt(d.metersaffected) || 0,
        startTime: d.reportedstarttime ?? null,
        eta: d.estimatedrestorationtime ?? null,
        cause: d.cause ?? null,
        lat: d.geo_point_2d?.lat ?? null,
        lng: d.geo_point_2d?.lon ?? null,
      })).filter((o: any) => o.lat && o.lng && o.metersAffected > 0);
      const payload = { outages, updatedAt: new Date().toISOString() };
      setCached("outages", payload);
      res.json(payload);
    } catch (err) {
      console.error("ODIN outage fetch failed:", err);
      res.json({ outages: [], updatedAt: new Date().toISOString(), error: String(err) });
    }
  });

  // ======= THREAT AWARENESS FEEDS =======

  // ---- RSS parse helper ----
  function parseRss(xml: string, limit = 5) {
    const items: { title: string; link: string; description: string; pubDate: string }[] = [];
    const re = /<item>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = re.exec(xml)) !== null && items.length < limit) {
      const c = m[1];
      const field = (tag: string): string => {
        const fm = new RegExp(`<${tag}(?:[^>]*)>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i').exec(c);
        return fm ? fm[1].trim()
          .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
          .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'") : '';
      };
      const rawLink = field('link');
      const rawGuid = field('guid');
      // FBI and some feeds store the permalink in <guid> rather than <link>
      const link = rawLink.startsWith('http') ? rawLink
        : rawGuid.startsWith('http') ? rawGuid
        : rawLink;
      items.push({
        title: field('title'),
        link,
        description: field('description').substring(0, 350),
        pubDate: field('pubDate'),
      });
    }
    return items;
  }

  // ---- Threats: FBI Latest News (30 min cache) ----
  app.get("/api/threats/fbi", async (_req, res) => {
    const cached = getCached<unknown>("threats_fbi", 30 * 60 * 1000);
    if (cached) return res.json(cached);
    try {
      const r = await fetch("https://www.fbi.gov/feeds/fbi-top-stories/rss.xml", {
        headers: { "User-Agent": "ConcealedFlorida/1.0", Accept: "application/rss+xml,application/xml,text/xml" },
        signal: AbortSignal.timeout(12000),
      });
      if (!r.ok) throw new Error(`FBI RSS HTTP ${r.status}`);
      const xml = await r.text();
      const items = parseRss(xml, 5);
      const payload = { items, updatedAt: new Date().toISOString() };
      setCached("threats_fbi", payload);
      res.json(payload);
    } catch (err) {
      console.error("FBI RSS failed:", err);
      res.json({ items: [], updatedAt: new Date().toISOString(), error: String(err) });
    }
  });

  // ---- Threats: ACLED US Political Violence (30 min cache) ----
  app.get("/api/threats/acled", async (_req, res) => {
    const apiKey = process.env.ACLED_API_KEY;
    const email = process.env.ACLED_EMAIL;
    if (!apiKey || !email) {
      return res.json({ incidents: [], updatedAt: new Date().toISOString(), error: "ACLED_API_KEY or ACLED_EMAIL not configured" });
    }
    const cached = getCached<unknown>("threats_acled", 30 * 60 * 1000);
    if (cached) return res.json(cached);
    try {
      const params = new URLSearchParams({
        key: apiKey, email, country: "United States", limit: "50",
        "fields": "event_date|event_type|sub_event_type|actor1|location|latitude|longitude|fatalities|notes",
        "order": "event_date|desc",
      });
      const r = await fetch(`https://api.acleddata.com/acled/read?${params}`, {
        headers: { "User-Agent": "ConcealedFlorida/1.0" },
        signal: AbortSignal.timeout(15000),
      });
      if (!r.ok) throw new Error(`ACLED HTTP ${r.status}`);
      const json = await r.json() as any;
      const incidents = (json.data ?? []).map((d: any) => ({
        date: d.event_date ?? "",
        eventType: d.event_type ?? "",
        subType: d.sub_event_type ?? "",
        actor: d.actor1 ?? "",
        location: d.location ?? "",
        lat: parseFloat(d.latitude) || null,
        lng: parseFloat(d.longitude) || null,
        fatalities: parseInt(d.fatalities) || 0,
        notes: (d.notes ?? "").substring(0, 200),
      }));
      const payload = { incidents, updatedAt: new Date().toISOString() };
      setCached("threats_acled", payload);
      res.json(payload);
    } catch (err) {
      console.error("ACLED fetch failed:", err);
      res.json({ incidents: [], updatedAt: new Date().toISOString(), error: String(err) });
    }
  });

  // ---- Threats: State Dept Travel Advisories (curated static snapshot) ----
  // travel.state.gov serves its RSS behind CAPTCHA/bot-protection that blocks server-side fetch.
  // We serve a curated snapshot of all Level 3–4 designations; Level 1–2 omitted as preparedness-irrelevant.
  // Users should verify current status at travel.state.gov before international travel.
  app.get("/api/threats/statedept", (_req, res) => {
    const ADVISORIES = [
      // Level 4 — Do Not Travel
      { country: "Afghanistan", level: 4, levelText: "Do Not Travel — terrorism, kidnapping, civil unrest", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/afghanistan-travel-advisory.html", pubDate: "" },
      { country: "Belarus", level: 4, levelText: "Do Not Travel — risk of wrongful detention, arbitrary enforcement", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/belarus-travel-advisory.html", pubDate: "" },
      { country: "Burma (Myanmar)", level: 4, levelText: "Do Not Travel — civil unrest, armed conflict, crime", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/burma-travel-advisory.html", pubDate: "" },
      { country: "Central African Republic", level: 4, levelText: "Do Not Travel — crime, civil unrest, kidnapping", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/central-african-republic-travel-advisory.html", pubDate: "" },
      { country: "Gaza / West Bank", level: 4, levelText: "Do Not Travel — armed conflict, terrorism, civil unrest", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/israel-west-bank-and-gaza-travel-advisory.html", pubDate: "" },
      { country: "Haiti", level: 4, levelText: "Do Not Travel — kidnapping, crime, civil unrest, limited government services", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/haiti-travel-advisory.html", pubDate: "" },
      { country: "Iran", level: 4, levelText: "Do Not Travel — terrorism, risk of wrongful detention, regional conflict", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/iran-travel-advisory.html", pubDate: "" },
      { country: "Iraq", level: 4, levelText: "Do Not Travel — terrorism, kidnapping, armed conflict", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/iraq-travel-advisory.html", pubDate: "" },
      { country: "Libya", level: 4, levelText: "Do Not Travel — crime, terrorism, civil unrest, armed conflict", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/libya-travel-advisory.html", pubDate: "" },
      { country: "Mali", level: 4, levelText: "Do Not Travel — terrorism, kidnapping, crime", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/mali-travel-advisory.html", pubDate: "" },
      { country: "North Korea", level: 4, levelText: "Do Not Travel — risk of arrest and long-term detention", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/north-korea-travel-advisory.html", pubDate: "" },
      { country: "Russia", level: 4, levelText: "Do Not Travel — wrongful detention, armed conflict, civil unrest", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/russia-travel-advisory.html", pubDate: "" },
      { country: "Somalia", level: 4, levelText: "Do Not Travel — crime, terrorism, piracy, civil unrest", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/somalia-travel-advisory.html", pubDate: "" },
      { country: "South Sudan", level: 4, levelText: "Do Not Travel — crime, kidnapping, armed conflict", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/south-sudan-travel-advisory.html", pubDate: "" },
      { country: "Sudan", level: 4, levelText: "Do Not Travel — armed conflict, civil unrest, terrorism", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/sudan-travel-advisory.html", pubDate: "" },
      { country: "Syria", level: 4, levelText: "Do Not Travel — terrorism, civil unrest, risk of unjust detention", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/syria-travel-advisory.html", pubDate: "" },
      { country: "Ukraine", level: 4, levelText: "Do Not Travel — active armed conflict with Russia", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/ukraine-travel-advisory.html", pubDate: "" },
      { country: "Venezuela", level: 4, levelText: "Do Not Travel — crime, civil unrest, kidnapping, wrongful detention", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/venezuela-travel-advisory.html", pubDate: "" },
      { country: "Yemen", level: 4, levelText: "Do Not Travel — terrorism, civil war, armed conflict", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/yemen-travel-advisory.html", pubDate: "" },
      // Level 3 — Reconsider Travel (selected high-risk countries)
      { country: "Colombia", level: 3, levelText: "Reconsider Travel — crime, terrorism in select regions", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/colombia-travel-advisory.html", pubDate: "" },
      { country: "Ecuador", level: 3, levelText: "Reconsider Travel — crime, civil unrest", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/ecuador-travel-advisory.html", pubDate: "" },
      { country: "El Salvador", level: 3, levelText: "Reconsider Travel — crime", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/el-salvador-travel-advisory.html", pubDate: "" },
      { country: "Ethiopia", level: 3, levelText: "Reconsider Travel — civil unrest, armed conflict in select regions", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/ethiopia-travel-advisory.html", pubDate: "" },
      { country: "Honduras", level: 3, levelText: "Reconsider Travel — crime", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/honduras-travel-advisory.html", pubDate: "" },
      { country: "Kenya", level: 3, levelText: "Reconsider Travel — crime, terrorism", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/kenya-travel-advisory.html", pubDate: "" },
      { country: "Mexico", level: 3, levelText: "Reconsider Travel — crime; Chihuahua, Colima, Guerrero, Michoacán, Sinaloa, Tamaulipas, Zacatecas are Level 4", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/mexico-travel-advisory.html", pubDate: "" },
      { country: "Nigeria", level: 3, levelText: "Reconsider Travel — crime, terrorism, civil unrest, kidnapping", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/nigeria-travel-advisory.html", pubDate: "" },
      { country: "Pakistan", level: 3, levelText: "Reconsider Travel — terrorism, civil unrest", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/pakistan-travel-advisory.html", pubDate: "" },
      { country: "Papua New Guinea", level: 3, levelText: "Reconsider Travel — crime, civil unrest", link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/papua-new-guinea-travel-advisory.html", pubDate: "" },
    ];
    res.json({ advisories: ADVISORIES, updatedAt: new Date().toISOString(), isStatic: true });
  });

  // ---- Threats: CISA Security Advisories (1 hr cache) ----
  app.get("/api/threats/cisa", async (_req, res) => {
    const cached = getCached<unknown>("threats_cisa", 60 * 60 * 1000);
    if (cached) return res.json(cached);
    try {
      const r = await fetch("https://www.cisa.gov/news.xml", {
        headers: { "User-Agent": "ConcealedFlorida/1.0", Accept: "application/rss+xml,application/xml,text/xml" },
        signal: AbortSignal.timeout(12000),
      });
      if (!r.ok) throw new Error(`CISA RSS HTTP ${r.status}`);
      const xml = await r.text();
      const raw = parseRss(xml, 6);
      const alerts = raw.map(item => {
        // Attempt to extract severity from title or description
        const text = (item.title + " " + item.description).toLowerCase();
        const severity = text.includes("critical") ? "Critical"
          : text.includes("high") ? "High"
          : text.includes("medium") || text.includes("moderate") ? "Medium"
          : "Advisory";
        return { title: item.title, link: item.link, pubDate: item.pubDate, description: item.description, severity };
      });
      const payload = { alerts, updatedAt: new Date().toISOString() };
      setCached("threats_cisa", payload);
      res.json(payload);
    } catch (err) {
      console.error("CISA RSS failed:", err);
      res.json({ alerts: [], updatedAt: new Date().toISOString(), error: String(err) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
