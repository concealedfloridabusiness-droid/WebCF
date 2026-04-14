import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface ArchivedVideo {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  thumbnail: string;
  publishedAt: string;
  archivedAt: string;
  url: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function groupByDate(videos: ArchivedVideo[]): Record<string, ArchivedVideo[]> {
  return videos.reduce<Record<string, ArchivedVideo[]>>((acc, v) => {
    const key = new Date(v.archivedAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(v);
    return acc;
  }, {});
}

export default function ArchivePage() {
  const { data, isLoading } = useQuery<{ videos: ArchivedVideo[] }>({
    queryKey: ["/api/news/archive"],
  });

  const videos = data?.videos ?? [];
  const grouped = groupByDate(videos);
  const dateKeys = Object.keys(grouped);

  return (
    <>
      <SEOHead
        title="2A News Archive | We Are Watching | Concealed Florida"
        description="Archive of all previously saved 2A and preparedness videos, organized by date."
        path="/we-are-watching/news/archive"
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <div className="flex items-center gap-4 mb-10">
            <Button variant="secondary" size="default" asChild data-testid="button-back-news">
              <Link href="/we-are-watching/news">
                <a className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to News
                </a>
              </Link>
            </Button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" data-testid="heading-archive">
            Video Archive
          </h1>
          <p className="text-gray-400 text-base mb-12">
            All previously saved videos from featured 2A channels, organized by date.
          </p>

          {isLoading ? (
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-800 rounded w-32 mb-4" />
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, j) => (
                      <div key={j} className="h-20 bg-secondary rounded-lg" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : dateKeys.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              <p className="text-lg">No archived videos yet.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {dateKeys.map((date) => (
                <section key={date} data-testid={`section-archive-${date}`}>
                  <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-4 border-b border-gray-800 pb-2">
                    {date}
                  </h2>
                  <div className="space-y-3">
                    {grouped[date].map((video) => (
                      <a
                        key={video.id}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`card-archive-video-${video.id}`}
                        className="group block"
                      >
                        <Card className="bg-secondary border-secondary hover-elevate transition-all">
                          <CardContent className="pt-3 pb-3 px-4">
                            <div className="flex items-center gap-4">
                              <div
                                className="shrink-0 rounded overflow-hidden bg-gray-800"
                                style={{ width: "96px", height: "54px" }}
                              >
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-semibold leading-snug line-clamp-2 mb-1">
                                  {video.title}
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="secondary" className="text-xs no-default-active-elevate">
                                    {video.channelName}
                                  </Badge>
                                  <span className="text-gray-600 text-xs">{formatDate(video.publishedAt)}</span>
                                </div>
                              </div>
                              <ExternalLink className="w-4 h-4 text-gray-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
