import React, { useEffect, useState } from 'react';
import '../styles/Bubble.css';

interface ComicBubbleProps {
  text: string;
}

const Bubble: React.FC<ComicBubbleProps> = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Reset everything when text changes
    setDisplayText('');
    setIndex(0);
    setIsVisible(text !== ''); // Only show bubble if text is not empty
  }, [text]); // This effect runs every time `text` changes

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, 50); // Adjust speed as needed
      return () => clearTimeout(timer);
    }
  }, [index, text]);

  // Only render the bubble if isVisible is true
  return isVisible ? (
    <div className="vt323-font bubble speech relative max-w-md p-3 border-2 border-black rounded-lg bg-white text-lg">
      {displayText}
    </div>
  ) : null;
};

export default Bubble;
