"use client";

import { StarHalfIcon, StarIcon } from "@phosphor-icons/react";
import { PlayIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useEffect } from "react";
import { MarketingContainer } from "@/components/marketing/container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  homepageTestimonials,
  parseStructuredContent,
  type Testimonial,
} from "./testimonials-data";

function rotationForIndex(index: number) {
  if (index === 0) return "-rotate-1";
  if (index === 1) return "rotate-1";
  if (index === 2) return "rotate-2";
  if (index === 3) return "-rotate-2";
  return "rotate-0";
}

function TestimonialDialogCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  const sections = parseStructuredContent(testimonial.fullContent);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`group w-70 shrink-0 cursor-pointer snap-start text-left transition-transform duration-200 ease-out hover:scale-[1.01] ${rotationForIndex(index)} sm:w-64`}
          aria-label={`Open testimonial from ${testimonial.name}`}
        >
          <article className="relative flex min-h-60 flex-col gap-4 border border-border bg-background p-6 transition-all duration-200 group-hover:border-muted-foreground sm:min-h-0">
            {testimonial.video ? (
              <span
                aria-hidden="true"
                className="absolute right-4 top-4 flex size-7 items-center justify-center bg-muted text-muted-foreground"
              >
                <PlayIcon className="size-4" weight="fill" />
              </span>
            ) : null}

            <div className="flex flex-col gap-3">
              <p className="text-[10px] uppercase text-muted-foreground">
                {testimonial.country}
              </p>
              <div className="flex items-center gap-2">
                {testimonial.image ? (
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={16}
                    height={16}
                    className="size-4 rounded-full object-cover"
                    style={{ filter: "grayscale(100%)" }}
                  />
                ) : (
                  <span
                    className="size-4 rounded-full bg-muted"
                    aria-hidden="true"
                  />
                )}
                <span className="text-sm text-foreground">
                  {testimonial.name}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                {testimonial.company}
              </p>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                &quot;{testimonial.content}&quot;
              </p>
            </div>
          </article>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border border-border bg-background p-8 sm:max-w-2xl">
        <DialogHeader className="gap-3">
          <p className="text-[10px] uppercase text-muted-foreground">
            {testimonial.country}
          </p>
          <div className="flex items-center gap-3">
            {testimonial.image ? (
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={24}
                height={24}
                className="size-6 rounded-full object-cover"
                style={{ filter: "grayscale(100%)" }}
              />
            ) : (
              <span
                className="size-6 rounded-full bg-muted"
                aria-hidden="true"
              />
            )}
            <DialogTitle className="text-sm text-foreground">
              {testimonial.name}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-6 flex flex-col gap-6">
          <p className="text-sm text-muted-foreground">{testimonial.company}</p>
          {testimonial.video ? (
            <div className="w-full overflow-hidden bg-muted">
              <video
                className="h-auto w-full"
                controls
                playsInline
                preload="metadata"
                poster={testimonial.videoPoster}
                style={{ filter: "grayscale(100%)" }}
              >
                <source src={testimonial.video} />
                <track kind="captions" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <DialogDescription asChild>
              <div className="flex flex-col gap-6 text-sm text-muted-foreground">
                {sections.map((section) => (
                  <div
                    key={section.label || section.text.slice(0, 24)}
                    className="flex flex-col gap-2"
                  >
                    {section.label ? (
                      <p className="text-sm text-foreground">{section.label}</p>
                    ) : null}
                    <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                      {section.text}
                    </p>
                  </div>
                ))}
              </div>
            </DialogDescription>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TestimonialsSection() {
  useEffect(() => {
    const scrollToTestimonials = () => {
      if (window.location.hash !== "#testimonials") return;

      // Wait for layout/paint so fixed-header offsets and content height are ready.
      requestAnimationFrame(() => {
        const target = document.getElementById("testimonials");
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    scrollToTestimonials();
    window.addEventListener("hashchange", scrollToTestimonials);

    return () => {
      window.removeEventListener("hashchange", scrollToTestimonials);
    };
  }, []);

  return (
    <section
      id="testimonials"
      className="scroll-mt-28 bg-background py-12 sm:py-16 lg:py-24"
    >
      <MarketingContainer>
        <header className="mx-auto mb-8 max-w-xl space-y-4 px-2 text-center sm:mb-10 lg:mx-0 lg:max-w-2xl lg:px-0 lg:text-left">
          <h2 className="text-wrap-pretty font-sans text-3xl leading-tight md:text-3xl lg:text-3xl lg:leading-tight xl:text-3xl xl:leading-[1.3] 2xl:text-3xl 3xl:text-4xl">
            <span className="text-foreground">Built alongside our users</span>
          </h2>
          <p className="text-wrap-pretty mx-auto hidden max-w-md font-sans text-base leading-normal text-muted-foreground sm:block lg:mx-0 lg:max-w-none lg:text-left">
            For founders and small teams who run their business every week,
            every feature earns its place in the workflow.
          </p>
          <div className="mb-2 flex items-center justify-center gap-1 sm:mb-4 lg:justify-start">
            <StarIcon className="size-4 text-muted-foreground" weight="fill" />
            <StarIcon className="size-4 text-muted-foreground" weight="fill" />
            <StarIcon className="size-4 text-muted-foreground" weight="fill" />
            <StarIcon className="size-4 text-muted-foreground" weight="fill" />
            <StarHalfIcon
              className="size-4 text-muted-foreground"
              weight="fill"
            />
          </div>
        </header>

        <div className="mx-auto hidden w-full max-w-5xl justify-center gap-3 lg:flex">
          {homepageTestimonials.map((testimonial, index) => (
            <TestimonialDialogCard
              key={`${testimonial.name}-${index}`}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        <div className="lg:hidden">
          <div className="-mx-4 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
            <div className="flex w-max snap-x snap-mandatory gap-4">
              {homepageTestimonials.map((testimonial, index) => (
                <TestimonialDialogCard
                  key={`${testimonial.name}-mobile-${index}`}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
