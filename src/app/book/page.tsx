'use client';

import Booking from '@/components/Booking';
import Link from 'next/link';

export default function BookPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 gap-8">
      <div className="w-full max-w-lg">
        <Link href="/" className="text-sm text-gray-400 hover:text-white mb-6 block">
          &larr; Back to Dashboard
        </Link>
        <Booking />
      </div>
    </main>
  );
}
