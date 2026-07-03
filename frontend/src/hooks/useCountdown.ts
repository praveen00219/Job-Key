import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Simple 1s-tick countdown timer. Returns the remaining seconds, a `mm:ss`
 * formatted string, whether it's finished, and a `restart` function — used by
 * the "Resend" links on the check-your-email screens.
 */
export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clear();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return clear;
  }, []);

  const restart = useCallback((next = initialSeconds) => {
    clear();
    setSeconds(next);
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clear();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [initialSeconds]);

  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  const formatted = `${mm}:${ss.toString().padStart(2, "0")}`;

  return { seconds, formatted, isFinished: seconds === 0, restart };
}
