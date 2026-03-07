"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import {
  CaretDownIcon,
  CaretUpIcon,
  MinusIcon,
  PlusIcon,
} from "@phosphor-icons/react";

type AccordionIndicator = "caret" | "plus-minus";

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  indicator = "caret",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  indicator?: AccordionIndicator;
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        data-indicator={indicator}
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-none border border-transparent py-2.5 text-left text-xs font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
        <span
          data-slot="accordion-trigger-icon"
          aria-hidden="true"
          className="relative inline-flex items-center justify-center group-data-[indicator=caret]/accordion-trigger:hidden"
        >
          <PlusIcon className="pointer-events-none absolute opacity-100 transition-all duration-200 ease-out [clip-path:inset(0_0_0_0)] group-aria-expanded/accordion-trigger:opacity-0 group-aria-expanded/accordion-trigger:[clip-path:inset(46%_0_46%_0)]" />
          <MinusIcon className="pointer-events-none absolute opacity-0 transition-all duration-200 ease-out group-aria-expanded/accordion-trigger:opacity-100" />
        </span>
        <CaretDownIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden group-data-[indicator=plus-minus]/accordion-trigger:hidden"
        />
        <CaretUpIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline group-data-[indicator=plus-minus]/accordion-trigger:hidden"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-xs data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--radix-accordion-content-height) pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
