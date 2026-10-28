// Deterministic values (no Math.random) so the particles look the same on
// every render and don't jump around when the component re-renders.
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  left: ((i * 37 + 11) % 96) + 2,
  top: ((i * 53 + 7) % 78) + 11,
  size: 2 + (i % 4),
  duration: 3.5 + (i % 7) * 0.45,
  delay: -((i % 10) * 0.3),
  x1: ((i * 5) % 17) - 8,
  y1: ((i * 7) % 15) - 7,
  x2: ((i * 3) % 21) - 10,
  y2: ((i * 11) % 19) - 9,
  isLime: i % 4 === 0,
}));

export default function AtomField() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={`absolute rounded-full motion-reduce:animate-none animate-[atom-float_var(--atom-duration)_ease-in-out_infinite] [animation-delay:var(--atom-delay)] ${
            p.isLime
              ? "bg-lime-300 shadow-[0_0_8px_rgba(190,242,100,0.8)]"
              : "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]"
          }`}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            "--atom-duration": `${p.duration}s`,
            "--atom-delay": `${p.delay}s`,
            "--x1": `${p.x1}px`,
            "--y1": `${p.y1}px`,
            "--x2": `${p.x2}px`,
            "--y2": `${p.y2}px`,
          }}
        />
      ))}
    </div>
  );
}