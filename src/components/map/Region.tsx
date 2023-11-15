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
  isSelected: boolean; // Ajout de cette propriété
}

const Region: React.FC<RegionProps> = ({
  d,
  fillOpacity,
  id,
  region,
  containerRef,
  onRegionClick,
  isSelected,
}: RegionProps) => {
  const {
    setup: {
      components: { Tile, Player },
      systemCalls: { supply },
    },
    account: { account },
  } = useDojo();
  const { ip, current_state, current_source, current_target } = useElementStore((state) => state);

  const [isHilighted, setIsHighlighted] = useState(false);
  const { tileIds, currentPlayerId } = useComponentStates();

  const tile = useComponentValue(Tile, tileIds[id - 1]);

  const troups = tile ? tile.army : 0;
  const color = tile ? colorPlayer[tile.owner + 1 || 0] : 'white';

  const [position, setPosition] = useState<{ x: number; y: number }>();
  const pathRef = useRef<SVGPathElement>(null);

  const [modalOpen, setModalOpen] = useState(true);
  const strokeColor = isSelected ? color : 'black'; // Remplacez avec les couleurs désirées

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
    if (current_source && current_target === null && current_source !== id && current_state === Phase.ATTACK) {
      const neighbors = getNeighbors(current_source);
      if (neighbors.includes(id + 1)) setIsHighlighted(true);
      else setIsHighlighted(false);
    } else {
      setIsHighlighted(false);
    }
  }, [current_source, current_state, current_target, id]);

  return (
    <>
      {position &&
        troups !== undefined &&
        containerRef &&
        containerRef.current &&
        ReactDOM.createPortal(
          <TroopsMarker position={position} handlePathClick={onRegionClick} troups={troups} color={color} />,

          containerRef.current // render the button directly in the body
        )}

      {isTest &&
        position &&
        troups !== undefined &&
        containerRef &&
        containerRef.current &&
        ReactDOM.createPortal(
          <TroopsMarker
            position={{ x: position.x + 20, y: position.y }}
            handlePathClick={onRegionClick}
            troups={id}
            color={'pink'}
          />,

          containerRef.current // render the button directly in the body
        )}

      <path
        ref={pathRef}
        d={d}
        fill={color}
        fillOpacity={fillOpacity}
        stroke={isHilighted ? 'yellow' : strokeColor} // Utilisez strokeColor pour la couleur du contour
        strokeWidth="10" // adjust this value for the desired thickness
        onClick={onRegionClick}
      />
    </>
  );
};

export default Region;
