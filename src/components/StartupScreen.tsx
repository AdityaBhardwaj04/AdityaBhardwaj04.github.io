import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';

const BOOT_MESSAGES = [
  'Establishing secure connection...',
  'Validating certificate...',
  'Loading operator profile...',
  'Loading projects...',
  'Initializing workspace...',
  'Synchronizing portfolio data...',
  'Preparing interface...',
];

interface StartupScreenProps {
  onComplete: () => void;
}

export default function StartupScreen({ onComplete }: StartupScreenProps) {
  const [phase, setPhase] = useState<'black' | 'loading' | 'complete'>('black');
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    const blackTimer = setTimeout(() => setPhase('loading'), 200);

    return () => {
      clearTimeout(blackTimer);
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (phase !== 'loading') return;

    const totalDuration = 2000;
    const messageInterval = totalDuration / BOOT_MESSAGES.length;
    const progressInterval = 30;
    const startTime = Date.now();

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(progressTimer);
        setPhase('complete');
      }
    }, progressInterval);

    const messageTimer = setInterval(() => {
      setMessageIndex(prev => {
        if (prev < BOOT_MESSAGES.length - 1) return prev + 1;
        clearInterval(messageTimer);
        return prev;
      });
    }, messageInterval);

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'complete') return;

    const timer = setTimeout(() => {
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
      onComplete();
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center font-mono"
      style={{ backgroundColor: '#07090D' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {phase === 'black' && <div />}

      {phase === 'loading' && (
        <motion.div
          className="flex flex-col items-center gap-4 w-72"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-term-green text-xs font-bold tracking-wide">
            {BOOT_MESSAGES[messageIndex]}
          </p>

          <div className="w-full h-0.5 bg-term-gray rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-term-green rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-term-lightgray text-[10px] font-mono">
            {Math.round(progress)}%
          </span>
        </motion.div>
      )}

      {phase === 'complete' && (
        <div className="flex flex-col items-center gap-4 w-72">
          <motion.div
            layoutId="secure-status"
            className="flex items-center gap-2 text-term-green font-bold text-shadow-glow text-sm"
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Lock size={14} className="animate-pulse" />
            <span>SECURE CONNECTION ESTABLISHED</span>
          </motion.div>

          <motion.div
            className="w-full flex flex-col items-center gap-2"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="w-full h-0.5 bg-term-gray rounded-full overflow-hidden">
              <div className="h-full bg-term-green rounded-full w-full" />
            </div>
            <span className="text-term-lightgray text-[10px] font-mono">100%</span>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
