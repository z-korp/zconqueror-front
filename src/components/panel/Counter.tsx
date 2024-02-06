// Counter.jsx
interface CounterProps {
  count: number;
  onDecrement: () => void;
  onIncrement: () => void;
  maxCount: number;
}

const Counter = ({ count, onDecrement, onIncrement, maxCount }: CounterProps) => {
  return (
    <div className="flex items-center justify-center my-4">
      <button onClick={onDecrement} className="px-4 py-2 bg-gray-300 rounded-l" disabled={count <= 1}>
        -
      </button>
      <div className="px-4 py-2 bg-white">{count}</div>
      <button onClick={onIncrement} className="px-4 py-2 bg-gray-300 rounded-r" disabled={count >= maxCount}>
        +
      </button>
    </div>
  );
};

export default Counter;
