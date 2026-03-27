'use client';

import { useState, useEffect } from 'react';
import { Toast as ToastType } from '@/hooks/useToast';

function ToastItem({ toast }: { toast: ToastType }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFading(true), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration]);

  return (
    <div className={`toast${fading ? ' fade-out' : ''}`}>
      {toast.message}
    </div>
  );
}

export function ToastContainer({ toasts }: { toasts: ToastType[] }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
