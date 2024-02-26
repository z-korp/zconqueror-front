import React, { useEffect, useState, Fragment } from 'react';

interface SvgProps {
  svgPath: string;
}

interface PathData {
  d: string;
  fill: string;
}

const Svg: React.FC<SvgProps> = ({ svgPath }) => {
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

  return (
    <svg>
      {paths.map((path, index) => (
        <Fragment key={index}>
          <path d={path.d} fill={path.fill} />
        </Fragment>
      ))}
    </svg>
  );
};

export default Svg;
