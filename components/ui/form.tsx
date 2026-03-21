"use client";

import { Form as FormPrimitive } from "@base-ui/react/form";

import { cn } from "@/lib/utils";

function Form({ className, ...props }: FormPrimitive.Props) {
  return (
    <FormPrimitive
      className={cn("flex w-full flex-col gap-4", className)}
      data-slot="form"
      {...props}
    />
  );
}

function FormSection({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      data-slot="form-section"
      {...props}
    />
  );
}

function FormSectionTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("font-medium text-sm text-foreground", className)}
      data-slot="form-section-title"
      {...props}
    />
  );
}

function FormSectionDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-muted-foreground text-sm text-pretty", className)}
      data-slot="form-section-description"
      {...props}
    />
  );
}

export {
  Form,
  FormPrimitive,
  FormSection,
  FormSectionTitle,
  FormSectionDescription,
};
