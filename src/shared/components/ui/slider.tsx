import { cn } from "@/src/shared/lib/utils";
import { InputHTMLAttributes, forwardRef, useEffect, useState } from "react";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label?: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  showLabels?: boolean;
  error?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(({
  className,
  label,
  min,
  max,
  value,
  onChange,
  step = 1,
  showLabels = true,
  error,
  ...props
}, ref) => {
  const [localMin, setLocalMin] = useState(value[0]);
  const [localMax, setLocalMax] = useState(value[1]);

  useEffect(() => {
    setLocalMin(value[0]);
    setLocalMax(value[1]);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), localMax - step);
    setLocalMin(newMin);
    onChange([newMin, localMax]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), localMin + step);
    setLocalMax(newMax);
    onChange([localMin, newMax]);
  };

  const minPercent = ((localMin - min) / (max - min)) * 100;
  const maxPercent = ((localMax - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="space-y-4">
        {showLabels && (
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="font-medium">Min: {localMin.toLocaleString()} IQD</span>
            <span className="font-medium">Max: {localMax.toLocaleString()} IQD</span>
          </div>
        )}
        <div className="relative h-2">
          <div className="absolute w-full h-2 bg-gray-200 rounded-lg"></div>
          <div
            className="absolute h-2 bg-blue-600 rounded-lg"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`
            }}
          ></div>
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            value={localMin}
            onChange={handleMinChange}
            step={step}
            className={cn(
              "absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10",
              "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md",
              "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md",
              className
            )}
            style={{ zIndex: localMin > localMax - (max - min) * 0.05 ? 20 : 10 }}
            {...props}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={localMax}
            onChange={handleMaxChange}
            step={step}
            className={cn(
              "absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10",
              "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md",
              "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
            )}
            style={{ zIndex: 20 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{min.toLocaleString()}</span>
          <span>{max.toLocaleString()}</span>
        </div>
      </div>
      {error && (
        <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
});

Slider.displayName = "Slider";

