import React, { createElement } from "react";
import { useEffect, useRef, useState } from "react";
import { darken } from "polished";

interface RegionProps {
  d: string;
  fill: string;
  fillOpacity: number;
  region: string;
  troups?: number;
}

const Region: React.FC<RegionProps> = ({
  d,
  fill,
  fillOpacity,
  region,
  troups,
}: RegionProps) => {
  const [circle, setCircle] = useState<JSX.Element | null>(null);
  const [troupsText, setTroupsText] = useState<JSX.Element | null>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (path) {
      const bbox = path.getBBox();
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;
      const r = 60;
      const textX = cx;
      const textY = cy;
      const circle = createElement("circle", {
        cx,
        cy,
        r,
        fill: "red",
        stroke: darken(0.2, "red"),
        strokeWidth: 10,
      });
      setCircle(circle);
      const troupsText = createElement("text", {
        x: textX,
        y: textY,
        textAnchor: "middle",
        dominantBaseline: "middle",
        fill: "black",
        fontSize: "24",
        children: troups,
      });
      setTroupsText(troupsText);
    }
  }, [region]);

  const handlePathClick = () => {
    console.log(`Clicked on region ${region}`);
    console.log(`Troups: ${troups}`);
  };

  return (
    <g>
      <path
        d={d}
        fill={fill}
        fillOpacity={fillOpacity}
        onClick={handlePathClick}
        ref={pathRef}
      />
      {circle && troupsText && (
        <>
          {circle}
          {troupsText}
        </>
      )}
    </g>
  );
};
export default Region;
