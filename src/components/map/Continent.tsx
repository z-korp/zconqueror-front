import React, { useEffect, useState } from 'react';
import { Continent as ContinentType } from '@/utils/types';
import ReactDOM from 'react-dom';
import ContinentMarker from './ContinentMarker';
import { calculateCentroidFromPath, transformPointFromSVGToScreen } from '@/utils/svg';
import { useElementStore } from '@/utils/store';

interface ContinentProps {
  continent: ContinentType;
  isVisible: boolean;
  svgPath: string;
  containerRef?: React.MutableRefObject<null>;
}

interface PathData {
  d: string;
  fill: string;
}

const Continent: React.FC<ContinentProps> = ({ continent, isVisible, svgPath, containerRef }) => {
  const { isContinentMode } = useElementStore((state) => state);

  const [centerPoint, setCenterPoint] = useState<{ x: number; y: number }>();
  const [paths, setPaths] = useState<PathData[]>([]);
  const [colorContinent, setColorContinent] = useState('');

  useEffect(() => {
    fetch(svgPath)
      .then((response) => response.text())
      .then((svg) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(svg, 'image/svg+xml');
        const pathsElements = xmlDoc.getElementsByTagName('path');

        const pathsData: PathData[] = [];
        const combinedCentroid = { x: 0, y: 0 };
        let validPathCount = 0;

        for (let i = 0; i < pathsElements.length; i++) {
          const pathElement = pathsElements[i];
          const pathD = pathElement.getAttribute('d') || '';
          pathsData.push({
            d: pathD,
            fill: pathElement.getAttribute('fill') || 'none',
          });
          setColorContinent(pathElement.getAttribute('fill') || 'white');

          const centroid = calculateCentroidFromPath(pathD);
          if (centroid) {
            combinedCentroid.x += centroid.x;
            combinedCentroid.y += centroid.y;
            validPathCount++;
          }
        }

        if (validPathCount > 0) {
          combinedCentroid.x /= validPathCount;
          combinedCentroid.y /= validPathCount;
        }

        setPaths(pathsData);

        // Now you have combinedCentroid which you can use similar to how you use centroid in Region component
        const svgElement = document.getElementById('map-svg') as SVGSVGElement | null;
        if (svgElement) {
          const pointInScreenFrame = transformPointFromSVGToScreen(svgElement, combinedCentroid);
          if (pointInScreenFrame) {
            const svgRect = svgElement.getBoundingClientRect();
            const x = pointInScreenFrame.x - svgRect.left;
            const y = pointInScreenFrame.y - svgRect.top;
            setCenterPoint({ x, y });
          }
        }
      })
      .catch((error) => console.error('Error fetching SVG:', error));
  }, [continent.id, svgPath]);

  if (!isVisible) return null;

  return (
    <svg id={`continent-${continent.id}`}>
      {containerRef &&
        containerRef.current &&
        centerPoint &&
        isContinentMode &&
        ReactDOM.createPortal(
          <ContinentMarker
            position={{ x: centerPoint.x, y: centerPoint.y }}
            handlePathClick={() => console.log('clicked')}
            supply={continent.supply}
            color={colorContinent}
            containerRef={containerRef}
            name={continent.name}
          />,

          containerRef.current // render the button directly in the body
        )}
      {paths.map((path, index) => (
        <path key={index} d={path.d} fill={path.fill} />
      ))}
    </svg>
  );
};

export default Continent;
