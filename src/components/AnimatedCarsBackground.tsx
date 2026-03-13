import { memo } from "react";

const carPaths = [
  // Sedan silhouette
  "M10,30 Q10,20 20,18 L30,18 Q35,10 45,8 L70,8 Q80,8 85,14 L90,18 Q95,18 98,22 Q100,26 98,30 L92,30 Q92,24 86,24 Q80,24 80,30 L35,30 Q35,24 29,24 Q23,24 23,30 Z",
  // SUV silhouette
  "M8,32 Q8,22 15,20 L25,20 Q28,10 38,6 L62,6 Q72,6 78,12 L88,20 Q95,20 98,24 Q100,28 98,32 L92,32 Q92,26 86,26 Q80,26 80,32 L32,32 Q32,26 26,26 Q20,26 20,32 Z",
  // Sporty sedan silhouette
  "M6,30 Q6,22 14,20 L28,20 Q32,12 42,9 L68,9 Q76,9 82,15 L92,20 Q96,20 98,24 Q100,28 98,30 L90,30 Q90,24 84,24 Q78,24 78,30 L30,30 Q30,24 24,24 Q18,24 18,30 Z",
];

interface CarProps {
  path: string;
  y: number;
  duration: number;
  delay: number;
  scale: number;
  opacity: number;
  reverse?: boolean;
}

const AnimatedCar = memo(({ path, y, duration, delay, scale, opacity, reverse }: CarProps) => (
  <g
    style={{
      animation: `${reverse ? "car-drift-reverse" : "car-drift"} ${duration}s linear ${delay}s infinite`,
      opacity,
    }}
  >
    <g transform={`translate(0, ${y}) scale(${scale})`}>
      <path
        d={path}
        fill="currentColor"
        className="text-primary"
        style={{ opacity: 0.12 }}
      />
    </g>
  </g>
));

AnimatedCar.displayName = "AnimatedCar";

const cars: CarProps[] = [
  { path: carPaths[0], y: 60, duration: 28, delay: 0, scale: 1.8, opacity: 0.7 },
  { path: carPaths[1], y: 180, duration: 35, delay: 5, scale: 1.4, opacity: 0.5, reverse: true },
  { path: carPaths[2], y: 300, duration: 32, delay: 2, scale: 1.6, opacity: 0.6 },
  { path: carPaths[0], y: 420, duration: 40, delay: 8, scale: 1.2, opacity: 0.4, reverse: true },
  { path: carPaths[1], y: 120, duration: 25, delay: 12, scale: 2.0, opacity: 0.3 },
  { path: carPaths[2], y: 350, duration: 38, delay: 15, scale: 1.0, opacity: 0.35, reverse: true },
];

export const AnimatedCarsBackground = memo(() => (
  <>
    <style>{`
      @keyframes car-drift {
        0% { transform: translateX(-200px); }
        100% { transform: translateX(calc(100vw + 200px)); }
      }
      @keyframes car-drift-reverse {
        0% { transform: translateX(calc(100vw + 200px)); }
        100% { transform: translateX(-200px); }
      }
    `}</style>
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-[1]">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 500"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {cars.map((car, i) => (
          <AnimatedCar key={i} {...car} />
        ))}
      </svg>
    </div>
  </>
));

AnimatedCarsBackground.displayName = "AnimatedCarsBackground";
