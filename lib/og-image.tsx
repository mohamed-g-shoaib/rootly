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

const defaultOgColors = {
  background: "#e8dfd1",
  foreground: "#3c322a",
  card: "#f1e8dc",
  "card-foreground": "#3c322a",
  popover: "#f1e8dc",
  "popover-foreground": "#3c322a",
  primary: "#4d463f",
  "primary-foreground": "#f7efe4",
  secondary: "#d8cebf",
  "secondary-foreground": "#4d463f",
  muted: "#cfc3b3",
  "muted-foreground": "#7a6f63",
  accent: "#f6eee2",
  "accent-foreground": "#4d463f",
  destructive: "#c25b3d",
  "destructive-foreground": "#ffffff",
  border: "#d6cab8",
  input: "#d6cab8",
  ring: "#4d463f",
  "chart-1": "#c7804d",
  "chart-2": "#3c322a",
  "chart-3": "#7a6f63",
  "chart-4": "#b2a28f",
  "chart-5": "#cfc3b3",
  sidebar: "#e1d6c6",
  "sidebar-foreground": "#3c322a",
  "sidebar-primary": "#4d463f",
  "sidebar-primary-foreground": "#f7efe4",
  "sidebar-accent": "#f6eee2",
  "sidebar-accent-foreground": "#4d463f",
  "sidebar-border": "#d6cab8",
  "sidebar-ring": "#4d463f",
}

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
        gap: 16,
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: defaultOgColors.sidebar,
          border: `1px solid ${defaultOgColors.border}`,
          borderRadius: 24,
          color: defaultOgColors["accent-foreground"],
          display: "flex",
          height: 64,
          justifyContent: "center",
          width: 64,
        }}
      >
        <RootlyLogo width={34} height={34} />
      </div>
      <div
        style={{
          color: defaultOgColors.foreground,
          display: "flex",
          fontSize: 36,
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
        background: defaultOgColors.sidebar,
        border: `1px solid ${defaultOgColors.border}`,
        borderRadius: 999,
        color: defaultOgColors["secondary-foreground"],
        display: "flex",
        fontSize: 18,
        fontWeight: 600,
        padding: "10px 15px",
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
        background: defaultOgColors.background,
        color: defaultOgColors.foreground,
        display: "flex",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        height: "100%",
        padding: 30,
        width: "100%",
      }}
    >
      <div
        style={{
          background: defaultOgColors.card,
          border: `1px solid ${defaultOgColors.border}`,
          borderRadius: 36,
          boxShadow:
            "0 0 0 1px rgba(38, 33, 25, 0.02), 0 18px 40px rgba(38, 33, 25, 0.08)",
          display: "flex",
          flex: 1,
          gap: 28,
          overflow: "hidden",
          padding: 34,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: 22,
            justifyContent: "space-between",
            width: "63%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <LogoLockup />
            <Eyebrow>{eyebrow}</Eyebrow>
            <div
              style={{
                color: defaultOgColors["card-foreground"],
                display: "flex",
                fontSize: 68,
                fontWeight: 800,
                letterSpacing: "-0.07em",
                lineHeight: 1.02,
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
                maxWidth: 640,
                textWrap: "balance",
              }}
            >
              {description}
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 16,
            }}
          >
            <div
              style={{
                background: defaultOgColors.background,
                border: `1px solid ${defaultOgColors.border}`,
                borderRadius: 999,
                color: defaultOgColors.foreground,
                display: "flex",
                fontSize: 20,
                fontWeight: 600,
                padding: "10px 14px",
              }}
            >
              Capture. Track. Review.
            </div>
            <div
              style={{
                color: defaultOgColors["muted-foreground"],
                display: "flex",
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              {url}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            justifyContent: "flex-end",
            marginLeft: "auto",
            width: "31%",
          }}
        >
          <div
            style={{
              background: defaultOgColors.background,
              border: `1px solid ${defaultOgColors.border}`,
              borderRadius: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  color: defaultOgColors["muted-foreground"],
                  display: "flex",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Timer
              </div>
              <div
                style={{
                  color: defaultOgColors.foreground,
                  display: "flex",
                  fontSize: 34,
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.04em",
                }}
              >
                00:42:18
              </div>
            </div>

            <div
              style={{
                background: defaultOgColors.primary,
                borderRadius: 999,
                display: "flex",
                height: 10,
                overflow: "hidden",
                width: "100%",
              }}
            >
              <div
                style={{
                  background: defaultOgColors["chart-1"],
                  borderRadius: 999,
                  display: "flex",
                  width: "68%",
                }}
              />
            </div>

            <div
              style={{
                alignItems: "center",
                display: "flex",
                gap: 8,
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  background: defaultOgColors.card,
                  border: `1px solid ${defaultOgColors.border}`,
                  borderRadius: 14,
                  color: defaultOgColors.foreground,
                  display: "flex",
                  fontSize: 16,
                  fontWeight: 600,
                  padding: "8px 12px",
                }}
              >
                3 notes today
              </div>
            </div>
          </div>

          <div
            style={{
              background: defaultOgColors.accent,
              border: `1px solid ${defaultOgColors.border}`,
              borderRadius: 24,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: 20,
            }}
          >
            <div
              style={{
                color: defaultOgColors["muted-foreground"],
                display: "flex",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Rootly
            </div>
            <div
              style={{
                color: defaultOgColors.foreground,
                display: "flex",
                fontSize: 20,
                fontWeight: 700,
                lineHeight: 1.25,
                textWrap: "balance",
              }}
            >
              Capture what matters and come back to it later.
            </div>
          </div>
        </div>

        <div
          style={{
            border: `1px solid ${defaultOgColors.border}`,
            borderRadius: 30,
            display: "flex",
            inset: 16,
            position: "absolute",
          }}
        />
      </div>
    </div>,
    {
      ...socialImageSize,
    }
  )
}
