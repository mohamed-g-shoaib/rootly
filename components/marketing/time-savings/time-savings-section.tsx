import Link from "next/link";
import { MarketingContainer } from "@/components/marketing/container";

type StatCard = {
  label: string;
  value: string;
  description: string;
};

function FlipLine({
  primary,
  secondary,
  className,
}: {
  primary: string;
  secondary: string;
  className: string;
}) {
  return (
    <span className={`relative block overflow-hidden ${className}`}>
      <span
        aria-hidden="true"
        className="block translate-y-0 opacity-100 transition-all duration-200 ease-out group-hover:-translate-y-full group-hover:opacity-0 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:opacity-100"
      >
        {primary}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full opacity-0 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:hidden"
      >
        {secondary}
      </span>
    </span>
  );
}

const topCards: StatCard[] = [
  {
    label: "Chasing receipts",
    value: "45 minutes per week",
    description: "Receipts arrive late, get lost, or need follow-ups.",
  },
  {
    label: "Cleaning transactions",
    value: "1 hour per week",
    description: "Categorizing, fixing duplicates, and making numbers line up.",
  },
];

const invoiceCard: StatCard = {
  label: "Preparing invoices",
  value: "1–2 hours per week",
  description: "Creating invoices, checking payments, and answering questions.",
};

function StatArticle({ label, value, description }: StatCard) {
  return (
    <article className="group relative cursor-pointer overflow-hidden border border-border bg-background p-4 transition-all duration-200 hover:border-muted-foreground hover:bg-secondary/40 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="min-w-0">
          <p className="hidden text-xs text-muted-foreground sm:block">
            {label}
          </p>
          <h3 className="mt-1 text-balance text-base text-foreground sm:text-lg">
            {value}
          </h3>
          <p className="mt-1 text-pretty text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

export function TimeSavingsSection() {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-24">
      <MarketingContainer>
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-balance text-2xl text-foreground sm:text-2xl">
            Less admin. More focus.
          </h2>
          <p className="text-pretty mx-auto hidden max-w-2xl text-base leading-normal text-muted-foreground sm:block">
            Rootly removes manual financial work so you can spend time on what
            actually matters.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topCards.map((card) => (
              <StatArticle key={card.label} {...card} />
            ))}

            <article className="relative hidden cursor-pointer overflow-hidden border border-border bg-background p-4 transition-all duration-200 hover:border-muted-foreground hover:bg-secondary/40 sm:p-5 xl:block">
              <div className="flex items-start gap-3">
                <div className="min-w-0">
                  <p className="hidden text-xs text-muted-foreground sm:block">
                    {invoiceCard.label}
                  </p>
                  <h3 className="mt-1 text-balance text-base text-foreground sm:text-lg">
                    {invoiceCard.value}
                  </h3>
                  <p className="mt-1 text-pretty text-sm text-muted-foreground">
                    {invoiceCard.description}
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-10">
            <Link
              href="/file-storage"
              className="group relative overflow-hidden border border-border bg-background p-4 transition-all duration-200 hover:border-muted-foreground hover:bg-secondary/40 touch-manipulation sm:p-5 xl:col-span-3"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0">
                  <p className="hidden text-xs text-muted-foreground sm:block">
                    Explaining the numbers
                  </p>
                  <h3 className="mt-1 text-balance text-base text-foreground sm:text-lg">
                    1 hour per week
                  </h3>
                  <p className="mt-1 text-pretty text-sm text-muted-foreground">
                    Pulling data together and explaining what changed and why.
                  </p>
                </div>
              </div>
            </Link>

            <article className="relative cursor-pointer overflow-hidden border border-border bg-background p-4 transition-all duration-200 hover:border-muted-foreground hover:bg-secondary/40 sm:p-5 xl:hidden">
              <div className="flex items-start gap-3">
                <div className="min-w-0">
                  <p className="hidden text-xs text-muted-foreground sm:block">
                    {invoiceCard.label}
                  </p>
                  <h3 className="mt-1 text-balance text-base text-foreground sm:text-lg">
                    {invoiceCard.value}
                  </h3>
                  <p className="mt-1 text-pretty text-sm text-muted-foreground">
                    {invoiceCard.description}
                  </p>
                </div>
              </div>
            </article>

            <a
              href="https://app.rootly.ai/"
              className="group relative hidden overflow-hidden border border-border bg-secondary p-4 transition-all duration-200 hover:border-muted-foreground touch-manipulation sm:p-5 md:p-5 lg:p-6 xl:col-span-7 xl:block"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <FlipLine
                    primary="As things add up"
                    secondary="What changes"
                    className="hidden text-xs text-muted-foreground sm:block"
                  />
                  <FlipLine
                    primary="What disappears over time"
                    secondary="Get your time back"
                    className="mt-1 text-balance text-base text-foreground sm:text-lg"
                  />
                  <FlipLine
                    primary="Manual financial work caused by disconnected tools."
                    secondary="Rootly handles the financial busywork so you can focus on running the business."
                    className="mt-1 text-pretty text-sm text-muted-foreground"
                  />
                </div>

                <div className="flex flex-col items-end">
                  <div className="text-4xl text-foreground transition-colors duration-200 sm:text-5xl">
                    4–6 hours
                  </div>
                </div>
              </div>
            </a>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 xl:hidden">
            <a
              href="https://app.rootly.ai/"
              className="relative overflow-hidden border border-border bg-secondary p-4 transition-all duration-200 hover:border-muted-foreground touch-manipulation sm:p-5 md:p-5 lg:p-6"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <p className="hidden text-xs text-muted-foreground transition-colors duration-200 sm:block">
                    As things add up
                  </p>
                  <p className="mt-1 text-balance text-base text-foreground transition-colors duration-200 sm:text-lg">
                    What disappears over time
                  </p>
                  <p className="mt-1 text-pretty text-sm text-muted-foreground transition-colors duration-200">
                    Manual financial work caused by disconnected tools.
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <div className="text-4xl text-foreground transition-colors duration-200 sm:text-5xl">
                    4–6 hours
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
