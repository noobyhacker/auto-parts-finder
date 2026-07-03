import { useEffect, useRef, useState } from "react";

interface LazyMapProps {
  /** Google Maps embed URL */
  src: string;
  /** Accessible title / placeholder label */
  title: string;
  /** Layout classes applied to both the placeholder and the iframe (same box) */
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Defers a Google Maps <iframe> until it scrolls near the viewport (or is
 * clicked). No connection to google.com happens on first paint, which keeps the
 * critical path free of Maps JS on throttled networks.
 */
export function LazyMap({ src, title, className, style }: LazyMapProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    // Environments without IO (or SSR hydration edge) — just show it.
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  if (show) {
    return (
      <iframe
        src={src}
        className={className}
        style={{ border: 0, ...style }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
      />
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={title}
      onClick={() => setShow(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setShow(true);
        }
      }}
    >
      <div className="flex h-full w-full items-center justify-center bg-muted/40 text-muted-foreground text-sm">
        {title}
      </div>
    </div>
  );
}
