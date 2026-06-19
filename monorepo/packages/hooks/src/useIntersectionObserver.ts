import { useEffect, useRef, useState, useCallback } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Once `true`, stop observing (useful for lazy loading) */
  freezeOnceVisible?: boolean;
}

/**
 * Observe when an element enters / leaves the viewport.
 *
 * @returns `[ref, isVisible, entry]`
 *   - Attach `ref` to the DOM element you want to observe
 *   - `isVisible` — `true` when the element is in the viewport
 *   - `entry` — the raw `IntersectionObserverEntry` for advanced use cases
 *
 * @example
 * // Infinite scroll trigger
 * const [sentinelRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });
 * useEffect(() => { if (isVisible) fetchNextPage(); }, [isVisible]);
 * return <div ref={sentinelRef} />;
 *
 * @example
 * // Lazy-load an image
 * const [imgRef, isVisible] = useIntersectionObserver({ freezeOnceVisible: true });
 * return <img ref={imgRef} src={isVisible ? realSrc : undefined} />;
 */
export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = "0px",
  freezeOnceVisible = false,
}: UseIntersectionObserverOptions = {}): [
  (node: Element | null) => void,
  boolean,
  IntersectionObserverEntry | null,
] {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const isVisible = !!entry?.isIntersecting;
  const frozen = isVisible && freezeOnceVisible;

  const ref = useCallback(
    (node: Element | null) => {
      // Disconnect the previous observer when the ref changes
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node || frozen) return;

      observerRef.current = new IntersectionObserver(
        ([obs]) => setEntry(obs ?? null),
        { threshold, root, rootMargin }
      );
      observerRef.current.observe(node);
    },
    [threshold, root, rootMargin, frozen]
  );

  return [ref, isVisible, entry];
}
