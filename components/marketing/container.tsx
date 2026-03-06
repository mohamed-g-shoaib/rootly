import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type MarketingContainerProps = ComponentPropsWithoutRef<"div">;

export function MarketingContainer({
  className,
  ...props
}: MarketingContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-350 px-4 sm:px-4 md:px-4 lg:px-4 xl:px-6 2xl:px-8",
        className,
      )}
      {...props}
    />
  );
}
