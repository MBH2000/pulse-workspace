import React, { useEffect, useState } from 'react';
import { RotateCcw, X } from 'lucide-react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  durationMs?: number;
}

export const UndoToast: React.FC<UndoToastProps> = ({
  message,
  onUndo,
  onDismiss,
  durationMs = 5000,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setProgress(remaining);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [durationMs, onDismiss]);

  return (
    <div className="undo-toast">
      <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>
        {message}
      </span>

      <button
        onClick={onUndo}
        className="btn btn-primary"
        style={{ padding: '4px 10px', fontSize: '12px', gap: '6px' }}
      >
        <RotateCcw size={13} />
        <span>Undo</span>
      </button>

      <button
        onClick={onDismiss}
        className="btn btn-ghost"
        style={{ padding: '4px', color: 'var(--text-muted)' }}
      >
        <X size={14} />
      </button>

      {/* Countdown progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '3px',
        background: 'var(--color-primary)',
        width: `${progress}%`,
        borderRadius: '0 0 8px 8px',
        transition: 'width 0.05s linear',
      }} />
    </div>
  );
};
