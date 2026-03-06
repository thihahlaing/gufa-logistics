'use client';

import { useLoadScript } from '@react-google-maps/api';
import { ReactNode } from 'react';

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export default function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const {
    isLoaded,
    loadError,
  } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return <>{children}</>;
}
