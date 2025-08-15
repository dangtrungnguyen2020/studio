
"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

const AdBanner = () => {
  useEffect(() => {
    const timeout = setTimeout(() => {
        try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
        console.error(err);
        }
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex justify-center my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7533423449746957"
        data-ad-slot="1234567890" 
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner;
