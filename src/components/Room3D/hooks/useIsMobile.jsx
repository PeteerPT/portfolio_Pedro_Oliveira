import { useState, useEffect } from "react";

export default function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () =>
      typeof window !== "undefined" &&
      (/android|blackberry|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i.test(navigator.userAgent) ||
        window.innerWidth <= breakpoint);

    setIsMobile(check());

    function onResize() {
      setIsMobile(check());
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [breakpoint]);

  return isMobile;
}
