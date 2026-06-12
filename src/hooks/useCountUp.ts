import { useState, useEffect, useRef } from "react";

export function useCountUp(target: number, duration = 1800, startOnMount = false) {
  const [count, setCount] = useState(startOnMount ? 0 : target);
  const [started, setStarted] = useState(startOnMount);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!startOnMount) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnMount]);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}
