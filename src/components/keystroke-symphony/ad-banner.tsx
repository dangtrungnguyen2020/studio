
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
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // TODO: Replace with your own AdSense client ID
        data-ad-slot="1234567890" // TODO: Replace with your own ad slot ID
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner;
