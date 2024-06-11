import React, { useEffect, useState } from 'react';
import '../styles/Bubble.css';

interface ComicBubbleProps {
  texts: string[];
  variant: string;
}

const Bubble: React.FC<ComicBubbleProps> = ({ texts, variant }) => {
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(texts.length > 0); // Show bubble if there are texts
    // Reset for a new array of texts
    setDisplayText('');
    setCharIndex(0);
    setTextIndex(0);
  }, [texts]);

  useEffect(() => {
    if (textIndex < texts.length) {
      const currentText = texts[textIndex];
      if (charIndex < currentText.length) {
        const timer = setTimeout(() => {
          setDisplayText((prev) => prev + currentText.charAt(charIndex));
          setCharIndex(charIndex + 1);
        }, 50);
        return () => clearTimeout(timer);
      } else if (textIndex < texts.length - 1) {
        // Wait for 1 second before moving to the next text
        setTimeout(() => {
          setDisplayText(''); // Clear display text for the next message
          setCharIndex(0); // Reset character index for the next message
          setTextIndex(textIndex + 1); // Move to the next message
        }, 1000); // 1-second pause
      } else if (textIndex === texts.length - 1 && charIndex === currentText.length) {
        // After the last message is fully displayed, keep it for an additional second before hiding
        setTimeout(() => {
          // Here, instead of hiding, you could set it to show a completion message or simply keep the bubble visible
          // setIsVisible(false); // Uncomment if you want to hide the bubble after the last message
        }, 1000); // Keep the last message visible for another second
      }
    }
  }, [charIndex, textIndex, texts]);

  return isVisible ? (
    <div
      className={`font-vt323 bubble ${variant} relative max-w-md p-3 border-2 border-black rounded-lg bg-white text-lg`}
    >
      {`“${displayText}”`}
    </div>
  ) : null;
};

export default Bubble;
