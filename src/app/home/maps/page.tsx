"use client";

import Map from '@/components/map/map';
import { useEffect } from "react";

const Home: React.FC = () => {
  useEffect(() => {
    const preventZoom = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };

    const preventTouchZoom = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    document.addEventListener("wheel", preventZoom, { passive: false });
    document.addEventListener("touchmove", preventTouchZoom, { passive: false });

    return () => {
      document.removeEventListener("wheel", preventZoom);
      document.removeEventListener("touchmove", preventTouchZoom);
    };
  }, []);
  return (
<Map />
  );
};

export default Home;
