import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { getVideoReviews, type VideoReview } from "@/lib/api";

// Extract YouTube video ID from various URL formats
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

interface VideoCardProps {
  video: VideoReview;
  isActive: boolean;
  onPlay: () => void;
}

const VideoCard = ({ video, isActive, onPlay }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYouTubeId(video.youtubeUrl);
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : "/placeholder.svg";

  const handlePlay = () => {
    setIsPlaying(true);
    onPlay();
  };

  return (
    <div 
      className={`
        flex-shrink-0 w-[320px] md:w-[400px] lg:w-[480px] 
        transition-all duration-700 ease-out
        ${isActive ? "scale-100 opacity-100" : "scale-95 opacity-60"}
      `}
    >
      <div className="glass-card overflow-hidden group">
        <div className="relative aspect-video bg-black/10">
          {isPlaying && videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <>
              <img
                src={thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  // Fallback to medium quality thumbnail if maxres fails
                  const fallback = videoId 
                    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    : "/placeholder.svg";
                  (e.target as HTMLImageElement).src = fallback;
                }}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={handlePlay}
                  className="w-16 h-16 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center transition-all hover:scale-110"
                >
                  <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                </button>
              </div>
              {/* Play button always visible on mobile */}
              <button
                onClick={handlePlay}
                className="md:hidden absolute bottom-4 right-4 w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center"
              >
                <Play className="w-6 h-6 text-primary-foreground ml-0.5" fill="currentColor" />
              </button>
            </>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2">{video.title}</h3>
          {video.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{video.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const VideoReviewCarousel = () => {
  const { t } = useLanguage();
  const [videos, setVideos] = useState<VideoReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [, setPlayingIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideoReviews();
        setVideos(data);
      } catch (error) {
        console.warn("Failed to fetch video reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (videos.length <= 1) return;

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % videos.length);
      }, 5000); // 5 seconds per video
    };

    startAutoScroll();

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [videos.length]);

  // Scroll to active video
  useEffect(() => {
    if (carouselRef.current && videos.length > 0) {
      const cardWidth = carouselRef.current.scrollWidth / videos.length;
      const scrollPosition = cardWidth * activeIndex - (carouselRef.current.clientWidth - cardWidth) / 2;
      
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [activeIndex, videos.length]);

  const handlePrev = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    setActiveIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleNext = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    setActiveIndex((prev) => (prev + 1) % videos.length);
  };

  const handleVideoPlay = (index: number) => {
    setPlayingIndex(index);
    // Stop auto-scroll when video is playing
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-20 border-t border-border/50 relative overflow-hidden">
        <div className="container-custom">
          <div className="text-center mb-10">
            <div className="h-8 w-48 bg-muted/50 rounded-lg mx-auto animate-pulse" />
            <div className="h-4 w-64 bg-muted/30 rounded mt-3 mx-auto animate-pulse" />
          </div>
          <div className="flex gap-6 justify-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-[400px] glass-card animate-pulse">
                <div className="aspect-video bg-muted/30" />
                <div className="p-4">
                  <div className="h-5 w-3/4 bg-muted/30 rounded" />
                  <div className="h-4 w-1/2 bg-muted/20 rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null; // Don't render section if no videos
  }

  return (
    <section className="py-16 md:py-20 border-t border-border/50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container-custom relative">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            {t.videoReviews?.title || "Video Reviews"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t.videoReviews?.subtitle || "Watch reviews of our parts"}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {videos.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hidden md:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hidden md:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Videos */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-4 md:px-12 py-4 scroll-smooth"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {videos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                isActive={index === activeIndex}
                onPlay={() => handleVideoPlay(index)}
              />
            ))}
          </div>

          {/* Dots Indicator */}
          {videos.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {videos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
                    setActiveIndex(index);
                  }}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${index === activeIndex 
                      ? "bg-primary w-6" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }
                  `}
                  aria-label={`Go to video ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
