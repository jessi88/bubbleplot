import { useState } from "react";
import { scaleSqrt, scaleLinear, max, min } from "d3";
import { AxisTop } from "./AxisTop";
import { AxisLeft } from "./AxisLeft";

const Bubbleplot = ({
  data,
  width,
  height,
  highlightColor,
  backgroundColor,
  backgroundTextColor,
  tickColor,
}) => {
  const MARGIN = {
    top: 70,
    right: 13,
    bottom: 0,
    left: 60,
  };
  const BUBBLE_MIN_SIZE = 4;
  const BUBBLE_MAX_SIZE = 40;

  const boundsWidth = width - MARGIN.left - MARGIN.right;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [hoveredName, setHoveredName] = useState(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    country: "",
    continent: "",
    lifeExp: 0,
    gdpPercap: 0,
    pop: 0,
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
  const sizeScale = scaleSqrt()
    .domain([minPop, maxPop])
    .range([BUBBLE_MIN_SIZE, BUBBLE_MAX_SIZE]);

  const handleMouseEnter = (event, d) => {
    setHoveredName(d.country);
    setTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      country: d.country,
      continent: d.continent,
      lifeExp: d.lifeExp,
      gdpPercap: d.gdpPercap,
      pop: d.pop,
    });
  };

  const handleMouseMove = (event, d) => {
    setTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      country: d.country,
      continent: d.continent,
      lifeExp: d.lifeExp,
      gdpPercap: d.gdpPercap,
      pop: d.pop,
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
      <svg width="100%" height="auto" viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          {data.map((d) => {
            const isHovered = hoveredName === d.country;
            const isAsian = d.continent === "Asia";

            return (
              <g
                key={d.name}
                onMouseEnter={(event) => handleMouseEnter(event, d)}
                onMouseMove={(event) => handleMouseMove(event, d)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: "pointer" }}
              >
                <circle
                  key={d.country}
                  cx={xScale(d.gdpPercap)}
                  cy={yScale(d.lifeExp)}
                  r={sizeScale(d.pop)}
                  stroke={isAsian ? highlightColor : backgroundColor}
                  fill={isAsian ? highlightColor : backgroundColor}
                  strokeWidth={1}
                  fill={isAsian ? highlightColor : backgroundColor}
                  opacity={isAsian ? 1 : 0.5}
                  fillOpacity={isHovered ? 0.8 : 0.4}
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
            label="GDP PER CAPITA (PPP-ADJUSTED INTERNATIONAL DOLLARS)"
            tickColor={tickColor}
          />

          <AxisLeft
            yScale={yScale}
            pixelsPerTick={40}
            boundsWidth={boundsWidth}
            label="LIFE EXPECTANCY (YEARS)"
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
            color: tooltip.continent === "Asia" ? highlightColor : backgroundTextColor,
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
          <div style={{ fontSize: "14px" }}>
            <strong>{tooltip.country}</strong>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "0px 20px",
              padding: "8px",
              alignItems: "start",
            }}
          >
            <span style={{ fontWeight: "bold", justifySelf: "start" }}>Continent</span>
            <span style={{ textAlign: "right", fontFamily: "monospace", justifySelf: "start" }}>
              {tooltip.continent}
            </span>

            <span style={{ fontWeight: "bold", justifySelf: "start" }}>Life Exp.</span>
            <span style={{ textAlign: "right", fontFamily: "monospace", justifySelf: "start" }}>
              {tooltip.lifeExp.toFixed(1)} yrs
            </span>

            <span style={{ fontWeight: "bold", justifySelf: "start" }}>GDP / Capita</span>
            <span style={{ textAlign: "right", fontFamily: "monospace", justifySelf: "start" }}>
              {tooltip.gdpPercap.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}{" "}
              intl. $
            </span>

            <span style={{ fontWeight: "bold", justifySelf: "start" }}>Population</span>
            <span style={{ textAlign: "right", fontFamily: "monospace", justifySelf: "start" }}>
              {new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(tooltip.pop)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bubbleplot;
