import { useAccount } from '@starknet-react/core';
import Connect from './Connect';

const OverlayConnection = () => {
  const { account } = useAccount();

  if (account) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[1000]"
      style={{
        background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
      }}
    >
      <div className="relative flex flex-col items-center max-w-[760px] w-4/5 h-[350px] rounded-lg border-2 border-stone-900 p-16 z-[1001] vt323-font bg-stone-600 text-white justify-center">
        <p className="text-xl mb-2">Connect to get started.</p>
        <Connect />
      </div>
    </div>
  );
};

export default OverlayConnection;
