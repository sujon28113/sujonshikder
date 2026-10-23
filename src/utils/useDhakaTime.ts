import { useState, useEffect } from 'react';

export function useDhakaTime() {
  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });

      setTimeString(timeFormatter.format(now));
      setDateString(dateFormatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return { timeString, dateString };
}
