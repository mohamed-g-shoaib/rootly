import { ImageResponse } from "next/og"
import { absoluteUrl, siteConfig } from "./site-config"

export const socialImageAlt = siteConfig.ogAlt
export const socialImageSize = {
  width: 1200,
  height: 630,
} as const
export const socialImageContentType = "image/png"

const brandMark = (
  <div
    style={{
      alignItems: "center",
      border: "1px solid rgba(15, 23, 42, 0.08)",
      borderRadius: 22,
      display: "flex",
      gap: 10,
      padding: "16px 20px",
    }}
  >
    <div
      style={{
        color: "#0f172a",
        display: "flex",
        fontSize: 30,
        fontWeight: 700,
        letterSpacing: "-0.04em",
      }}
    >
      Rootly
    </div>
  </div>
)

function Tag({ children }: { children: string }) {
  return (
    <div
      style={{
        alignItems: "center",
        background: "#ffffff",
        border: "1px solid rgba(15, 23, 42, 0.08)",
        borderRadius: 999,
        color: "#334155",
        display: "flex",
        fontSize: 18,
        fontWeight: 600,
        padding: "10px 16px",
      }}
    >
      {children}
    </div>
  )
}

export function createRootlySocialImage() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(180deg, #fcfcfb 0%, #f2f4f7 100%)",
        color: "#0f172a",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        height: "100%",
        padding: 42,
        width: "100%",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          border: "1px solid rgba(15, 23, 42, 0.08)",
          borderRadius: 36,
          boxShadow: "0 18px 60px rgba(15, 23, 42, 0.08)",
          display: "flex",
          flex: 1,
          overflow: "hidden",
          padding: 28,
        }}
      >
        <div
          style={{
            borderRight: "1px solid rgba(15, 23, 42, 0.08)",
            display: "flex",
            flex: 1.12,
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "8px 30px 8px 4px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 26,
            }}
          >
            {brandMark}

            <div
              style={{
                alignItems: "center",
                background: "rgba(15, 23, 42, 0.06)",
                borderRadius: 999,
                color: "#334155",
                display: "flex",
                fontSize: 20,
                fontWeight: 600,
                padding: "10px 16px",
                alignSelf: "flex-start",
              }}
            >
              Built for self-taught developers
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 64,
                  fontWeight: 800,
                  letterSpacing: "-0.06em",
                  lineHeight: 1.04,
                }}
              >
                Your tutorial tabs are not a learning system.
              </div>
              <div
                style={{
                  color: "#475569",
                  display: "flex",
                  fontSize: 26,
                  lineHeight: 1.35,
                  maxWidth: 520,
                }}
              >
                Capture notes, track progress, and review what you learn in one
                place built for deliberate study.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              <Tag>Capture</Tag>
              <Tag>Track</Tag>
              <Tag>Review</Tag>
            </div>
            <div
              style={{
                color: "#64748b",
                display: "flex",
                fontSize: 20,
              }}
            >
              {absoluteUrl("/")}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flex: 0.88,
            flexDirection: "column",
            gap: 18,
            padding: "8px 0 8px 30px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              borderRadius: 28,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              justifyContent: "space-between",
              minHeight: 0,
              flex: 1,
              padding: 24,
            }}
          >
            <div
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  background: "rgba(59, 130, 246, 0.08)",
                  borderRadius: 999,
                  color: "#1d4ed8",
                  display: "flex",
                  fontSize: 20,
                  fontWeight: 700,
                  padding: "8px 14px",
                }}
              >
                Getting It
              </div>
              <div
                style={{
                  color: "#64748b",
                  display: "flex",
                  fontSize: 18,
                }}
              >
                Advanced React Patterns
              </div>
            </div>

            <div
              style={{
                color: "#0f172a",
                display: "flex",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.2,
              }}
            >
              What problem does useMemo actually solve?
            </div>

            <div
              style={{
                color: "#475569",
                display: "flex",
                fontSize: 20,
                lineHeight: 1.35,
              }}
            >
              It gives expensive work a stable home, so rerenders stay easier to
              reason about.
            </div>
            <div
              style={{
                display: "flex",
                gap: 14,
              }}
            >
              <Tag>Today 2h 25m</Tag>
              <Tag>Review 82%</Tag>
            </div>
          </div>
        </div>
      </div>
    </div>,
    {
      ...socialImageSize,
    }
  )
}
