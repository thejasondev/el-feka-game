"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Vote, Pause, Play } from "lucide-react";
import { haptic } from "@/lib/haptics";

interface TimerPhaseProps {
  duration: number;
  secretWord: string;
  categoryName: string;
  onVotingStart: () => void;
}

export function TimerPhase({
  duration,
  secretWord,
  categoryName,
  onVotingStart,
}: TimerPhaseProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);

  // Wake Lock to prevent screen from sleeping during discussion
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;

    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch (err) {
        // Wake Lock request failed - usually due to low battery or policy
        console.log("Wake Lock error:", err);
      }
    };

    requestWakeLock();

    // Re-acquire wake lock if page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      wakeLock?.release();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          haptic.heavy(); // Vibrate when time runs out
          clearInterval(interval);
          return 0;
        }
        // Haptic tick at critical times
        if (prev <= 11 && prev > 1) {
          haptic.light();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / duration) * 100; // Inverted: 100% at start, 0% at end

  const isLowTime = timeLeft <= 30;
  const isCriticalTime = timeLeft <= 10;

  // SVG circular timer calculations
  const size = 280;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleVotingStart = useCallback(() => {
    haptic.medium();
    onVotingStart();
  }, [onVotingStart]);

  const togglePause = useCallback(() => {
    haptic.light();
    setIsPaused(!isPaused);
  }, [isPaused]);

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center justify-center safe-x animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black uppercase text-neon-cyan mb-2">
          ¡A DEBATIR!
        </h2>
        <p className="text-muted-foreground text-sm uppercase">
          Descubre quién es el FEKA
        </p>
      </div>

      {/* Circular Timer Display */}
      <div className="relative mb-6">
        <svg
          width={size}
          height={size}
          className={`-rotate-90 ${
            isCriticalTime
              ? "drop-shadow-[0_0_20px_oklch(0.7_0.22_330_/_0.5)]"
              : "drop-shadow-[0_0_20px_oklch(0.75_0.25_145_/_0.3)]"
          }`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ease-linear ${
              isCriticalTime
                ? "text-neon-pink"
                : isLowTime
                ? "text-secondary"
                : "text-neon-green"
            }`}
          />
        </svg>

        {/* Timer digits centered on circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`text-center transition-all duration-300 ${
              isCriticalTime ? "animate-pulse" : ""
            }`}
          >
            <div
              className={`text-6xl sm:text-7xl font-black tabular-nums ${
                isCriticalTime
                  ? "text-neon-pink"
                  : isLowTime
                  ? "text-secondary"
                  : "text-neon-green"
              }`}
            >
              {minutes}:{seconds.toString().padStart(2, "0")}
            </div>
            {isPaused && (
              <p className="text-muted-foreground text-xs uppercase mt-2 animate-pulse">
                PAUSADO
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Word Hint (for reference) */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6 text-center w-full max-w-sm">
        <p className="text-xs text-muted-foreground uppercase mb-1">
          Categoría: {categoryName}
        </p>
        <p className="text-sm text-muted-foreground">
          Los REALES conocen la palabra secreta
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3 w-full max-w-sm safe-bottom">
        <Button
          onClick={togglePause}
          variant="outline"
          className="flex-1 h-14 font-bold uppercase"
        >
          {isPaused ? (
            <>
              <Play className="w-5 h-5 mr-2" />
              CONTINUAR
            </>
          ) : (
            <>
              <Pause className="w-5 h-5 mr-2" />
              PAUSAR
            </>
          )}
        </Button>
        <Button
          onClick={handleVotingStart}
          className="flex-1 h-14 font-bold uppercase neon-glow-pink bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          <Vote className="w-5 h-5 mr-2" />
          ¡VOTAR!
        </Button>
      </div>

      {/* Time's up overlay */}
      {timeLeft === 0 && (
        <div className="fixed inset-0 bg-background/95 flex flex-col items-center justify-center z-50 animate-fade-in safe-x">
          <div className="text-6xl mb-4">⏰</div>
          <p className="text-neon-pink text-2xl font-black uppercase animate-pulse-neon mb-6">
            ¡TIEMPO AGOTADO!
          </p>
          <Button
            onClick={handleVotingStart}
            className="h-16 px-12 text-lg font-black uppercase neon-glow-pink bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <Vote className="w-6 h-6 mr-2" />
            IR A VOTACIÓN
          </Button>
        </div>
      )}
    </div>
  );
}
