import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import {
  ExternalLink, Tv, ArrowLeft, AlertCircle, Play,
  Maximize2, Minimize2, X, ChevronRight, Clock
} from "lucide-react";
import { useLocation, Link } from "wouter";

interface Channel {
  id: string;
  name: string;
  handle: string;
  description: string;
  category?: string;
}

interface Video {
  id: string;
  title: string;
  channelId: string;
  channelName: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ChannelShowcase({ ch, accentColor, accentBorder }: { ch: Channel; accentColor: string; accentBorder: string }) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isLarge, setIsLarge] = useState(false);

  const handleSlug = ch.handle.replace("@", "");
  const { data, isLoading } = useQuery<{ videos: Video[]; source: string }>({
    queryKey: [`/api/news/channel/${handleSlug}`],
  });
  const videos = data?.videos ?? [];
  const channelUrl = `https://www.youtube.com/${ch.handle}`;
  const cardW = isLarge ? 300 : 210;

  function handleLatestClick(video: Video) {
    if (activeVideoId === video.id) {
      setActiveVideoId(null);
    } else {
      setActiveVideoId(video.id);
    }
  }

  return (
    <div className={`mb-6 pb-6 border-b ${accentBorder} last:border-b-0 last:pb-0 last:mb-0`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <div className={`w-2 h-2 rounded-full shrink-0 ${accentColor.replace("text-", "bg-")}`} />
            <h3 className={`text-xl font-bold leading-tight text-white`}>{ch.name}</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl ml-4">{ch.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsLarge((v) => !v)}
            title={isLarge ? "Smaller thumbnails" : "Larger thumbnails"}
            data-testid={`button-size-toggle-${ch.id}`}
          >
            {isLarge ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button variant="secondary" size="sm" asChild data-testid={`button-channel-${ch.id}`}>
            <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              Visit Channel
            </a>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-md overflow-hidden animate-pulse bg-secondary"
              style={{ width: `${cardW}px` }}
            >
              <div className="w-full bg-gray-800" style={{ aspectRatio: "16/9" }} />
              <div className="p-2 space-y-1.5">
                <div className="h-3 bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <>
          <div
            className="flex gap-4 overflow-x-auto pb-3"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#374151 transparent" }}
            data-testid={`scroll-row-${ch.id}`}
          >
            {videos.map((video, idx) => {
              const isLatest = idx === 0;
              const isPlaying = activeVideoId === video.id;

              return (
                <div
                  key={video.id}
                  className="flex-shrink-0"
                  style={{ width: `${cardW}px`, transition: "width 0.2s ease" }}
                >
                  <button
                    className="group rounded-md overflow-hidden w-full text-left hover-elevate"
                    onClick={() => handleLatestClick(video)}
                    data-testid={isLatest ? `card-latest-video-${video.id}` : `card-ch-video-${video.id}`}
                  >
                    <div className="relative" style={{ aspectRatio: "16/9" }}>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover rounded-t-md"
                      />
                      {isLatest && (
                        <div className="absolute top-1.5 left-1.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${accentColor} bg-black/70 uppercase tracking-wide`}>
                            {isPlaying ? "Playing" : "Latest"}
                          </span>
                        </div>
                      )}
                      {isPlaying && !isLatest && (
                        <div className="absolute top-1.5 left-1.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${accentColor} bg-black/70 uppercase tracking-wide`}>
                            Playing
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-t-md">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-2 bg-secondary rounded-b-md">
                      <p className="text-white text-xs font-medium leading-snug line-clamp-2">{video.title}</p>
                      <p className="text-gray-600 text-xs mt-1">{formatDate(video.publishedAt)}</p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Inline player */}
          {activeVideoId && (
            <div className="mt-3 rounded-lg overflow-hidden border border-gray-700 bg-black" data-testid={`player-${ch.id}`}>
              <div className="flex items-center justify-between px-3 py-2 bg-secondary border-b border-gray-700">
                <p className="text-white text-xs font-semibold truncate">
                  {videos.find((v) => v.id === activeVideoId)?.title}
                </p>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Open on YouTube"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setActiveVideoId(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Close player"
                    data-testid={`button-close-player-${ch.id}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                  title="Now playing"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: 0 }}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-secondary border border-border rounded-md p-4 flex items-center gap-3">
          <ExternalLink className="w-4 h-4 text-gray-600 shrink-0" />
          <p className="text-gray-500 text-sm">
            Visit{" "}
            <a href={channelUrl} target="_blank" rel="noopener noreferrer" className={`${accentColor} hover:underline font-medium`}>
              {ch.name}
            </a>{" "}
            on YouTube to watch their latest content.
          </p>
        </div>
      )}
    </div>
  );
}

function FeaturedVideoBlock() {
  const { data, isLoading } = useQuery<{ videos: Video[]; source: string }>({
    queryKey: ["/api/news/channel/theGunCollective"],
  });
  const video = data?.videos?.[0];

  if (isLoading) {
    return (
      <div className="rounded-md border border-orange-900/40 bg-orange-900/10 overflow-hidden">
        <div className="relative w-full bg-black/30" style={{ paddingBottom: "56.25%" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-white/20 border-t-orange-400/60" />
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="rounded-md border border-orange-900/40 bg-orange-900/10 overflow-hidden">
        <div className="relative w-full bg-black/30" style={{ paddingBottom: "56.25%" }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
              <Play className="w-5 h-5 text-white/30 ml-0.5" />
            </div>
            <p className="text-white/30 text-sm">60 Second Gun News — Loading</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-orange-900/40 bg-orange-900/10 overflow-hidden">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold line-clamp-1">{video.title}</p>
          <p className="text-orange-400 text-xs mt-0.5">{video.channelName}</p>
        </div>
        <a href={video.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
          <Button variant="ghost" size="sm" className="text-xs gap-1 text-gray-400">
            <ExternalLink className="w-3 h-3" />
            YouTube
          </Button>
        </a>
      </div>
    </div>
  );
}

export default function NewsPage() {
  const [, navigate] = useLocation();
  const { data: channelsData } = useQuery<{ channels: Channel[] }>({
    queryKey: ["/api/news/channels"],
  });

  const channels = channelsData?.channels ?? [];

  const CATEGORY_CONFIG: Record<string, { color: string; label: string; desc: string; bg: string; border: string }> = {
    Legal:     { color: "text-blue-400",   label: "Legal",     desc: "Know the law before you carry — use-of-force, self-defense coverage, and 2A litigation.",                                          bg: "bg-blue-900/10",   border: "border-blue-900/40"   },
    News:      { color: "text-yellow-400", label: "News",      desc: "Stay current on Second Amendment legislation, court decisions, and political developments.",                                        bg: "bg-yellow-900/10", border: "border-yellow-900/40" },
    Advocate:  { color: "text-red-400",    label: "Advocate",  desc: "Channels actively working to protect and expand Second Amendment rights.",                                                          bg: "bg-red-900/10",    border: "border-red-900/40"    },
    Education: { color: "text-green-400",  label: "Education", desc: "Hands-on training, real-world analysis, and skills development for the responsible gun owner.",                                    bg: "bg-green-900/10",  border: "border-green-900/40"  },
    "Gun News":{ color: "text-orange-400", label: "Gun News",  desc: "Daily industry briefings — new releases, equipment updates, and firearms market news.",                                            bg: "bg-orange-900/10", border: "border-orange-900/40" },
    Intel:     { color: "text-purple-400", label: "Intel",     desc: "Daily situational intelligence and geopolitical briefings for the preparedness-minded citizen.",                                   bg: "bg-purple-900/10", border: "border-purple-900/40" },
  };

  return (
    <>
      <SEOHead
        title="Liberty Watch | We Are Watching | Concealed Florida"
        description="Latest Second Amendment news and videos from trusted educators and advocates."
        path="/we-are-watching/news"
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-6xl">
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

          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" data-testid="heading-news">
              Liberty Watch
            </h1>
            <p className="text-gray-400 text-base max-w-xl">
              Latest videos from trusted Second Amendment educators, advocates, and daily intel briefings.
            </p>
          </div>

          {/* Featured Video */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400 text-sm font-semibold uppercase tracking-widest">Featured Video</span>
            </div>
            <FeaturedVideoBlock />
          </div>

          {/* We Are Ready Videos */}
          <div id="we-are-ready-videos" className="scroll-mt-24 mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Play className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400 text-sm font-semibold uppercase tracking-widest">We Are Ready Videos</span>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Preparedness Video Resources card */}
            <Link
              href="/preparedness/prepping/videos"
              className="group border border-orange-900/40 bg-orange-900/10 rounded-md p-5 flex flex-col gap-3 hover-elevate active-elevate-2"
              data-testid="card-resource-prep-videos"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-black/30 border border-orange-900/40 flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-base leading-tight">Preparedness Video Resources</p>
                  <p className="text-orange-400 text-xs mt-0.5">Prepping &amp; Preparedness</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed flex-1">
                Curated preparedness and prepping video content — food storage, water, grid-down living, and more.
              </p>
              <div className="w-full border border-orange-900/40 bg-white/5 rounded-md py-2 text-orange-400 text-xs font-semibold flex items-center justify-center gap-1 group-hover:bg-white/10 transition-colors">
                Browse Resources <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* First Aid Video Resources card */}
            <Link
              href="/first-aid/videos"
              className="group border border-red-900/40 bg-red-900/10 rounded-md p-5 flex flex-col gap-3 hover-elevate active-elevate-2"
              data-testid="link-first-aid-videos-resource"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-red-900/20 border border-red-800/40 flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-base leading-tight">First Aid Video Resources</p>
                  <p className="text-red-400/70 text-xs mt-0.5">Kit Assembly + Techniques</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed flex-1">
                Assembly walkthroughs for all three kit tiers plus tourniquet application, wound packing, CPR, airway management, and hypothermia prevention.
              </p>
              <div className="w-full border border-red-900/40 bg-white/5 rounded-md py-2 text-red-400 text-xs font-semibold flex items-center justify-center gap-1 group-hover:bg-white/10 transition-colors">
                Browse Videos <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Training Videos resource card */}
            <Link
              href="/training/videos"
              className="group border border-blue-900/40 bg-blue-900/10 rounded-md p-5 flex flex-col gap-3 hover-elevate active-elevate-2"
              data-testid="link-training-videos-resource"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-blue-900/20 border border-blue-800/40 flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-base leading-tight">Training Video Resources</p>
                  <p className="text-blue-400/70 text-xs mt-0.5">Firearm + Fitness</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed flex-1">
                Curated video content for firearm training disciplines and physical fitness standards — concealed carry, home defense, cardio, strength, and more.
              </p>
              <div className="w-full border border-blue-900/40 bg-white/5 rounded-md py-2 text-blue-400 text-xs font-semibold flex items-center justify-center gap-1 group-hover:bg-white/10 transition-colors">
                Browse Videos <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
          </div>

          {/* Featured Channels */}
          <div id="featured-channels">
            <div className="flex items-center gap-2 mb-10">
              <Tv className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400 text-sm font-semibold uppercase tracking-widest">Featured Channels</span>
            </div>

            {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => {
              const catChannels = channels.filter((ch) => ch.category === cat);
              if (catChannels.length === 0) return null;

              return (
                <section
                  key={cat}
                  className={`mb-10 rounded-md border ${cfg.border} ${cfg.bg} p-6`}
                  data-testid={`section-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-0.5 w-6 rounded-full bg-current ${cfg.color}`} />
                    <h2 className={`text-2xl font-extrabold uppercase tracking-widest ${cfg.color}`}>{cfg.label}</h2>
                  </div>
                  <p className={`text-sm mb-6 ml-9 ${cfg.color} opacity-60`}>{cfg.desc}</p>
                  <div>
                    {catChannels.map((ch) => (
                      <ChannelShowcase key={ch.id} ch={ch} accentColor={cfg.color} accentBorder={cfg.border} />
                    ))}
                  </div>
                </section>
              );
            })}

            <div className="mt-6 bg-secondary border border-border rounded-md p-4 flex gap-3 items-start">
              <AlertCircle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-gray-300 text-xs leading-relaxed">
                  <span className="font-semibold text-gray-200">No affiliation.</span> Concealed Florida does not own, operate, or have any affiliation with the channels featured on this page. We are not sponsored by or compensated by any of these creators. These channels are featured solely because we find genuine value in their content. All content belongs to its respective creators — visit their channels directly to subscribe and support them.
                </p>
                <p className="text-gray-300 text-xs leading-relaxed">
                  <span className="font-semibold text-gray-200">Legal content:</span> Videos from legal channels are for general informational and educational purposes only and do not constitute legal advice. Laws vary by state, county, and municipality. Consult a licensed attorney in your jurisdiction.
                </p>
                <p className="text-gray-300 text-xs leading-relaxed">
                  <span className="font-semibold text-gray-200">Training content:</span> Firearms techniques shown in videos should only be practiced under the supervision of a certified instructor.
                </p>
                <p className="text-gray-300 text-xs leading-relaxed">
                  <span className="font-semibold text-gray-200">Intel content:</span> S2 Underground's The Wire reflects the opinions of its host. Cross-reference with primary sources before acting on any information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
