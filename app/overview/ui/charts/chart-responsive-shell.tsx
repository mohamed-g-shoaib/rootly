"use client";

import * as React from "react";

type ChartSize = {
  width: number;
  height: number;
};

export function ChartResponsiveShell({
  children,
  className,
  minHeight = 224,
}: {
  children: (size: ChartSize) => React.ReactNode;
  className: string;
  minHeight?: number;
}) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState<ChartSize>({
    width: 0,
    height: minHeight,
  });

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const updateSize = (entry?: ResizeObserverEntry) => {
      const measuredWidth = Math.floor(
        entry?.contentRect.width ?? host.clientWidth,
      );
      const measuredHeight = Math.floor(
        entry?.contentRect.height ?? host.clientHeight,
      );

      const nextWidth = Math.max(0, measuredWidth);
      const nextHeight = Math.max(minHeight, measuredHeight || minHeight);

      setSize((current) =>
        current.width === nextWidth && current.height === nextHeight
          ? current
          : { width: nextWidth, height: nextHeight },
      );
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        updateSize(entry);
      }
    });

    observer.observe(host);

    return () => {
      observer.disconnect();
    };
  }, [minHeight]);

  return (
    <div ref={hostRef} className={className}>
      {size.width > 0 ? children(size) : null}
    </div>
  );
}
