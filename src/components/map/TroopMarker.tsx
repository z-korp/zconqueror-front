import { FC, useEffect, useState } from 'react';
import '../../styles/Button.css';
import RoundButton from '../RoundButton';
import { Swords } from 'lucide-react';

interface TroopsMarkerProps {
  position: { x: number; y: number };
  handlePathClick: () => void;
  troups: number;
  color: string;
  tile: any;
  playerTurn: number;
  containerRef: any;
}

const TroopsMarker: FC<TroopsMarkerProps> = ({
  position,
  handlePathClick,
  troups,
  color,
  tile,
  playerTurn,
  containerRef,
}) => {
  const [markerPosition, setMarkerPosition] = useState(position);

  const [ratioElement, setRatioElement] = useState(1);
  const [containerWidthInit, setContainerWidthInit] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    const updateContainerWidth = () => {
      if (!initialized && containerRef.current) {
        // Set the initial container width when it's available
        setContainerWidthInit(containerRef.current.offsetWidth);
        setInitialized(true);
      }
    };

    // Initial setup
    updateContainerWidth();

    // Listen for window resize events
    window.addEventListener('resize', handleWindowResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [initialized]);

  // Attach event listener when the component mounts
  useEffect(() => {
    // Add the window resize event listener to ensure that component is load
    // weird hack TBD : improve but for now i'm stuck
    window.addEventListener('resize', handleWindowResize);
    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const handleWindowResize = () => {
    if (containerRef.current === null) return;
    if (ratioElement === 0) {
      setRatioElement(containerRef.current.offsetWidth);
    }

    if (containerRef.current) {
      if (containerWidthInit === null || containerWidthInit === 0) return;
      const ratio = containerRef.current.offsetWidth / containerWidthInit;
      //const { widthImgSvg, heightImgSvg } = imgRef.current.getBoundingClientRect();
      const new_y = (600 / 2 - position.y) * ratio;
      setMarkerPosition({ x: position.x * ratio, y: 300 - new_y });
      // Do something with containerWidth and containerHeight
    }
  };

  const handleSecondAction = () => {
    console.log('Deuxième action exécutée');
    setIsAnimated((currentIsAnimated) => !currentIsAnimated);
    // Votre logique pour la deuxième action ici
  };

  const handleBothActions = () => {
    handlePathClick();
    handleSecondAction();
  };

  useEffect(() => {
    // Set up a timer that toggles the `isActive` state every second
    const interval = setInterval(() => {
      setFlip((currentFlip) => !currentFlip);
    }, 2000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (troups === 0) return null;

  return (
    <>
      <div
        className="absolute"
        style={{
          top: `calc(${markerPosition.y}px - 30px)`,
          left: `calc(${markerPosition.x}px - 30px)`,
        }}
      >
        {isAnimated && (
          <div className={`blason ${flip ? 'flip' : ''}`} onClick={() => setFlip(!flip)}>
            <Swords size={60} fill="red" stroke="red"></Swords>
          </div>
        )}
      </div>
      <RoundButton
        color={color}
        onClick={handleBothActions}
        className="absolute"
        style={{
          top: `calc(${markerPosition.y}px - 15px)`,
          left: `calc(${markerPosition.x}px - 15px)`,
        }}
        shouldJump={tile.owner === playerTurn ? true : false}
      >
        <span className="text-lg text-white text-with-outline" data-text={troups}>
          {troups}
        </span>
      </RoundButton>
    </>
  );
};

export default TroopsMarker;
