// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // scroll to the top-left whenever the path changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
