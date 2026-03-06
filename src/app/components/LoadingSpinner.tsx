'use client';

import type { CSSProperties } from 'react';

const LoadingSpinner = ({ size = 24, color = '#fff' }) => {
  const style: CSSProperties = {
    width: size,
    height: size,
    border: `3px solid ${color}`,
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div style={style}></div>
    </>
  );
};

export default LoadingSpinner;
