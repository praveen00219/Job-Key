/** Decorative hexagon cluster used in the blue hero banners (Dashboard, Settings). */
export function BannerHexDecor({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width="220"
      height="160"
      viewBox="0 0 220 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g stroke="white" strokeOpacity="0.55" strokeWidth="1.5" fill="none">
        <Hex x={170} y={30} r={26} />
        <Hex x={125} y={55} r={26} />
        <Hex x={195} y={80} r={26} />
        <Hex x={150} y={105} r={26} />
        <Hex x={205} y={135} r={20} />
      </g>
    </svg>
  );
}

function Hex({ x, y, r }: { x: number; y: number; r: number }) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 90);
    return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return <polygon points={pts} />;
}
