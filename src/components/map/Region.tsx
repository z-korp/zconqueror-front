import { useDojo } from '@/DojoContext';
import { useComponentStates } from '@/hooks/useComponentState';
import { colorPlayer } from '@/utils/colors';
import { useElementStore } from '@/utils/store';
import { useComponentValue } from '@dojoengine/react';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Button } from '../ui/button';
import TroopsMarker from './TroopMarker';
import { Slider } from '../ui/slider';

interface RegionProps {
  d: string;
  fillOpacity: number;
  id: number;
  region: string;
  troups?: number;
  containerRef?: React.MutableRefObject<null>;
}

const Region: React.FC<RegionProps> = ({
  d,
  fillOpacity,
  id,
  region,
  containerRef,
}: RegionProps) => {
  const {
    setup: {
      components: { Tile, Player },
      systemCalls: { supply },
    },
    account: { account },
  } = useDojo();
  const { ip } = useElementStore((state) => state);
  const { turn, playerIds, tileIds, currentPlayerId, players } =
    useComponentStates();

  const tile = useComponentValue(Tile, tileIds[id - 1]);
  const player = useComponentValue(Player, currentPlayerId);
  const troups = tile ? tile.army : 0;
  const color = tile ? colorPlayer[tile.owner + 1 || 0] : 'white';

  const [position, setPosition] = useState<{ x: number; y: number }>();
  const pathRef = useRef<SVGPathElement>(null);

  const [modalVisible, setModalVisible] = useState(false);

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

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const [troopsToDeploy, setTroopsToDeploy] = useState(0);

  const handleSupply = () => {
    console.log(player.supply, troopsToDeploy);
    if (!ip) return;
    if (player.supply < troopsToDeploy) {
      //todo put toast here
      alert('Not enough supply');
      return;
    }
    supply(account, ip.toString(), id, troopsToDeploy);
  };

  const handlePathClick = () => {
    setModalVisible(true);
  };

  return (
    <>
      {position &&
        troups !== undefined &&
        containerRef &&
        containerRef.current &&
        ReactDOM.createPortal(
          <TroopsMarker
            position={position}
            handlePathClick={handlePathClick}
            troups={troups}
            color={color}
          />,

          containerRef.current // render the button directly in the body
        )}
      <path
        ref={pathRef}
        d={d}
        fill={color}
        fillOpacity={fillOpacity}
        stroke="black"
        strokeWidth="10" // adjust this value for the desired thickness
        onClick={handlePathClick}
      ></path>
      {modalVisible && (
        <Modal
          isOpen={modalVisible}
          onRequestClose={handleModalClose}
          className="modal-base w-96 h-96"
          ariaHideApp={false}
        >
          <div>
            You are in the tile {id} region {region} and you have {troups}{' '}
            troups
          </div>

          <Slider
            min={0}
            step={1}
            max={player.supply}
            value={[troopsToDeploy]}
            onValueChange={(values) => setTroopsToDeploy(values[0])}
          />

          <Button onClick={handleSupply}>Deploy troups</Button>
        </Modal>
      )}
    </>
  );
};

export default Region;
