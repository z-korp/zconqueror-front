import React, { useEffect, useState } from 'react';

interface ContinentProps {
  isVisible: boolean;
  svgPath: string;
}

interface PathData {
  d: string;
  fill: string;
}

const Continent: React.FC<ContinentProps> = ({ isVisible, svgPath }) => {
  const [paths, setPaths] = useState<PathData[]>([]);

  useEffect(() => {
    fetch(svgPath)
      .then((response) => response.text())
      .then((svg) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(svg, 'image/svg+xml');
        const pathsElements = xmlDoc.getElementsByTagName('path');
        const pathsData: PathData[] = [];

        for (let i = 0; i < pathsElements.length; i++) {
          const pathElement = pathsElements[i];
          pathsData.push({
            d: pathElement.getAttribute('d') || '',
            fill: pathElement.getAttribute('fill') || 'none',
          });
        }

        setPaths(pathsData);
      })
      .catch((error) => console.error('Error fetching SVG:', error));
  }, [svgPath]);

  if (!isVisible) return null;

  return (
    <svg>
      {paths.map((path, index) => (
        <path key={index} d={path.d} fill={path.fill} />
      ))}
    </svg>
  );
};

export default Continent;
