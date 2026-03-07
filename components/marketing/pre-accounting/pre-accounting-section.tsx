import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { MarketingContainer } from "@/components/marketing/container";

type ChecklistItem = {
  mobileText?: string;
  desktopText: string;
};

const checklistItems: ChecklistItem[] = [
  {
    mobileText: "Transactions from 25,000+ banks",
    desktopText:
      "Transactions from 25,000+ banks are categorized and reconciled automatically",
  },
  {
    mobileText: "Receipts pulled from email and uploads",
    desktopText:
      "Receipts and invoices are pulled from email and payments, then matched to transactions",
  },
  {
    desktopText: "Clean records across all connected accounts",
  },
  {
    mobileText: "Taxes tracked per transaction",
    desktopText: "Taxes are tracked per transaction",
  },
  {
    mobileText: "Ready to export to your accounting system",
    desktopText: "Export-ready for your accounting system",
  },
];

export function PreAccountingSection() {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-24">
      <MarketingContainer>
        <div className="mx-auto mb-12 max-w-xl space-y-4 px-2 text-center lg:mx-0 lg:mb-14 lg:max-w-2xl lg:px-0 lg:text-left">
          <h2 className="text-wrap-pretty font-sans text-3xl leading-tight md:text-3xl lg:text-3xl lg:leading-tight xl:text-3xl xl:leading-[1.3] 2xl:text-3xl 3xl:text-4xl">
            <span className="text-foreground">
              Ready for accounting, without extra work
            </span>
          </h2>
          <p className="text-wrap-pretty mx-auto hidden max-w-md font-sans text-base leading-normal text-muted-foreground sm:block lg:mx-0 lg:max-w-none lg:text-left">
            Receipts, invoices, and transactions stay organized automatically so
            your books are always ready when you need them.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="relative mx-auto mb-6 h-25 w-28">
            <Image
              src="/images/accounting-light.png"
              alt="Accounting icon"
              width={112}
              height={100}
              className="h-full w-full object-contain dark:hidden"
            />
            <Image
              src="/images/accounting-dark.png"
              alt="Accounting icon"
              width={112}
              height={100}
              className="hidden h-full w-full object-contain dark:block"
            />
          </div>

          <Link
            href="/pre-accounting"
            className="block cursor-pointer transition-opacity hover:opacity-90"
          >
            <div className="relative border border-border bg-secondary p-6">
              <div className="space-y-6">
                {checklistItems.map((item) => (
                  <div
                    key={item.desktopText}
                    className="flex items-center gap-3"
                  >
                    <div className="flex size-5 shrink-0 items-center justify-center border border-border bg-secondary">
                      <CheckIcon className="text-foreground" size={14} />
                    </div>

                    <span className="text-sm text-foreground">
                      {item.mobileText ? (
                        <>
                          <span className="sm:hidden">{item.mobileText}</span>
                          <span className="hidden sm:inline">
                            {item.desktopText}
                          </span>
                        </>
                      ) : (
                        item.desktopText
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/pre-accounting"
            className="inline-flex items-center text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Learn more about pre-accounting
          </Link>
        </div>
      </MarketingContainer>
    </section>
  );
}
