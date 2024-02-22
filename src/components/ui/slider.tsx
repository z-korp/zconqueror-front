'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from './button';
export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { onChange?: (value: number[]) => void }
>(({ className, min = 0, max = 100, value: propValue, onValueChange, color = 'green', ...props }, ref) => {
  const colorClasses: any = {
    green: {
      base: 'bg-green-500',
      hover: 'hover:bg-green-700',
    },
    red: {
      base: 'bg-red-500',
      hover: 'hover:bg-red-700',
    },
  };

  const [value, setValue] = React.useState(propValue || [min]);

  // Add useEffect here to update internal state when propValue changes
  React.useEffect(() => {
    setValue(propValue || [min]);
  }, [propValue, min]);

  const handleMinClick = () => {
    handleValueChange([min]);
  };

  const handleMaxClick = () => {
    handleValueChange([max]);
  };

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className="flex items-center">
      <Button
        onClick={handleMinClick}
        className={`mx-2 py-1 w-8 ${colorClasses[color].base} text-white rounded ${colorClasses[color].hover} transition-colors duration-200 drop-shadow-lg`}
      >
        {min}
      </Button>
      <SliderPrimitive.Root
        ref={ref}
        min={min}
        max={max}
        step={1}
        value={value || [min]}
        onValueChange={handleValueChange}
        className={cn('relative flex w-full touch-none select-none items-center my-7 h-10', className)}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative">
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-1 bg-white rounded-full border border-gray-300">
            {value ? value[0] : 0}
          </div>
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
      <Button
        onClick={handleMaxClick}
        className={` w-8  py-1 mx-2 text-center ${colorClasses[color].base} text-white rounded ${colorClasses[color].hover} transition-colors duration-200 drop-shadow-lg`}
      >
        {max}
      </Button>
    </div>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;
