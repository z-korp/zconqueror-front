import { CSSProperties, FC, ReactNode, useEffect, useRef, useState } from 'react';
import '../styles/Button.css';

interface RoundButtonProps {
  color: string;
  onClick?: () => void;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  shouldJump?: boolean;
}

const RoundButton: FC<RoundButtonProps> = ({ color, onClick, children, style, className, shouldJump }) => {
  const buttonRef = useRef(null);

  const [jumping, setJumping] = useState(false);

  useEffect(() => {
    let interval: any;

    if (shouldJump) {
      interval = setInterval(() => {
        setJumping((prevJumping) => !prevJumping);
      }, 1200); // ajustez la fréquence du saut
    } else {
      setJumping(false);
    }

    return () => clearInterval(interval);
  }, [shouldJump]);

  const colorClasses: any = {
    red: 'bg-customRed-500 border-customRed-700',
    blue: 'bg-customBlue-500 border-customBlue-700',
    green: 'bg-customGreen-500 border-customGreen-700',
    yellow: 'bg-customYellow-500 border-customYellow-700',
    purple: 'bg-customPurple-500 border-customPurple-700',
    pink: 'bg-customPink-500 border-customPink-700',
    orange: 'bg-customOrange-500 border-customOrange-700',
    cyan: 'bg-customCyan-500 border-customCyan-700',
    indigo: 'bg-customIndigo-500 border-customIndigo-700',
    teal: 'bg-customTeal-500 border-customTeal-700',
  };

  const selectedColorClass = colorClasses[color] || ''; // Fallback to an empty string if color is not found

  return (
    <div
      ref={buttonRef}
      className={`flex justify-center items-center cursor-pointer drop-shadow-lg ${selectedColorClass} ${
        jumping ? 'animate-jump' : ''
      } border rounded-full w-8 h-7 ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default RoundButton;
