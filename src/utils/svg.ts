import { Point } from './types';

export function transformPointFromSVGToScreen(svgElement: SVGSVGElement, point: Point) {
  const svgPoint = svgElement.createSVGPoint();
  svgPoint.x = point.x;
  svgPoint.y = point.y;

  const ctm = svgElement.getScreenCTM();
  if (!ctm) {
    console.error('Unable to transform point from SVG to screen coordinates: getScreenCTM() returned null.');
    return null;
  }

  const screenPoint = svgPoint.matrixTransform(ctm);

  return {
    x: screenPoint.x,
    y: screenPoint.y,
  };
}

export function calculateCentroidFromPath(d: string): Point {
  const commands = d.split(/(?=[LHM])/);
  const points: Point[] = [];
  let lastY = 0; // Last Y coordinate for handling "H" commands

  let point;
  commands.forEach((command: any) => {
    const type = command[0];
    const args = command
      .slice(1)
      .trim()
      .split(/\s*,\s*|\s+/);
    switch (type) {
      case 'M':
      case 'L':
        point = { x: parseFloat(args[0]), y: parseFloat(args[1]) };
        points.push(point);
        lastY = point.y;
        break;
      case 'H':
        points.push({ x: parseFloat(args[0]), y: lastY });
        break;
    }
  });

  let cx = 0,
    cy = 0,
    a = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const xi = points[i].x,
      yi = points[i].y;
    const xi1 = points[i + 1].x,
      yi1 = points[i + 1].y;
    const cross = xi * yi1 - xi1 * yi;
    cx += (xi + xi1) * cross;
    cy += (yi + yi1) * cross;
    a += cross;
  }

  // Close the polygon if it's not already closed
  if (points[0].x !== points[points.length - 1].x || points[0].y !== points[points.length - 1].y) {
    const xi = points[points.length - 1].x,
      yi = points[points.length - 1].y;
    const xi1 = points[0].x,
      yi1 = points[0].y;
    const cross = xi * yi1 - xi1 * yi;
    cx += (xi + xi1) * cross;
    cy += (yi + yi1) * cross;
    a += cross;
  }

  a /= 2;
  cx /= 6 * a;
  cy /= 6 * a;

  return { x: cx, y: cy };
}
