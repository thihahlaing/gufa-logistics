'use client';

interface WalletProps {
  balance: number | null;
  loading: boolean;
}

export default function Wallet({ balance, loading }: WalletProps) {
  if (loading) {
    return (
      <div className="p-4 border rounded-lg animate-pulse">
        <h2 className="text-lg font-semibold">My Wallet</h2>
        <p className="text-gray-400">Loading balance...</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold">My Wallet</h2>
      <p className="text-2xl font-bold">
        ${typeof balance === 'number' ? balance.toFixed(2) : '0.00'}
      </p>
    </div>
  );
}
