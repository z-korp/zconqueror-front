import { useGetTiles } from '@/hooks/useGetTiles';
import { usePhase } from '@/hooks/usePhase';
import { colorPlayer } from '@/utils/colors';
import { getNeighbors } from '@/utils/map';
import { Phase, useElementStore } from '@/utils/store';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import texture from '../../../public/texture_white.png';
import TroopsMarker from './TroopMarker';
import { colorTilePlayer, colorTilePlayerHighlight } from '@/utils/customColors';

interface Point {
  x: number;
  y: number;
}

interface RegionProps {
  d: string;
  fillOpacity: number;
  id: number;
  region: string;
  troups?: number;
  containerRef?: React.MutableRefObject<null>;
  playerTurn: number;
  onRegionClick: () => void;
}

const Region: React.FC<RegionProps> = ({ d, id, region, containerRef, onRegionClick, playerTurn }: RegionProps) => {
  const { phase } = usePhase();
  const { current_source, current_target } = useElementStore((state) => state);

  const [isHilighted, setIsHighlighted] = useState(false);
  const { tiles } = useGetTiles();

  const tile = tiles[id - 1];

  const troups = tile ? tile.army : 0;
  const color = tile ? colorPlayer[tile.owner + 1 || 0] : 'white';
  const colorTile = tile ? colorTilePlayer[tile.owner + 1 || 0] : 'white';
  const colorTileHighLight = tile ? colorTilePlayerHighlight[tile.owner + 1 || 0] : 'white';

  const [position, setPosition] = useState<{ x: number; y: number }>();
  const pathRef = useRef<SVGPathElement>(null);

  function parsePathForPoints(d: string): Point[] {
    const points: Point[] = [];
    // Regular expression to match all numbers, including negative numbers
    const allNumbersRegex = /-?\d+(\.\d+)?/g;
    // Extract all numbers (coordinates) from the path string
    const allNumbers = d.match(allNumbersRegex);
    if (!allNumbers) return points;

    // Iterate over the numbers two by two (x and y coordinates)
    for (let i = 0; i < allNumbers.length; i += 2) {
      const x = parseFloat(allNumbers[i]);
      const y = parseFloat(allNumbers[i + 1]);
      if (!isNaN(x) && !isNaN(y)) {
        // Ensure both x and y are valid numbers
        points.push({ x, y });
      }
    }

    return points;
  }

  function calculateCentroid(points: Point[]): Point {
    const centroid = { x: 0, y: 0 };
    let signedArea = 0;

    // Calculate the signed area of the polygon and the contributions of each edge to the centroid
    for (let i = 0; i < points.length - 1; i++) {
      const x0 = points[i].x;
      const y0 = points[i].y;
      const x1 = points[i + 1].x;
      const y1 = points[i + 1].y;
      const a = x0 * y1 - x1 * y0;
      signedArea += a;
      centroid.x += (x0 + x1) * a;
      centroid.y += (y0 + y1) * a;
    }

    // Repeat calculation for the edge from the last vertex to the first
    const x0 = points[points.length - 1].x;
    const y0 = points[points.length - 1].y;
    const x1 = points[0].x;
    const y1 = points[0].y;
    const a = x0 * y1 - x1 * y0;
    signedArea += a;
    centroid.x += (x0 + x1) * a;
    centroid.y += (y0 + y1) * a;

    // Finalize the calculation of the centroid coordinates
    signedArea *= 0.5;
    centroid.x /= 6.0 * signedArea;
    centroid.y /= 6.0 * signedArea;

    return centroid;
  }

  useEffect(() => {
    const path = pathRef.current;
    if (path) {
      const points = parsePathForPoints(d);
      if (points.length > 0) {
        const centroid = calculateCentroid(points);

        const svgElement = path.ownerSVGElement;
        if (svgElement) {
          const point = svgElement.createSVGPoint();
          point.x = centroid.x;
          point.y = centroid.y;
          const ctm = svgElement.getScreenCTM();
          if (!ctm) return;

          const screenPoint = point.matrixTransform(ctm);

          // Adjust for the SVG's position in the viewport
          const svgRect = svgElement.getBoundingClientRect();
          const x = screenPoint.x - svgRect.left;
          const y = screenPoint.y - svgRect.top;

          setPosition({ x, y });
        }
      }
    }
  }, [d, region]);

  useEffect(() => {
    if (phase === Phase.DEPLOY) {
      if (current_source === id) {
        setIsHighlighted(true);
      } else {
        setIsHighlighted(false);
      }
    } else if (phase === Phase.ATTACK || phase === Phase.FORTIFY) {
      if (current_source && current_target === null && current_source !== id) {
        const neighbors = getNeighbors(current_source);

        if (neighbors.includes(id)) setIsHighlighted(true);
        else setIsHighlighted(false);
      } else if (current_source && current_target && (current_target === id || current_source === id)) {
        setIsHighlighted(true);
      } else {
        setIsHighlighted(false);
      }
    }
  }, [current_source, phase, current_target, id]);

  return (
    <>
      {position &&
        troups !== undefined &&
        containerRef &&
        containerRef.current &&
        ReactDOM.createPortal(
          <TroopsMarker
            position={{ x: position.x, y: position.y }}
            handlePathClick={onRegionClick}
            troups={troups}
            color={color}
            tile={tile}
            playerTurn={playerTurn}
            containerRef={containerRef}
          />,

          containerRef.current // render the button directly in the body
        )}
      <defs>
        {/*<pattern id="texture" patternUnits="userSpaceOnUse" width="900" height="647">
          <image href={texture} x="0" y="0" width="900" height="647" />
        </pattern>*/}
        <mask id="pathMask">
          <path d={d} fill="blue" stroke="black" strokeWidth="10" />
        </mask>
      </defs>
      <path
        ref={pathRef}
        d={d}
        //fill={`url(#texture)`}
        fill={'white'}
        fillOpacity={1.0}
        stroke={isHilighted ? 'black' : 'gray'}
        strokeWidth="10"
        onClick={onRegionClick}
      />
      <path
        ref={pathRef}
        d={d}
        fill={isHilighted ? colorTileHighLight : colorTile}
        stroke={isHilighted ? 'black' : 'gray'}
        strokeWidth="10"
        onClick={onRegionClick}
      />
    </>
  );
};

export default Region;
