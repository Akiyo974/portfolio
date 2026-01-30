import { useState, useEffect } from 'react';

/**
 * Custom hook that returns the current local time in HH:MM format
 * Updates every second to keep time synchronized
 * @returns Current local time string in 'HH:MM' format
 * @example
 * const time = useLocalTime(); // '14:30'
 */
export const useLocalTime = () => {
  const [time, setTime] = useState(getFormattedTime());

  function getFormattedTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getFormattedTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return time;
};