"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowRight, ChevronUp } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { useSwipe } from "@/hooks/use-swipe";

interface RoleRevealProps {
  playerName: string;
  currentPlayerIndex: number;
  totalPlayers: number;
  isImpostor: boolean;
  secretWord: string;
  categoryName: string;
  hasPartner: boolean;
  partnerName?: string;
  onNext: () => void;
}

export function RoleReveal({
  playerName,
  currentPlayerIndex,
  totalPlayers,
  isImpostor,
  secretWord,
  categoryName,
  hasPartner,
  partnerName,
  onNext,
}: RoleRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  const SWIPE_THRESHOLD = 100; // pixels para activar el reveal

  const handleReveal = () => {
    haptic.reveal();
    setRevealed(true);
    setSwipeProgress(0);
  };

  const handleHide = () => {
    setRevealed(false);
    onNext();
  };

  // Touch handlers para el swipe up en la tarjeta
  const handleTouchStart = (e: React.TouchEvent) => {
    if (revealed) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (revealed || touchStartY.current === null) return;

    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY.current - currentY; // positivo = hacia arriba

    if (deltaY > 0) {
      // Solo mostramos progreso si desliza hacia arriba
      const progress = Math.min(deltaY / SWIPE_THRESHOLD, 1);
      setSwipeProgress(progress);

      // Haptic feedback cuando alcanza el umbral
      if (progress >= 1 && swipeProgress < 1) {
        haptic.light();
      }
    } else {
      setSwipeProgress(0);
    }
  };

  const handleTouchEnd = () => {
    if (revealed) return;

    if (swipeProgress >= 1) {
      handleReveal();
    } else {
      setSwipeProgress(0);
    }
    touchStartY.current = null;
  };

  // Swipe left para pasar al siguiente (cuando ya está revelado)
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (revealed) {
        haptic.light();
        handleHide();
      }
    },
    threshold: 75,
  });

  return (
    <div
      className="min-h-screen bg-background p-4 flex flex-col items-center justify-center safe-x animate-fade-in"
      {...(revealed ? swipeHandlers : {})}
    >
      {/* Player Turn Indicator */}
      <div className="text-center mb-8">
        <p className="text-muted-foreground uppercase tracking-wide text-sm mb-2">
          Pásale el celular a...
        </p>
        <h2 className="text-4xl font-black text-neon-cyan uppercase">
          {playerName}
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          {currentPlayerIndex + 1} de {totalPlayers}
        </p>
      </div>

      {/* Role Card */}
      <Card
        ref={cardRef}
        className={`w-full max-w-sm transition-all duration-500 ${
          revealed
            ? isImpostor
              ? "neon-glow-pink border-secondary"
              : "neon-glow-green border-primary"
            : "bg-card border-border"
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: !revealed
            ? `translateY(${-swipeProgress * 10}px)`
            : undefined,
        }}
      >
        <CardContent className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
          {!revealed ? (
            <>
              {/* Swipe indicator animado */}
              <div className="relative mb-4">
                <EyeOff
                  className="w-16 h-16 text-muted-foreground transition-opacity"
                  style={{ opacity: 1 - swipeProgress }}
                />
                <Eye
                  className="w-16 h-16 text-neon-green absolute top-0 left-0 transition-opacity"
                  style={{ opacity: swipeProgress }}
                />
              </div>

              <p className="text-muted-foreground uppercase tracking-wide mb-4">
                Solo tú debes ver esto
              </p>

              {/* Swipe up indicator */}
              <div className="flex flex-col items-center gap-2 mb-4">
                <div
                  className="flex flex-col items-center transition-transform"
                  style={{
                    transform: `translateY(${-swipeProgress * 20}px)`,
                  }}
                >
                  <ChevronUp
                    className={`w-6 h-6 animate-bounce ${
                      swipeProgress > 0
                        ? "text-neon-green"
                        : "text-muted-foreground"
                    }`}
                  />
                  <ChevronUp
                    className={`w-6 h-6 -mt-3 animate-bounce ${
                      swipeProgress > 0.5
                        ? "text-neon-green"
                        : "text-muted-foreground"
                    }`}
                    style={{ animationDelay: "0.1s" }}
                  />
                </div>
                <p
                  className={`text-sm uppercase font-bold transition-colors ${
                    swipeProgress > 0
                      ? "text-neon-green"
                      : "text-muted-foreground"
                  }`}
                >
                  {swipeProgress >= 1 ? "¡Suelta!" : "Desliza arriba"}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-neon-green transition-all duration-100"
                  style={{ width: `${swipeProgress * 100}%` }}
                />
              </div>

              {/* Fallback button para desktop */}
              <Button
                onClick={handleReveal}
                variant="ghost"
                className="mt-4 text-xs text-muted-foreground hover:text-foreground"
              >
                o toca aquí
              </Button>
            </>
          ) : (
            <>
              {isImpostor ? (
                <>
                  <div className="text-6xl mb-4">🎭</div>
                  <h3 className="text-4xl font-black text-neon-pink mb-4 animate-pulse-neon">
                    ERES EL FEKA
                  </h3>
                  <p className="text-muted-foreground text-sm uppercase tracking-wide">
                    Engáñalos a todos
                  </p>
                  <p className="text-secondary text-xs mt-2">
                    No sabes la palabra
                  </p>
                  {hasPartner && partnerName && (
                    <div className="mt-4 bg-neon-pink/10 border border-neon-pink/30 rounded-lg px-4 py-2">
                      <p className="text-xs text-muted-foreground uppercase">
                        Tu cómplice:
                      </p>
                      <p className="text-neon-pink font-black uppercase">
                        {partnerName}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">✓</div>
                  <h3 className="text-3xl font-black text-neon-green mb-2">
                    ERES REAL
                  </h3>
                  <div className="bg-muted rounded-lg p-4 mt-4 w-full">
                    <p className="text-xs text-muted-foreground uppercase mb-1">
                      {categoryName}
                    </p>
                    <p className="text-2xl font-black text-foreground">
                      {secretWord}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-xs mt-4 uppercase">
                    No te delates
                  </p>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Next Button */}
      {revealed && (
        <div className="mt-8 w-full max-w-sm safe-bottom animate-fade-in">
          <Button
            onClick={handleHide}
            className="w-full h-14 text-lg font-bold uppercase bg-muted text-foreground hover:bg-muted/80"
          >
            OCULTAR Y PASAR
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            ← Desliza izquierda para pasar →
          </p>
        </div>
      )}
    </div>
  );
}
