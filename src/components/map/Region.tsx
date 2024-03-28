import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import TroopsMarker from './TroopMarker';
import { useGetTiles } from '@/hooks/useGetTiles';
import { usePhase } from '@/hooks/usePhase';
import { useTurn } from '@/hooks/useTurn';
import { Phase, useElementStore } from '@/utils/store';
import { colorPlayer } from '@/utils/colors';
import { colorTilePlayer, colorTilePlayerHighlight } from '@/utils/customColors';
import { getAllConnectedTiles, getNeighbors } from '@/utils/map';
import { calculateCentroidFromPath, transformPointFromSVGToScreen } from '@/utils/svg';

interface RegionProps {
  id: number;
  containerRef?: React.MutableRefObject<null>;
  onRegionClick: () => void;
}

const Region: React.FC<RegionProps> = ({ id, containerRef, onRegionClick }) => {
  const { phase } = usePhase();
  const { turn } = useTurn();
  const { current_source, current_target, highlighted_region, isContinentMode } = useElementStore((state) => state);

  const [isHilighted, setIsHighlighted] = useState(false);
  const [hilightedColor, setHilightedColor] = useState('yellow');
  const { tiles } = useGetTiles();

  const tile = tiles[id - 1];
  const tileArmy = tile ? tile.army : 0;

  const color = tile ? colorPlayer[tile.owner + 1 || 0] : 'white';
  const colorTile = tile ? colorTilePlayer[tile.owner + 1 || 0] : 'white';
  const colorTileHighLight = tile ? colorTilePlayerHighlight[tile.owner + 1 || 0] : 'white';

  const [position, setPosition] = useState<{ x: number; y: number }>();

  const [pathData, setPathData] = useState('');
  const [colorContinent, setColorContinent] = useState('');
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const filePath = `/svgs/regions/${id}.svg`;
    fetch(filePath)
      .then((response) => response.text())
      .then((svg) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(svg, 'image/svg+xml');
        const path = xmlDoc.getElementsByTagName('path')[0];
        if (path) {
          setPathData(path.getAttribute('d') || '');
          setColorContinent(path.getAttribute('fill') || 'white');
        }
      })
      .catch((error) => console.error('Error fetching SVG:', error));
  }, [id]);

  useEffect(() => {
    const path = pathRef.current;
    if (path && pathData) {
      const centroid = calculateCentroidFromPath(pathData);

      const svgElement = path.ownerSVGElement;
      if (svgElement) {
        const pointInScreenFrame = transformPointFromSVGToScreen(svgElement, centroid);
        if (pointInScreenFrame !== null) {
          // Adjust for the SVG's position in the viewport
          const svgRect = svgElement.getBoundingClientRect();
          const x = pointInScreenFrame.x - svgRect.left;
          const y = pointInScreenFrame.y - svgRect.top;
          setPosition({ x, y });
        }
      }
    }
  }, [pathData]);

  const highlightConnectedTiles = () => {
    const connectedTiles = getAllConnectedTiles(current_source, tiles, turn); // Cette fonction doit être implémentée
    return connectedTiles.includes(id);
  };

  useEffect(() => {
    const isSourceTile = current_source === id;
    const isTargetTile = current_target === id;
    let highlightColor = '';
    let shouldHighlight = false;

    if (phase === Phase.DEPLOY) {
      if (current_source === id) {
        setHilightedColor('black');
        setIsHighlighted(true);
      } else {
        setIsHighlighted(false);
      }
    } else if (phase === Phase.ATTACK || phase === Phase.FORTIFY) {
      if (current_source !== null && current_target === null) {
        const neighbors = getNeighbors(current_source);
        const isNeighborTile = neighbors.includes(id);
        const isConnectedTile = highlightConnectedTiles(); // Appel de la fonction pour vérifier si la case est connectée
        if (isSourceTile) {
          shouldHighlight = true;
          highlightColor = 'yellow';
        } else if (
          (isNeighborTile && phase === Phase.ATTACK && tile.owner !== turn) ||
          (isConnectedTile && phase === Phase.FORTIFY)
        ) {
          // Pour Phase.FORTIFY, utilise isConnectedTile pour mettre en avant toutes les cases connectées
          shouldHighlight = true;
          highlightColor = 'black'; // Ou toute autre couleur représentative pour les cases connectées
        }
      } else if (isTargetTile || isSourceTile) {
        shouldHighlight = true;
        highlightColor = 'black';
      }
    }

    setIsHighlighted(shouldHighlight);
    if (shouldHighlight) {
      setHilightedColor(highlightColor);
    }
  }, [current_source, phase, current_target, id, tile, turn, tiles]);

  const isLogHighlighted = highlighted_region === id;

  const determineFillColor = (
    isContinentMode: boolean,
    isHighlighted: boolean,
    hilightedColor: string,
    isLogHighlighted: boolean,
    colorTileHighLight: string,
    colorTile: string
  ) => {
    if (isContinentMode) {
      return colorContinent;
    } else if (isHighlighted) {
      return hilightedColor === 'black' ? colorTileHighLight : hilightedColor;
    } else if (isLogHighlighted) {
      return 'yellow';
    } else {
      return colorTile;
    }
  };

  return (
    <>
      {isContinentMode === false &&
        position &&
        containerRef &&
        containerRef.current &&
        ReactDOM.createPortal(
          <TroopsMarker
            position={{ x: position.x, y: position.y }}
            handlePathClick={onRegionClick}
            troups={tileArmy}
            color={color}
            tile={tile}
            containerRef={containerRef}
          />,

          containerRef.current // render the button directly in the body
        )}
      <path
        ref={pathRef}
        d={pathData}
        fill={determineFillColor(
          isContinentMode,
          isHilighted,
          hilightedColor,
          isLogHighlighted,
          colorTileHighLight,
          colorTile
        )}
        fillOpacity={1.0}
        stroke={isContinentMode ? 'rgb(107 114 128)' : 'black'}
        strokeWidth="2"
      />
    </>
  );
};

export default Region;
