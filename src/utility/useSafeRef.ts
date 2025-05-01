import { useRef, MutableRefObject } from "react";

/**
 * A custom useRef hook that prevents unsafe assignments and logs errors for debugging.
 */
export function useSafeRef<T>(initialValue: T | null = null): MutableRefObject<T | null> {
  const ref = useRef<T | null>(initialValue);

  Object.defineProperty(ref, "current", {
    get() {
      return ref.current;
    },
    set(value) {
      if (
        typeof ref !== "object" ||
        ref === null ||
        typeof value === "boolean"
      ) {
        console.error("❌ Invalid assignment to a ref (e.g. boolean). Stack trace:");
        console.trace();
      }
      ref.current = value;
    },
    configurable: true, // Required to redefine an existing property in strict mode
  });

  return ref;
}
