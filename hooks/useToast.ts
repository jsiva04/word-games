'use client';

import { useState, useCallback } from 'react';

export interface Toast {
  id: number;
  message: string;
  duration: number;
}

let nextId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, duration = 1500) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration + 350);
  }, []);

  return { toasts, showToast };
}
