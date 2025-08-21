"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

const AdBanner = (props: { className: string }) => {
  // Use a ref to get a reference to the DOM element
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the ref exists and the element has a width greater than 0
    if (adContainerRef.current && adContainerRef.current.offsetWidth > 0) {
      // Push the ad code if the ad container has a valid width.
      console.log(
        `check ads container size: ${adContainerRef.current.offsetWidth} x ${adContainerRef.current.offsetHeight}`
      );
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  return (
    <div
      // Attach the ref to the div
      ref={adContainerRef}
      className={cn("flex justify-center my-4", props.className)}
    >
      <ins
        className="adsbygoogle flex-1"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7533423449746957"
        data-ad-slot="5440592927"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner;
