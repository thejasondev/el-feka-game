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
  const [isRevealing, setIsRevealing] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const hasTriggeredHaptic = useRef(false);

  const SWIPE_THRESHOLD = 120;

  const handleReveal = () => {
    setIsRevealing(true);
    haptic.reveal();

    // Transición suave antes de mostrar contenido
    setTimeout(() => {
      setRevealed(true);
      setSwipeProgress(0);
      setIsRevealing(false);
    }, 300);
  };

  const handleHide = () => {
    setRevealed(false);
    onNext();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (revealed || isRevealing) return;
    touchStartY.current = e.touches[0].clientY;
    hasTriggeredHaptic.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (revealed || isRevealing || touchStartY.current === null) return;

    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY.current - currentY;

    if (deltaY > 0) {
      const progress = Math.min(deltaY / SWIPE_THRESHOLD, 1);
      setSwipeProgress(progress);

      // Haptic feedback al 75%
      if (progress >= 0.75 && !hasTriggeredHaptic.current) {
        haptic.light();
        hasTriggeredHaptic.current = true;
      }

      // Auto-reveal al llegar al 100% - transición inmediata sin esperar touchEnd
      if (progress >= 1) {
        touchStartY.current = null;
        handleReveal();
      }
    } else {
      setSwipeProgress(0);
    }
  };

  const handleTouchEnd = () => {
    if (revealed || isRevealing) return;

    if (swipeProgress >= 1) {
      handleReveal();
    } else {
      // Animate back with spring effect
      setSwipeProgress(0);
    }
    touchStartY.current = null;
    hasTriggeredHaptic.current = false;
  };

  // Swipe left para pasar al siguiente
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (revealed) {
        haptic.light();
        handleHide();
      }
    },
    threshold: 75,
  });

  // Calcular estilos dinámicos basados en el progreso
  const cardScale = 1 + swipeProgress * 0.02;
  const cardY = -swipeProgress * 15;
  const blurAmount = (1 - swipeProgress) * 8;
  const contentOpacity = swipeProgress;
  const overlayOpacity = 1 - swipeProgress * 0.7;

  return (
    <div
      className="min-h-screen bg-background p-4 flex flex-col items-center justify-center safe-x"
      {...(revealed ? swipeHandlers : {})}
    >
      {/* Player Turn Indicator */}
      <div
        className="text-center mb-8 transition-all duration-300"
        style={{
          opacity: revealed ? 1 : 1 - swipeProgress * 0.3,
          transform: `translateY(${revealed ? 0 : -swipeProgress * 10}px)`,
        }}
      >
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
        className={`w-full max-w-sm overflow-hidden ${
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
            ? `translateY(${cardY}px) scale(${cardScale})`
            : undefined,
          transition:
            swipeProgress === 0 && !isRevealing
              ? "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease"
              : isRevealing
              ? "all 0.3s ease-out"
              : "none",
        }}
      >
        <CardContent className="p-8 text-center min-h-[320px] flex flex-col items-center justify-center relative">
          {/* Hidden content layer (blurred preview) */}
          {!revealed && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-all"
              style={{
                filter: `blur(${blurAmount}px)`,
                opacity: contentOpacity,
                transform: `scale(${0.9 + swipeProgress * 0.1})`,
              }}
            >
              {isImpostor ? (
                <>
                  <div className="text-6xl mb-4">🎭</div>
                  <h3 className="text-3xl font-black text-neon-pink">
                    ERES EL FEKA
                  </h3>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">✓</div>
                  <h3 className="text-3xl font-black text-neon-green">
                    ERES REAL
                  </h3>
                </>
              )}
            </div>
          )}

          {/* Overlay/Instruction layer */}
          {!revealed && (
            <div
              className="relative z-10 flex flex-col items-center justify-center transition-all"
              style={{
                opacity: overlayOpacity,
                transform: `translateY(${-swipeProgress * 30}px)`,
              }}
            >
              {/* Icon transition */}
              <div className="relative w-20 h-20 mb-4">
                <EyeOff
                  className="w-20 h-20 text-muted-foreground absolute inset-0 transition-all duration-200"
                  style={{
                    opacity: 1 - swipeProgress,
                    transform: `scale(${1 - swipeProgress * 0.2})`,
                  }}
                />
                <Eye
                  className="w-20 h-20 text-neon-green absolute inset-0 transition-all duration-200"
                  style={{
                    opacity: swipeProgress,
                    transform: `scale(${0.8 + swipeProgress * 0.2})`,
                  }}
                />
              </div>

              <p className="text-muted-foreground uppercase tracking-wide mb-6 text-sm">
                Solo tú debes ver esto
              </p>

              {/* Swipe indicator */}
              <div className="flex flex-col items-center">
                <div
                  className="flex flex-col items-center"
                  style={{
                    transform: `translateY(${-swipeProgress * 25}px)`,
                  }}
                >
                  <ChevronUp
                    className="w-8 h-8 text-muted-foreground animate-bounce"
                    style={{
                      color:
                        swipeProgress > 0.5 ? "var(--neon-green)" : undefined,
                      opacity: 1 - swipeProgress * 0.5,
                    }}
                  />
                </div>

                {/* Progress ring */}
                <div className="relative w-16 h-16 mt-2">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-muted"
                      strokeWidth="2"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-neon-green"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={`${swipeProgress * 100} 100`}
                      style={{
                        transition:
                          swipeProgress === 0
                            ? "stroke-dasharray 0.3s ease"
                            : "none",
                      }}
                    />
                  </svg>
                </div>

                <p className="text-muted-foreground text-xs uppercase mt-3 font-medium">
                  {swipeProgress >= 1
                    ? "Suelta para revelar"
                    : "Desliza hacia arriba"}
                </p>
              </div>

              {/* Desktop fallback */}
              <Button
                onClick={handleReveal}
                variant="ghost"
                size="sm"
                className="mt-6 text-xs text-muted-foreground/50 hover:text-muted-foreground"
              >
                o toca aquí
              </Button>
            </div>
          )}

          {/* Revealed content */}
          {revealed && (
            <div className="animate-scale-in">
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
            </div>
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
