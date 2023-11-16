import { useDojo } from '@/DojoContext';
import { useComponentStates } from '@/hooks/useComponentState';
import { colorPlayer } from '@/utils/colors';
import { getNeighbors } from '@/utils/map';
import { Phase, useElementStore } from '@/utils/store';
import { isTest } from '@/utils/test';
import { useComponentValue } from '@dojoengine/react';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import TroopsMarker from './TroopMarker';

interface RegionProps {
  d: string;
  fillOpacity: number;
  id: number;
  region: string;
  troups?: number;
  containerRef?: React.MutableRefObject<null>;
  onRegionClick: () => void;
}

const Region: React.FC<RegionProps> = ({ d, id, region, containerRef, onRegionClick }: RegionProps) => {
  const {
    setup: {
      components: { Tile },
    },
  } = useDojo();
  const { current_state, current_source, current_target } = useElementStore((state) => state);

  const [isHilighted, setIsHighlighted] = useState(false);
  const { tileIds } = useComponentStates();

  const tile = useComponentValue(Tile, tileIds[id - 1]);

  const troups = tile ? tile.army : 0;
  const color = tile ? colorPlayer[tile.owner + 1 || 0] : 'white';

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
    if (current_state === Phase.DEPLOY) {
      if (current_source === id) {
        setIsHighlighted(true);
      } else {
        setIsHighlighted(false);
      }
    } else if (current_state === Phase.ATTACK || current_state === Phase.FORTIFY) {
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
  }, [current_source, current_state, current_target, id]);

  return (
    <>
      {isTest &&
        position &&
        troups !== undefined &&
        containerRef &&
        containerRef.current &&
        ReactDOM.createPortal(
          <TroopsMarker
            position={{ x: position.x, y: position.y }}
            handlePathClick={onRegionClick}
            troups={id}
            color={'pink'}
          />,

          containerRef.current // render the button directly in the body
        )}

      {position &&
        troups !== undefined &&
        containerRef &&
        containerRef.current &&
        ReactDOM.createPortal(
          <TroopsMarker position={position} handlePathClick={onRegionClick} troups={troups} color={color} />,

          containerRef.current // render the button directly in the body
        )}

      <path
        ref={pathRef}
        d={d}
        fill={color}
        fillOpacity={isHilighted ? 0.7 : 0.4}
        stroke={isHilighted ? 'yellow' : 'black'}
        strokeWidth="10"
        onClick={onRegionClick}
      />
    </>
  );
};

export default Region;
