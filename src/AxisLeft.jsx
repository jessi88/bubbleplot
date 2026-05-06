const TICK_LENGTH = 6;

export const AxisLeft = ({
  yScale,
  pixelsPerTick,
  boundsWidth,
  label,
  gridColor,
  tickColor,
}) => {
  const range = yScale.range();
  const height = range[0] - range[1];
  const numberOfTicksTarget = Math.floor(height / pixelsPerTick);

  return (
    <>
      <path
        d={["M", 0, range[0], "L", 0, range[1]].join(" ")}
        fill="none"
        stroke={tickColor}
      />
      {yScale.ticks(numberOfTicksTarget).map((value) => (
        <g key={value} transform={`translate(0, ${yScale(value)})`}>
          {/* Grid line */}
          <line x1={0} x2={boundsWidth} stroke={gridColor} opacity={0.1} />
          {/* Tick */}
          <line x2={-TICK_LENGTH} stroke={tickColor} />
          <text
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateX(-20px)",
            }}
          >
            {value}
          </text>
        </g>
      ))}

      {/* Axis title — rotated 90° */}
      {label && (
        <text
          x={0}
          y={-45}
          fontSize={12}
          textAnchor="end"
          transform="rotate(-90)"
        >
          {label}
        </text>
      )}
    </>
  );
};
