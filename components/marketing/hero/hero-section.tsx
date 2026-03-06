"use client";

import { PlayIcon, XIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MarketingContainer } from "@/components/marketing/container";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type HeroVideo = {
  id: string;
  title: string;
  subtitle: string;
  url: string;
};

const heroVideos: HeroVideo[] = [
  {
    id: "overview",
    title: "Overview",
    subtitle:
      "See how Rootly helps you run your business finances without manual work.",
    url: "https://cdn.midday.ai/videos/login-video.mp4",
  },
  {
    id: "assistant",
    title: "Assistant",
    subtitle:
      "Ask questions and get clear answers based on your business data, including revenue and expenses.",
    url: "https://cdn.midday.ai/videos/login-video.mp4",
  },
  {
    id: "insights",
    title: "Insights",
    subtitle:
      "Understand how your business evolves with live widgets and summaries highlighting what is changing.",
    url: "https://cdn.midday.ai/videos/login-video.mp4",
  },
  {
    id: "transactions",
    title: "Transactions",
    subtitle:
      "Every payment is automatically collected, categorized, and kept in one place so nothing gets lost.",
    url: "https://cdn.midday.ai/videos/login-video.mp4",
  },
  {
    id: "inbox",
    title: "Inbox",
    subtitle:
      "Receipts and invoices are pulled from email and payments, then matched to transactions automatically.",
    url: "https://cdn.midday.ai/videos/login-video.mp4",
  },
  {
    id: "time-tracking",
    title: "Time tracking",
    subtitle:
      "Track time across projects and customers, then turn hours into accurate invoices so nothing is missed.",
    url: "https://cdn.midday.ai/videos/login-video.mp4",
  },
  {
    id: "invoicing",
    title: "Invoicing",
    subtitle:
      "Create invoices, send to customers, and track payments flowing into your financial overview.",
    url: "https://cdn.midday.ai/videos/login-video.mp4",
  },
  {
    id: "customers",
    title: "Customers",
    subtitle:
      "See revenue, profitability, and activity per customer in one place without switching between tools.",
    url: "https://cdn.midday.ai/videos/login-video.mp4",
  },
  {
    id: "files",
    title: "Files",
    subtitle:
      "Smart storage that automatically organizes and connects files to transactions, invoices, and customers.",
    url: "https://cdn.midday.ai/videos/login-video.mp4",
  },
];

export function HeroSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPosterLoaded, setIsPosterLoaded] = useState(false);
  const [isDashboardLightLoaded, setIsDashboardLightLoaded] = useState(false);
  const [isDashboardDarkLoaded, setIsDashboardDarkLoaded] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState("overview");
  const [videoProgress, setVideoProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const videoTagsScrollRef = useRef<HTMLDivElement>(null);
  const styleSheetRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    const handleLoaded = () => setIsVideoLoaded(true);

    if (video.readyState >= 3) {
      setIsVideoLoaded(true);
    }

    video.addEventListener("canplay", handleLoaded);
    video.addEventListener("loadeddata", handleLoaded);

    return () => {
      video.removeEventListener("canplay", handleLoaded);
      video.removeEventListener("loadeddata", handleLoaded);
    };
  }, []);

  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video || !isVideoModalOpen) return;

    const currentVideo = heroVideos.find((item) => item.id === activeVideoId);
    if (!currentVideo) return;

    if (video.src !== currentVideo.url) {
      video.src = currentVideo.url;
      video.load();
      setVideoProgress(0);
    }

    const handleCanPlay = () => {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Browser can block autoplay; controls remain available.
        });
      }
    };

    video.addEventListener("canplay", handleCanPlay);
    if (video.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [activeVideoId, isVideoModalOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (!isVideoModalOpen) return;

    const style = document.createElement("style");
    style.textContent = `
      .hero-modal-video::-webkit-media-controls-timeline,
      .hero-modal-video::-webkit-media-controls-current-time-display,
      .hero-modal-video::-webkit-media-controls-time-remaining-display,
      .hero-modal-video::-webkit-media-controls-timeline-container,
      .hero-modal-video::-webkit-media-controls-panel {
        display: none !important;
      }
    `;

    document.head.appendChild(style);
    styleSheetRef.current = style;

    return () => {
      if (styleSheetRef.current) {
        document.head.removeChild(styleSheetRef.current);
        styleSheetRef.current = null;
      }
    };
  }, [isVideoModalOpen]);

  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video || !isVideoModalOpen) return;

    const updateProgress = () => {
      if (!video.duration) return;
      setVideoProgress((video.currentTime / video.duration) * 100);
    };

    const resetProgress = () => {
      setVideoProgress(0);
      updateProgress();
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", resetProgress);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", resetProgress);
    };
  }, [activeVideoId, isVideoModalOpen]);

  return (
    <section className="bg-background relative min-h-screen overflow-visible lg:overflow-hidden">
      <div className="relative flex min-h-screen flex-col overflow-hidden pb-12 pt-32 sm:py-32 md:pt-24 lg:pt-0">
        <MarketingContainer className="z-20 mb-12 flex flex-1 flex-col items-center justify-center space-y-8 md:justify-start md:pt-16 lg:mb-12 lg:flex-none lg:items-stretch lg:space-y-0 lg:pt-56 xl:mb-12 2xl:mb-12 3xl:mb-16">
          <div className="flex w-full flex-col space-y-8 lg:flex-row lg:items-end lg:justify-between lg:space-y-0">
            <div className="mx-auto max-w-xl space-y-4 px-2 text-center lg:mx-0 lg:space-y-3 lg:px-0 lg:text-left">
              <h1 className="font-serif text-3xl leading-tight md:text-3xl lg:text-3xl lg:leading-tight xl:text-3xl xl:leading-[1.3] 2xl:text-3xl 3xl:text-4xl">
                <span className="text-foreground">
                  Run your business finances without manual work.
                </span>
              </h1>

              <p className="mx-auto max-w-md text-center font-sans text-base leading-normal text-muted-foreground lg:mx-0 lg:max-w-none lg:text-left">
                One place for transactions, receipts, invoices and everything
                around it.
              </p>
            </div>

            <div className="w-full space-y-4 text-center lg:flex lg:w-auto lg:flex-col lg:items-end lg:text-right">
              <div className="mx-auto flex w-full max-w-md flex-col gap-3 lg:mx-0 lg:w-auto">
                <Button
                  variant="outline"
                  className="h-10 border border-[#0e0e0e] bg-[#0e0e0e] px-6 text-white hover:bg-[#0e0e0e]/90 dark:border-white dark:bg-white dark:text-[#0e0e0e] dark:hover:bg-white/90"
                  asChild
                >
                  <a href="/login">
                    <span className="text-sm text-inherit">Get Started</span>
                  </a>
                </Button>
              </div>

              <p className="font-sans text-xs text-muted-foreground">
                <span className="lg:hidden">
                  14-day free trial · Cancel anytime
                </span>
                <span className="hidden lg:inline">
                  14-day free trial. Cancel anytime.
                </span>
              </p>
            </div>
          </div>
        </MarketingContainer>

        <MarketingContainer className="lg:w-full mb-8 mt-8 overflow-visible md:mt-12 lg:mt-0 lg:mb-4 3xl:mb-20">
          <div className="relative overflow-hidden">
            <div
              className={[
                "absolute inset-0 z-1 h-full w-full transition-all duration-1000 ease-in-out",
                isVideoLoaded ? "pointer-events-none opacity-0" : "opacity-100",
              ].join(" ")}
              style={{
                filter: prefersReducedMotion
                  ? "blur(0px)"
                  : isVideoLoaded
                    ? "blur(0px)"
                    : "blur(1px)",
                transitionDuration: prefersReducedMotion ? "0ms" : "1000ms",
              }}
            >
              <Image
                src="https://cdn.midday.ai/video-poster-v2.jpg"
                alt="Rootly dashboard preview"
                fill
                unoptimized
                fetchPriority="high"
                priority
                className={[
                  "object-cover object-center transition-opacity duration-1000 ease-in-out",
                  isPosterLoaded ? "opacity-100" : "opacity-0",
                ].join(" ")}
                style={{
                  transitionDuration: prefersReducedMotion ? "0ms" : "1000ms",
                }}
                onLoad={() => setIsPosterLoaded(true)}
              />
            </div>

            <video
              ref={heroVideoRef}
              className={[
                "h-105 w-full object-cover transition-opacity duration-1000 ease-in-out sm:h-130 md:h-150 lg:h-200 xl:h-225 3xl:h-[1000px]",
                isVideoLoaded ? "opacity-100" : "opacity-0",
              ].join(" ")}
              style={{
                transitionDuration: prefersReducedMotion ? "0ms" : "1000ms",
              }}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
            >
              <source
                src="https://cdn.midday.ai/videos/login-video.mp4"
                type="video/mp4"
              />
            </video>

            <div className="absolute inset-0 z-2 flex items-center justify-center p-0 lg:p-4">
              <div className="relative scale-[0.95] md:scale-100 lg:static lg:flex lg:h-full lg:scale-100 lg:flex-col lg:items-center lg:justify-center">
                <Image
                  src="/images/dashboard-light.svg"
                  alt="Dashboard illustration"
                  width={1600}
                  height={1200}
                  className="w-full h-auto md:scale-[0.85]! lg:scale-100! lg:max-w-[85%] lg:object-contain lg:filter-[drop-shadow(0_30px_60px_rgba(0,0,0,0.6))] lg:transform-[rotate(-2deg)_skewY(1deg)] 2xl:max-w-[75%] transition-all duration-700 ease-out dark:hidden"
                  style={{
                    filter: prefersReducedMotion
                      ? "drop-shadow(0 30px 60px rgba(0,0,0,0.6))"
                      : isDashboardLightLoaded
                        ? "blur(0px) drop-shadow(0 30px 60px rgba(0,0,0,0.6))"
                        : "blur(20px)",
                    transform: isDashboardLightLoaded
                      ? "scale(1)"
                      : "scale(1.02)",
                    transitionDuration: prefersReducedMotion ? "0ms" : "700ms",
                  }}
                  priority
                  fetchPriority="high"
                  onLoad={() => setIsDashboardLightLoaded(true)}
                />
                <Image
                  src="/images/dashboard-dark.svg"
                  alt="Dashboard illustration"
                  width={1600}
                  height={1200}
                  className="hidden w-full h-auto md:scale-[0.85]! lg:scale-100! lg:max-w-[85%] lg:object-contain lg:filter-[drop-shadow(0_30px_60px_rgba(0,0,0,0.6))] lg:transform-[rotate(-2deg)_skewY(1deg)] 2xl:max-w-[75%] transition-all duration-700 ease-out dark:block"
                  style={{
                    filter: prefersReducedMotion
                      ? "drop-shadow(0 30px 60px rgba(0,0,0,0.6))"
                      : isDashboardDarkLoaded
                        ? "blur(0px) drop-shadow(0 30px 60px rgba(0,0,0,0.6))"
                        : "blur(20px)",
                    transform: isDashboardDarkLoaded
                      ? "scale(1)"
                      : "scale(1.02)",
                    transitionDuration: prefersReducedMotion ? "0ms" : "700ms",
                  }}
                  priority
                  fetchPriority="high"
                  onLoad={() => setIsDashboardDarkLoaded(true)}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsVideoModalOpen(true);
                setActiveVideoId("overview");
              }}
              className={[
                "pointer-events-none absolute inset-0 z-4 hidden items-center justify-center transition-opacity duration-500 delay-300",
                isDashboardLightLoaded || isDashboardDarkLoaded
                  ? "opacity-100"
                  : "opacity-0",
              ].join(" ")}
              style={{
                transitionDuration: prefersReducedMotion ? "0ms" : "500ms",
                transitionDelay: prefersReducedMotion ? "0ms" : "300ms",
              }}
              aria-label="Play video"
            >
              <div className="pointer-events-auto flex h-12 w-12 items-center justify-center bg-muted transition-all duration-200 hover:scale-105 hover:bg-secondary sm:h-14 sm:w-14 md:h-16 md:w-16">
                <PlayIcon className="h-5 w-5 text-primary sm:h-6 sm:w-6 md:h-7 md:w-7" />
              </div>
            </button>
          </div>
        </MarketingContainer>
      </div>

      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-white/40 backdrop-blur-sm dark:bg-black/40"
          className="z-10000 max-h-[90vh] max-w-4xl gap-0 overflow-hidden border border-border bg-background p-0 ring-0 sm:max-w-4xl"
        >
          <DialogTitle className="sr-only">Rootly Product Video</DialogTitle>

          <div className="relative aspect-video w-full bg-background">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-4 right-4 z-10 hidden bg-background-semi-transparent backdrop-blur-md sm:flex"
                aria-label="Close dialog"
              >
                <XIcon className="h-5 w-5 text-foreground" />
              </Button>
            </DialogClose>

            <video
              ref={modalVideoRef}
              className="hero-modal-video h-full w-full"
              autoPlay
              playsInline
              loop
              muted
              controls
              controlsList="nodownload noplaybackrate"
              style={{ objectFit: "cover" }}
            >
              <source
                src={
                  heroVideos.find((item) => item.id === activeVideoId)?.url ??
                  ""
                }
                type="video/mp4"
              />
            </video>
          </div>

          <div className="relative w-full overflow-hidden border-t border-border bg-background">
            <div
              ref={videoTagsScrollRef}
              className="overflow-x-auto scrollbar-hide"
            >
              <div className="p-4 lg:p-6">
                <div className="flex gap-4">
                  {heroVideos.map((video, index) => (
                    <div key={video.id} className="flex items-stretch">
                      {index > 0 ? (
                        <div className="mr-4 w-px bg-border" />
                      ) : null}
                      <button
                        type="button"
                        onClick={(event) => {
                          setActiveVideoId(video.id);
                          setVideoProgress(0);

                          const scrollContainer = videoTagsScrollRef.current;
                          if (!scrollContainer) return;

                          const buttonRect =
                            event.currentTarget.getBoundingClientRect();
                          const containerRect =
                            scrollContainer.getBoundingClientRect();
                          const currentScrollLeft = scrollContainer.scrollLeft;

                          if (index < heroVideos.length - 1) {
                            const isLastVisible =
                              buttonRect.right >= containerRect.right - 50;

                            if (isLastVisible) {
                              const nextTag = scrollContainer.querySelector(
                                `[data-video-index="${index + 1}"]`,
                              ) as HTMLElement | null;

                              if (nextTag) {
                                const nextTagRect =
                                  nextTag.getBoundingClientRect();
                                const scrollAmount =
                                  nextTagRect.right - containerRect.right + 20;

                                scrollContainer.scrollTo({
                                  left: currentScrollLeft + scrollAmount,
                                  behavior: "smooth",
                                });
                              }
                            }
                          }

                          if (index > 0) {
                            const isFirstVisible =
                              buttonRect.left <= containerRect.left + 50;

                            if (isFirstVisible) {
                              const previousTag = scrollContainer.querySelector(
                                `[data-video-index="${index - 1}"]`,
                              ) as HTMLElement | null;

                              if (previousTag) {
                                const previousTagRect =
                                  previousTag.getBoundingClientRect();
                                const scrollAmount =
                                  containerRect.left -
                                  previousTagRect.left +
                                  20;

                                scrollContainer.scrollTo({
                                  left: currentScrollLeft - scrollAmount,
                                  behavior: "smooth",
                                });
                              }
                            }
                          }
                        }}
                        data-video-index={index}
                        className={[
                          "relative flex w-25 shrink-0 flex-col items-start gap-1 bg-background pt-1 pb-3 text-left text-muted-foreground transition-colors hover:text-foreground sm:w-35 md:w-77.5 md:gap-2 md:pt-2 md:pb-5",
                          index > 0 ? "pl-2" : "",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "text-left font-sans text-sm leading-tight md:text-base",
                            activeVideoId === video.id ? "text-primary" : "",
                          ].join(" ")}
                        >
                          {video.title}
                        </span>
                        <span className="hidden text-left font-sans text-xs leading-tight text-muted-foreground md:block">
                          {video.subtitle}
                        </span>
                        {activeVideoId === video.id ? (
                          <div
                            className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-150"
                            style={{ width: `${videoProgress}%` }}
                          />
                        ) : null}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-24"
              style={{
                background:
                  "linear-gradient(to left, hsl(var(--background)) 0%, hsl(var(--background)) 30%, hsla(var(--background), 0.8) 50%, hsla(var(--background), 0.4) 70%, transparent 100%)",
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
