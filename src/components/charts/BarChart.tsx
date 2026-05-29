interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  format?: (v: number) => string;
}

const defaultColors = ["#0d9488", "#2563eb", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#ec4899", "#14b8a6"];

export default function BarChart({ data, height = 200, format }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barGap = 8;
  const barWidth = Math.max(12, Math.min(40, (600 / data.length) - barGap));

  return (
    <div className="w-full" style={{ height }}>
      <svg width="100%" height={height} viewBox={`0 0 ${Math.max(300, data.length * (barWidth + barGap))} ${height}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const x = i * (barWidth + barGap) + barGap / 2;
          const barH = (d.value / max) * (height - 40);
          const y = height - barH - 20;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={barH} rx={4} fill={d.color || `url(#barGrad)`} className="transition-all">
                <title>{d.label}: {format ? format(d.value) : d.value}</title>
              </rect>
              {data.length <= 12 && (
                <text x={x + barWidth / 2} y={height - 4} textAnchor="middle" fontSize="9" fill="#9ca3af">
                  {d.label.length > 5 ? d.label.slice(0, 5) + "..." : d.label}
                </text>
              )}
              {barH > 20 && (
                <text x={x + barWidth / 2} y={y + 12} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">
                  {format ? format(d.value) : d.value}
                </text>
              )}
            </g>
          );
        })}
        {/* baseline */}
        <line x1="0" y1={height - 20} x2={data.length * (barWidth + barGap)} y2={height - 20} stroke="#e5e7eb" strokeWidth="1" />
      </svg>
    </div>
  );
}
