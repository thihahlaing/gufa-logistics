'use client';

import React, { useState } from 'react';

const BrandLogo = () => {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="brand-logo">
      {logoError ? (
        <span className="gufa-placeholder">GUFA</span>
      ) : (
        <img
          src="/gufa-logo.png"
          alt="Gufa Logistics"
          onError={() => setLogoError(true)}
        />
      )}
    </div>
  );
};

export default BrandLogo;
