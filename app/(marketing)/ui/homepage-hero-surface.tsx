import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card"

const LEARNING_INPUTS = [
  "React course",
  "Docs tab",
  "YouTube lesson",
  "SQL article",
] as const

const SURFACE_STATS = [
  { label: "Today", value: "2h 25m" },
  { label: "Review accuracy", value: "82%" },
  { label: "Current focus", value: "React patterns" },
] as const

function SourceCard({ body, title }: { body: string; title: string }) {
  return (
    <Card className="bg-background/80">
      <CardPanel className="flex flex-col gap-2 p-4">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{body}</div>
      </CardPanel>
    </Card>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="bg-background/80">
      <CardPanel className="flex flex-col gap-2 p-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-semibold text-foreground tabular-nums">
          {value}
        </div>
      </CardPanel>
    </Card>
  )
}

function MobileSurfaceSection({
  badge,
  badgeVariant,
  body,
  children,
  title,
}: {
  badge: string
  badgeVariant: "info" | "success" | "warning"
  body: string
  children?: React.ReactNode
  title: string
}) {
  return (
    <div className="rounded-xl border bg-muted/35 p-3">
      <div className="flex flex-col gap-2">
        <Badge variant={badgeVariant} className="w-fit">
          {badge}
        </Badge>
        <div className="text-sm font-medium text-balance">{title}</div>
        <div className="text-sm text-pretty text-muted-foreground">{body}</div>
        {children}
      </div>
    </div>
  )
}

export function HomepageHeroSurface() {
  return (
    <>
      <Card className="overflow-hidden lg:hidden">
        <CardPanel className="flex flex-col gap-3 p-3">
          <MobileSurfaceSection
            badge="Before Rootly"
            badgeVariant="warning"
            title="Learning happens in fragments."
            body="Tabs, tutorials, and loose notes split the context you need."
          >
            <div className="rounded-xl border bg-background/80 px-3 py-2">
              <div className="text-xs text-muted-foreground">Course tab</div>
              <div className="pt-1 text-sm font-medium text-balance">
                You pause on an important point, but the takeaway never gets
                turned into something durable.
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {LEARNING_INPUTS.slice(0, 3).map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </MobileSurfaceSection>

          <MobileSurfaceSection
            badge="With Rootly"
            badgeVariant="success"
            title="One calm system for learning on purpose."
            body="Notes, progress, and review stay connected, so your next session starts warm."
          >
            <div className="rounded-xl border bg-background/80 px-3 py-2">
              <div className="text-xs text-muted-foreground">
                Advanced React Patterns
              </div>
              <div className="pt-1 text-sm font-medium text-balance">
                What problem does <code>useMemo</code> actually solve?
              </div>
            </div>
          </MobileSurfaceSection>

          <div className="grid grid-cols-2 gap-2">
            {SURFACE_STATS.slice(0, 2).map((item) => (
              <StatCard
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        </CardPanel>
      </Card>

      <Card className="hidden overflow-hidden lg:flex">
        <CardPanel className="grid gap-4 p-4 lg:grid-cols-2">
          <Card className="bg-muted/35">
            <CardHeader className="gap-2 border-b bg-muted/40 p-4">
              <Badge variant="warning" className="w-fit">
                Before Rootly
              </Badge>
              <CardTitle className="text-base text-balance">
                Learning happens in fragments.
              </CardTitle>
              <CardDescription className="text-pretty">
                The useful parts are scattered across tabs, tutorials, and rough
                notes, so the next study session starts cold.
              </CardDescription>
            </CardHeader>

            <CardPanel className="flex flex-col gap-4 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <SourceCard
                  title="Course tab"
                  body="You pause on an important point, but the takeaway never gets turned into something durable."
                />
                <SourceCard
                  title="Loose note"
                  body="You wrote it down somewhere, but not in a shape that helps recall or review."
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {LEARNING_INPUTS.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardPanel>
          </Card>

          <Card className="bg-muted/35">
            <CardHeader className="gap-2 border-b bg-muted/40 p-4">
              <Badge variant="success" className="w-fit">
                With Rootly
              </Badge>
              <CardTitle className="text-base text-balance">
                One calm system for learning on purpose.
              </CardTitle>
              <CardDescription className="text-pretty">
                Your understanding, study rhythm, and review context stay
                connected so you can pick up exactly where your thinking left
                off.
              </CardDescription>
            </CardHeader>

            <CardPanel className="flex flex-col gap-4 p-4">
              <Card className="bg-background/80">
                <CardPanel className="flex flex-col gap-3 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Badge variant="info">Getting It</Badge>
                    <div className="text-sm text-muted-foreground">
                      Advanced React Patterns
                    </div>
                  </div>
                  <div className="font-medium text-balance">
                    What problem does <code>useMemo</code> actually solve?
                  </div>
                  <div className="text-sm text-pretty text-muted-foreground">
                    It gives expensive work and unstable references a deliberate
                    home, so rerenders stay predictable and easier to reason
                    about.
                  </div>
                </CardPanel>
              </Card>

              <div className="grid gap-3 sm:grid-cols-3">
                {SURFACE_STATS.map((item) => (
                  <StatCard
                    key={item.label}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>
            </CardPanel>
          </Card>
        </CardPanel>
      </Card>
    </>
  )
}
