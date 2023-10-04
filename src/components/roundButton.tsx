import { CSSProperties, FC, ReactNode } from 'react';

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
  const colorClasses: any = {
    red: 'bg-red-500 border-red-700',
    blue: 'bg-blue-500 border-blue-700',
    green: 'bg-green-500 border-green-700',
    yellow: 'bg-yellow-500 border-yellow-700',
    purple: 'bg-purple-500 border-purple-700',
    pink: 'bg-pink-500 border-pink-700',
    orange: 'bg-orange-500 border-orange-700',
    cyan: 'bg-cyan-500 border-cyan-700',
    indigo: 'bg-indigo-500 border-indigo-700',
    teal: 'bg-teal-500 border-teal-700',
  };

  const selectedColorClass = colorClasses[color] || ''; // Fallback to an empty string if color is not found

  return (
    <div
      className={`flex justify-center items-center cursor-pointer ${selectedColorClass} border-2 border-${color}-700 rounded-full w-8 h-8 ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default RoundButton;
