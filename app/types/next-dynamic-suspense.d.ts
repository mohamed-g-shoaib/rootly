export declare const __next_dynamic_suspense_shim: unique symbol;

declare module "next/dynamic" {
  export interface DynamicOptions<P> {
    suspense?: boolean;
  }
}
