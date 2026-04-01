import * as React from "react";

import { ImageResponse } from "next/og";

import RootlyLogo from "@/components/rootly-logo";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const socialImageAlt = siteConfig.ogAlt;
export const socialImageSize = {
  width: 1200,
  height: 630,
} as const;
export const socialImageContentType = "image/png";

const defaultOgColors = {
  background: "#f2f5fa",
  foreground: "#2f4561",
  card: "#f8fbff",
  "card-foreground": "#1e3048",
  primary: "#4f77c8",
  "primary-foreground": "#ffffff",
  secondary: "#e6edf8",
  "secondary-foreground": "#485f80",
  muted: "#dfe7f4",
  "muted-foreground": "#667b98",
  accent: "#e6edf8",
  "accent-foreground": "#2f4561",
  border: "#d1dced",
};

type RootlySocialImageOptions = {
  description: string;
  eyebrow?: string;
  title: string;
  url?: string;
};

function LogoLockup() {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        gap: 18,
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: defaultOgColors.accent,
          border: `1px solid ${defaultOgColors.border}`,
          borderRadius: 28,
          color: defaultOgColors["accent-foreground"],
          display: "flex",
          height: 72,
          justifyContent: "center",
          width: 72,
        }}
      >
        <RootlyLogo width={38} height={38} />
      </div>
      <div
        style={{
          color: defaultOgColors.foreground,
          display: "flex",
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: "-0.05em",
        }}
      >
        Rootly
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <div
      style={{
        alignItems: "center",
        alignSelf: "flex-start",
        background: defaultOgColors.secondary,
        border: `1px solid ${defaultOgColors.border}`,
        borderRadius: 999,
        color: defaultOgColors["secondary-foreground"],
        display: "flex",
        fontSize: 20,
        fontWeight: 600,
        padding: "10px 16px",
      }}
    >
      {children}
    </div>
  );
}

export function createRootlySocialImage({
  description,
  eyebrow = "Developer learning notebook",
  title,
  url = absoluteUrl("/"),
}: RootlySocialImageOptions) {
  return new ImageResponse(
    <div
      style={{
        background: `linear-gradient(180deg, ${defaultOgColors.background} 0%, ${defaultOgColors.secondary} 100%)`,
        color: defaultOgColors.foreground,
        display: "flex",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        height: "100%",
        padding: 34,
        width: "100%",
      }}
    >
      <div
        style={{
          background: defaultOgColors.card,
          border: `1px solid ${defaultOgColors.border}`,
          borderRadius: 40,
          boxShadow: "0 24px 60px rgba(60, 88, 148, 0.10)",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: 46,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            position: "relative",
          }}
        >
          <LogoLockup />
          <Eyebrow>{eyebrow}</Eyebrow>
          <div
            style={{
              color: defaultOgColors["card-foreground"],
              display: "flex",
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-0.07em",
              lineHeight: 1.02,
              maxWidth: 920,
              textWrap: "balance",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: defaultOgColors["muted-foreground"],
              display: "flex",
              fontSize: 28,
              lineHeight: 1.35,
              maxWidth: 860,
              textWrap: "balance",
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            color: defaultOgColors["muted-foreground"],
            display: "flex",
            fontSize: 22,
            fontWeight: 500,
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex" }}>Capture. Track. Review.</div>
          <div style={{ display: "flex" }}>{url}</div>
        </div>
      </div>
    </div>,
    {
      ...socialImageSize,
    },
  );
}
