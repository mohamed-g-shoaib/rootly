export declare const __array_to_sorted_shim: unique symbol

declare global {
  interface Array<T> {
    toSorted(compareFn?: (a: T, b: T) => number): T[]
  }
}
