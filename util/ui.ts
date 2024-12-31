import { useEffect } from "react";
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