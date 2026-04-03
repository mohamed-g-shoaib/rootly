"use client";

import * as React from "react";

export function usePaginationScrollReset(page: number) {
  const previousPageRef = React.useRef(page);

  React.useEffect(() => {
    if (previousPageRef.current === page) {
      return;
    }

    previousPageRef.current = page;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let firstFrameId = 0;
    let secondFrameId = 0;

    firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrameId);
      window.cancelAnimationFrame(secondFrameId);
    };
  }, [page]);
}
