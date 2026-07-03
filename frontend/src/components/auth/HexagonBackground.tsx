/**
 * Faint honeycomb watermark in the bottom corners of the auth pages
 * (matches the Figma exports). Purely decorative; hidden on small screens.
 */
export function HexagonBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block"
    >
      <HexCluster className="absolute -bottom-10 -left-10 text-grey-200/70" />
      <HexCluster className="absolute -bottom-10 -right-10 -scale-x-100 text-grey-200/70" />
    </div>
  );
}

function HexCluster({ className }: { className?: string }) {
  return (
    <svg
      width="260"
      height="220"
      viewBox="0 0 260 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        <Hex x={20} y={150} />
        <Hex x={20} y={90} />
        <Hex x={72} y={120} />
        <Hex x={72} y={180} />
        <Hex x={124} y={150} />
        <Hex x={124} y={90} />
        <Hex x={72} y={60} />
      </g>
    </svg>
  );
}

/** A pointy-top hexagon centred at (x, y) with radius 34. */
function Hex({ x, y }: { x: number; y: number }) {
  const r = 34;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 90);
    return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return <polygon points={pts} />;
}
