import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import TroopsMarker from "./troopmarker";
import Modal from "react-modal";

interface RegionProps {
  d: string;
  fill: string;
  fillOpacity: number;
  region: string;
  troups?: number;
  containerRef?: React.MutableRefObject<null>;
}

const Region: React.FC<RegionProps> = ({
  d,
  fill,
  fillOpacity,
  region,
  troups,
  containerRef,
}: RegionProps) => {
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

  const handlePathClick = () => {
    console.log(`Clicked on region ${region}`);
    console.log(`Troups: ${troups}`);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      {position &&
        troups &&
        containerRef &&
        containerRef.current &&
        ReactDOM.createPortal(
          <TroopsMarker
            position={position}
            handlePathClick={handlePathClick}
            troups={troups}
          />,

          containerRef.current // render the button directly in the body
        )}
      <path
        ref={pathRef}
        d={d}
        fill={fill}
        fillOpacity={fillOpacity}
        onClick={handlePathClick}
      ></path>
      {modalVisible && (
        <Modal
          isOpen={modalVisible}
          onRequestClose={handleModalClose}
          className="modal-content w-96 h-96"
        >
          <div>
            {" "}
            You are in the region {region} and you have {troups} troups
          </div>
        </Modal>
      )}
    </>
  );
};

export default Region;
