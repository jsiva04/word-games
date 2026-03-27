'use client';

import { useState, useEffect } from 'react';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function getTimeUntilMidnight() {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diff = tomorrow.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function Countdown({ label }: { label: string }) {
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    setTime(getTimeUntilMidnight());
    const interval = setInterval(() => setTime(getTimeUntilMidnight()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="countdown-label">{label}</div>
      <div className="countdown">{time}</div>
    </div>
  );
}
