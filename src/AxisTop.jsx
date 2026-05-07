const TICK_LENGTH = 6;

export const AxisTop = ({
  xScale,
  pixelsPerTick,
  boundsHeight,
  label,
  gridColor,
  tickColor,
}) => {
  const range = xScale.range();
  const width = range[1] - range[0];
  const numberOfTicksTarget = Math.floor(width / pixelsPerTick);

  const ticks = xScale.ticks(numberOfTicksTarget);

  return (
    <>
      <line
        x1={range[0]}
        y1={0}
        x2={range[1]}
        y2={0}
        stroke={tickColor}
        fill="none"
      />
      {ticks.map((value) => (
        <g key={value} transform={`translate(${xScale(value)}, 0)`}>
          {/* Grid line */}
          {gridColor && (
            <line y1={boundsHeight} y2={0} stroke={gridColor} opacity={0.1} />
          )}
          {/* Tick */}
          <line y2={-TICK_LENGTH} stroke={tickColor} />
          <text
            style={{
              fontSize: "12px",
              textAnchor: "middle",
              transform: "translateY(-15px)",
            }}
          >
            {value}
          </text>
        </g>
      ))}
      {/* Axis title */}
      {label && (
        <text
          x={xScale(ticks[0])}
          y={-45}
          fontSize={12}
          textAnchor="start"
          dx="-0.3em"
        >
          {label}
        </text>
      )}
    </>
  );
};
