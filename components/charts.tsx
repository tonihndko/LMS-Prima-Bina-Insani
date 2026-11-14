const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function Donut({ value, total, label }: { value: number; total: number; label: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const offset = CIRCUMFERENCE * (1 - pct / 100);
  return (
    <figure className="chart donut">
      <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
        <circle className="donut-track" cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="12" />
        <circle className="donut-value" cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="12"
          strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset}
          transform="rotate(-90 60 60)" />
      </svg>
      <figcaption>
        <strong>{pct}%</strong>
        <span>{value}/{total}</span>
      </figcaption>
      <span className="sr-only">{`${label}: ${value} dari ${total} (${pct}%)`}</span>
    </figure>
  );
}

export function ScoreBars({ scores }: { scores: number[] }) {
  if (!scores.length) return null;
  const buckets = Array.from({ length: 10 }, () => 0);
  for (const score of scores) buckets[Math.min(9, Math.floor(score / 10))] += 1;
  const max = Math.max(...buckets);
  return (
    <figure className="chart bars">
      <svg viewBox="0 0 300 180" role="img" aria-label={`Distribusi ${scores.length} nilai`}>
        {[0, 0.5, 1].map((line) => (
          <line key={line} className="bars-grid" x1="0" x2="300"
            y1={20 + line * 140} y2={20 + line * 140} />
        ))}
        {buckets.map((count, index) => {
          const height = max ? (count / max) * 140 : 0;
          return (
            <g key={index}>
              <rect className="bars-value" x={index * 30 + 4} y={160 - height}
                width="22" height={height} rx="3" />
              <text className="bars-label" x={index * 30 + 15} y={175} textAnchor="middle">
                {index * 10}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>{`${scores.length} nilai terkumpul · tertinggi ${Math.max(...scores)}`}</figcaption>
    </figure>
  );
}

export function Sparkline({ counts }: { counts: number[] }) {
  if (counts.length < 2) return null;
  const max = Math.max(...counts, 1);
  const width = 220;
  const height = 40;
  const step = width / (counts.length - 1);
  const points = counts.map((count, index) =>
    `${(index * step).toFixed(1)},${(height - (count / max) * (height - 6) - 3).toFixed(1)}`
  ).join(" ");
  return (
    <svg className="chart sparkline" viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true">
      <polyline points={points} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
