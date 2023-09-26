import { CSSProperties, FC, ReactNode } from "react";

interface RoundButtonProps {
  color: string;
  onClick?: () => void;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

const RoundButton: FC<RoundButtonProps> = ({
  color,
  onClick,
  children,
  style,
  className,
}) => {
  return (
    <div
      className={`flex justify-center items-center cursor-pointer bg-${color}-500 border-2 border-${color}-700 rounded-full w-8 h-8 ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default RoundButton;
