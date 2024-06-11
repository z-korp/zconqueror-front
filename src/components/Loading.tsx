interface LoadingProps {
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text }) => {
  return (
    <h1 className="mt-4 text-white text-6xl">
      {text || 'Loading'}
      <span className="inline-block animate-jump delay-100">.</span>
      <span className="inline-block animate-jump delay-200">.</span>
      <span className="inline-block animate-jump delay-300">.</span>
    </h1>
  );
};

export default Loading;
