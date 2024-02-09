import { useGetTiles } from '@/hooks/useGetTiles';
import { usePhase } from '@/hooks/usePhase';
import { colorPlayer, colorTilePlayer } from '@/utils/colors';
import { getNeighbors } from '@/utils/map';
import { Phase, useElementStore } from '@/utils/store';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import texture from '../../../public/texture_white.png';
import TroopsMarker from './TroopMarker';

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

  const [position, setPosition] = useState<{ x: number; y: number }>();
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (path) {
      const bbox = path.getBBox();
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;

      const svgElement = path.ownerSVGElement;
      if (svgElement) {
        const point = svgElement.createSVGPoint();
        point.x = cx;
        point.y = cy;
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
  }, [region]);

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
        <pattern id="texture" patternUnits="userSpaceOnUse" width="900" height="647">
          <image href={texture} x="0" y="0" width="900" height="647" />
        </pattern>
        <mask id="pathMask">
          <path d={d} fill="blue" stroke="black" strokeWidth="10" />
        </mask>
      </defs>
      <path
        ref={pathRef}
        d={d}
        fill={`url(#texture)`}
        fillOpacity={1.0}
        stroke={isHilighted ? 'black' : 'gray'}
        strokeWidth="10"
        onClick={onRegionClick}
      />
      <path
        ref={pathRef}
        d={d}
        fill={colorTile}
        fillOpacity={isHilighted ? 0.9 : 0.6}
        stroke={isHilighted ? 'black' : 'gray'}
        strokeWidth="10"
        onClick={onRegionClick}
      />
    </>
  );
};

export default Region;
