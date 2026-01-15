import { useEffect, useState } from "react";
import React from 'react';

export const focusHandler = (
  ref: React.RefObject<HTMLDivElement | null>,
  handler: () => void
) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClick);

    return (() => {
      document.removeEventListener('mousedown', handleClick);
    });
  }, [ref]);
};

export const useScrollPos = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const updatePos = () => {
            setScrollPosition(window.scrollY);
        }

        window.addEventListener('scroll', updatePos);

        updatePos();

        return () => window.removeEventListener('scroll', updatePos);
    });

    return scrollPosition;
}