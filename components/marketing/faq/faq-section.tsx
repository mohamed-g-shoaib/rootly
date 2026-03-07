"use client";

import { MarketingContainer } from "@/components/marketing/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "What is Rootly?",
    answer:
      "Rootly is a financial workspace for founders and small teams. It brings transactions, receipts, invoices, time tracking, and files into one connected system so you always know what is going on in your business.",
  },
  {
    question: "How does Rootly connect to my bank?",
    answer:
      "Rootly connects to over 25,000 banks worldwide. Once connected, transactions are imported automatically and kept up to date.",
  },
  {
    question: "How do receipts and invoices get into Rootly?",
    answer:
      "Receipts and invoices can be pulled automatically from connected email accounts, synced from existing folders, or uploaded manually. They are then matched to transactions so everything stays organized.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. All plans include a 14-day free trial. A credit card is required to get started, and you will not be charged until the trial ends.",
  },
];

export function FAQSection() {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-24">
      <MarketingContainer>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <header className="mx-auto max-w-xl space-y-4 px-2 text-center lg:mx-0 lg:max-w-2xl lg:px-0 lg:text-left">
            <h2 className="text-wrap-pretty font-sans text-3xl leading-tight md:text-3xl lg:text-3xl lg:leading-tight xl:text-3xl xl:leading-[1.3] 2xl:text-3xl 3xl:text-4xl">
              <span className="text-foreground">
                Frequently asked questions
              </span>
            </h2>
            <p className="text-wrap-pretty mx-auto hidden max-w-md font-sans text-base leading-normal text-muted-foreground sm:block lg:mx-0 lg:max-w-none lg:text-left">
              Everything you need to know before getting started.
            </p>
          </header>

          <Accordion
            type="single"
            collapsible
            defaultValue="faq-0"
            className="w-full"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${index}`}
                className="mb-3 border border-border bg-background px-4 last:mb-0 sm:px-6"
              >
                <AccordionTrigger
                  indicator="plus-minus"
                  className="py-4 text-sm text-foreground hover:no-underline"
                >
                  <span className="pr-6 text-left">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </MarketingContainer>
    </section>
  );
}
