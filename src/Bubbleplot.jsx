import { useState } from "react";
import { scaleSqrt, scaleLinear, max, min } from "d3";
import { AxisTop } from "./AxisTop";
import { AxisLeft } from "./AxisLeft";

const Bubbleplot = ({
  data,
  width,
  height,
  barColor,
  gridColor,
  tickColor,
}) => {
  const MARGIN = {
    top: 50,
    right: 13,
    bottom: 0,
    left: 60,
  };

  const boundsWidth = width - MARGIN.left - MARGIN.right;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [hoveredName, setHoveredName] = useState(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    name: "",
    count: 0,
  });

  const minLifeExp = min(data, (d) => d.lifeExp) - 1 || 0;
  const maxLifeExp = max(data, (d) => d.lifeExp) + 1 || 0;
  const minPop = min(data, (d) => d.pop) - 1 || 0;
  const maxPop = max(data, (d) => d.pop) + 1 || 0;
  const maxGdpPercap = max(data, (d) => d.gdpPercap) + 1 || 0;

  const xScale = scaleLinear()
    .domain([0, maxGdpPercap])
    .range([0, boundsWidth]);
  const yScale = scaleLinear()
    .domain([minLifeExp, maxLifeExp])
    .range([boundsHeight, 0]);
  const sizeScale = scaleSqrt().domain([minPop, maxPop]).range([2, 20]);

  const handleMouseEnter = (event, d) => {
    setHoveredName(d.country);
    setTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      country: d.country,
      lifeExp: d.lifeExp,
    });
  };

  const handleMouseMove = (event, d) => {
    setTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      country: d.country,
      lifeExp: d.lifeExp,
    });
  };

  const handleMouseLeave = () => {
    setHoveredName(null);
    setTooltip((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  return (
    <div>
      <svg width={width} height={height}>
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          {data.map((d, i) => {
            const isHovered = hoveredName === d.country;

            return (
              <g
                key={d.name}
                onMouseEnter={(event) => handleMouseEnter(event, d)}
                onMouseMove={(event) => handleMouseMove(event, d)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: "pointer" }}
              >
                <circle
                  key={i}
                  cx={xScale(d.gdpPercap)}
                  cy={yScale(d.lifeExp)}
                  r={sizeScale(d.pop)}
                  fill={isHovered ? barColor : barColor}
                  opacity={
                    hoveredName
                      ? isHovered
                        ? 1
                        : 0.4 // fade non-hovered bars
                      : 1
                  }
                  style={{
                    transition:
                      "width 0.8s ease, fill 0.2s ease, opacity 0.2s ease, transform 0.2s ease",
                    transform: isHovered ? "scaleY(1.08)" : "scaleY(1)",
                    transformOrigin: "center",
                    transformBox: "fill-box",
                  }}
                />
              </g>
            );
          })}

          <AxisTop
            xScale={xScale}
            pixelsPerTick={60}
            boundsHeight={boundsHeight}
            label="GDP PER CAPITA"
            gridColor={gridColor}
            tickColor={tickColor}
          />

          <AxisLeft
            yScale={yScale}
            pixelsPerTick={40}
            boundsWidth={boundsWidth}
            label="LIFE EXPECTANCY"
            gridColor={gridColor}
            tickColor={tickColor}
          />
        </g>
      </svg>

      {tooltip.visible && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 12,
            top: tooltip.y + 12,
            background: "rgba(240, 240, 240, 0.85)",
            color: barColor,
            padding: "8px 10px",
            borderRadius: "8px",
            fontSize: "12px",
            lineHeight: 1.4,
            pointerEvents: "none",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
            whiteSpace: "nowrap",
          }}
        >
          <div>
            <strong>{tooltip.country}</strong>
          </div>
          <div>Life Expectancy: {tooltip.lifeExp}</div>
        </div>
      )}
    </div>
  );
};

export default Bubbleplot;
