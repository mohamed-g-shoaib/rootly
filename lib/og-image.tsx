import * as React from "react"

import { ImageResponse } from "next/og"

import RootlyLogo from "@/components/rootly-logo"
import { absoluteUrl, siteConfig } from "@/lib/site-config"

export const socialImageAlt = siteConfig.ogAlt
export const socialImageSize = {
  width: 1200,
  height: 630,
} as const
export const socialImageContentType = "image/png"

type RootlySocialImageOptions = {
  description: string
  eyebrow?: string
  title: string
  url?: string
}

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
          background: "#f2dfd5",
          border: "1px solid rgba(110, 68, 42, 0.14)",
          borderRadius: 28,
          color: "#7a4230",
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
          color: "#6c3527",
          display: "flex",
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: "-0.05em",
        }}
      >
        Rootly
      </div>
    </div>
  )
}

function Eyebrow({ children }: { children: string }) {
  return (
    <div
      style={{
        alignItems: "center",
        alignSelf: "flex-start",
        background: "#f5ebe5",
        border: "1px solid rgba(110, 68, 42, 0.12)",
        borderRadius: 999,
        color: "#8b4d39",
        display: "flex",
        fontSize: 20,
        fontWeight: 600,
        padding: "10px 16px",
      }}
    >
      {children}
    </div>
  )
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
        background:
          "linear-gradient(180deg, #f8f1eb 0%, #efe2d8 100%)",
        color: "#3c241b",
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
          background: "rgba(255, 251, 247, 0.9)",
          border: "1px solid rgba(110, 68, 42, 0.12)",
          borderRadius: 40,
          boxShadow: "0 24px 60px rgba(110, 68, 42, 0.08)",
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
              color: "#5a2d21",
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
              color: "#7b5b4c",
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
            color: "#956f58",
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
    }
  )
}
