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

function SourceCard({
  body,
  title,
}: {
  body: string
  title: string
}) {
  return (
    <Card className="bg-background/80">
      <CardPanel className="flex flex-col gap-2 p-4">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{body}</div>
      </CardPanel>
    </Card>
  )
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <Card className="bg-background/80">
      <CardPanel className="flex flex-col gap-2 p-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-semibold text-foreground tabular-nums">{value}</div>
      </CardPanel>
    </Card>
  )
}

export function HomepageHeroSurface() {
  return (
    <Card className="overflow-hidden">
      <CardPanel className="grid gap-4 p-3 sm:p-4 lg:grid-cols-2 lg:p-6">
        <Card className="bg-muted/35">
          <CardHeader className="border-b bg-muted/40">
            <Badge variant="outline" className="w-fit">
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
            <div className="flex flex-wrap gap-2">
              {LEARNING_INPUTS.map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>

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
          </CardPanel>
        </Card>

        <Card className="bg-muted/35">
          <CardHeader className="border-b bg-muted/40">
            <Badge variant="outline" className="w-fit">
              With Rootly
            </Badge>
            <CardTitle className="text-base text-balance">
              One calm system for learning on purpose.
            </CardTitle>
            <CardDescription className="text-pretty">
              Your understanding, study rhythm, and review context stay connected
              so you can pick up exactly where your thinking left off.
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
                <div className="text-sm text-muted-foreground text-pretty">
                  It gives expensive work and unstable references a deliberate
                  home, so rerenders stay predictable and easier to reason about.
                </div>
              </CardPanel>
            </Card>

            <div className="grid gap-3 sm:grid-cols-3">
              {SURFACE_STATS.map((item) => (
                <StatCard key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </CardPanel>
        </Card>
      </CardPanel>
    </Card>
  )
}
