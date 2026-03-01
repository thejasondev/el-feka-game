"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowRight, ChevronUp, RotateCcw } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { sounds } from "@/lib/sounds";
import { useSwipe } from "@/hooks/use-swipe";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

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
  onReset?: () => void;
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
  onReset,
}: RoleRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const lastHapticLevel = useRef(0);

  const SWIPE_THRESHOLD = 100;

  // Haptic + sound en múltiples niveles
  const triggerHaptic = (progress: number) => {
    const level = Math.floor(progress * 4);
    if (level > lastHapticLevel.current) {
      haptic.light();
      sounds.swipeTick(progress);
      lastHapticLevel.current = level;
    }
  };

  const handleReveal = () => {
    setIsRevealing(true);
    haptic.reveal();

    // Mismo sonido para todos — evita delatar al FEKA por audio
    sounds.reveal();

    // Secuencia de transición fluida
    requestAnimationFrame(() => {
      setSwipeProgress(1);
      setTimeout(() => {
        setRevealed(true);
        setTimeout(() => {
          setShowContent(true);
          setIsRevealing(false);
        }, 150);
      }, 200);
    });
  };

  const handleHide = () => {
    setShowContent(false);
    setTimeout(() => {
      setRevealed(false);
      setSwipeProgress(0);
      onNext();
    }, 150);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (revealed || isRevealing) return;
    touchStartY.current = e.touches[0].clientY;
    lastHapticLevel.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (revealed || isRevealing || touchStartY.current === null) return;

    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY.current - currentY;

    if (deltaY > 0) {
      const progress = Math.min(deltaY / SWIPE_THRESHOLD, 1);
      setSwipeProgress(progress);
      triggerHaptic(progress);

      // Auto-reveal al 100%
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

    if (swipeProgress >= 0.8) {
      handleReveal();
    } else {
      setSwipeProgress(0);
    }
    touchStartY.current = null;
    lastHapticLevel.current = 0;
  };

  // Swipe left para pasar
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (revealed) {
        haptic.light();
        handleHide();
      }
    },
    threshold: 75,
  });

  // Estilos dinámicos
  const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const smoothProgress = easeOutExpo(swipeProgress);

  return (
    <>
      <div
        className="min-h-screen bg-background p-4 flex flex-col items-center justify-center safe-x overflow-hidden relative"
        {...(revealed ? swipeHandlers : {})}
      >
        {/* Home/Reset Button */}
        {onReset && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowResetDialog(true)}
            className="absolute top-4 left-4 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive/20 hover:text-destructive border-2 border-muted-foreground/30 hover:border-destructive/50 transition-all shadow-lg"
            style={{ marginTop: "env(safe-area-inset-top, 0px)" }}
            aria-label="Reiniciar juego"
          >
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        )}
        {/* Player Turn */}
        <div
          className="text-center mb-8 transition-all duration-500 ease-out"
          style={{
            opacity: revealed ? 1 : 1 - smoothProgress * 0.4,
            transform: `translateY(${
              revealed ? 0 : -smoothProgress * 20
            }px) scale(${revealed ? 1 : 1 - smoothProgress * 0.05})`,
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

        {/* Card Container */}
        <div className="relative w-full max-w-sm">
          {/* Glow Effect - neutral during swipe, role-colored only after reveal */}
          <div
            className={`absolute inset-0 rounded-xl blur-xl transition-all duration-500 ${
              revealed
                ? isImpostor
                  ? "bg-neon-pink/30"
                  : "bg-neon-green/30"
                : "bg-neon-cyan/20"
            }`}
            style={{
              opacity: revealed ? 1 : smoothProgress * 0.3,
              transform: `scale(${revealed ? 1.1 : 1 + smoothProgress * 0.1})`,
            }}
          />

          {/* Main Card */}
          <Card
            className={`relative w-full overflow-hidden transition-all duration-300 ${
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
              transform: revealed
                ? "translateY(0) scale(1)"
                : `translateY(${-smoothProgress * 8}px) scale(${
                    1 + smoothProgress * 0.02
                  })`,
              transition:
                swipeProgress === 0 && !isRevealing
                  ? "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  : "all 0.3s ease-out",
            }}
          >
            <CardContent className="p-8 text-center min-h-[320px] flex flex-col items-center justify-center relative overflow-hidden">
              {/* Cortina / Overlay */}
              <div
                className="absolute inset-0 bg-card flex flex-col items-center justify-center z-20 transition-all"
                style={{
                  opacity: revealed ? 0 : 1 - smoothProgress * 0.8,
                  transform: `translateY(${
                    revealed ? -100 : -smoothProgress * 50
                  }%)`,
                  pointerEvents: revealed ? "none" : "auto",
                }}
              >
                {/* Eye Icon */}
                <div className="relative w-20 h-20 mb-6">
                  <EyeOff
                    className="w-20 h-20 text-muted-foreground absolute inset-0 transition-all duration-300"
                    style={{
                      opacity: 1 - smoothProgress,
                      transform: `scale(${1 - smoothProgress * 0.3}) rotate(${
                        -smoothProgress * 10
                      }deg)`,
                    }}
                  />
                  <Eye
                    className={`w-20 h-20 absolute inset-0 transition-all duration-300 ${
                      swipeProgress > 0.5
                        ? "text-neon-green"
                        : "text-muted-foreground"
                    }`}
                    style={{
                      opacity: smoothProgress,
                      transform: `scale(${0.7 + smoothProgress * 0.3})`,
                    }}
                  />
                </div>

                <p className="text-muted-foreground uppercase tracking-wide mb-6 text-sm">
                  Solo tú debes ver esto
                </p>

                {/* Swipe Indicator */}
                <div className="flex flex-col items-center">
                  <ChevronUp
                    className="w-8 h-8 text-muted-foreground animate-bounce mb-2"
                    style={{
                      opacity: 1 - smoothProgress,
                      color:
                        swipeProgress > 0.5 ? "var(--neon-green)" : undefined,
                    }}
                  />

                  {/* Progress Ring */}
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="none"
                        className="stroke-muted"
                        strokeWidth="2"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="none"
                        className="stroke-neon-green transition-all"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${smoothProgress * 94} 94`}
                      />
                    </svg>
                  </div>

                  <p
                    className="text-muted-foreground text-xs uppercase mt-3 font-medium transition-all"
                    style={{
                      color:
                        swipeProgress > 0.8 ? "var(--neon-green)" : undefined,
                    }}
                  >
                    {swipeProgress > 0.8 ? "¡Suelta!" : "Desliza arriba"}
                  </p>
                </div>

                {/* Desktop fallback */}
                <Button
                  onClick={handleReveal}
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-xs text-muted-foreground/50 hover:text-muted-foreground"
                >
                  o toca aquí
                </Button>
              </div>

              {/* Preview borroso - neutral, sin revelar rol */}
              {!revealed && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10"
                  style={{
                    filter: `blur(${(1 - smoothProgress) * 12}px)`,
                    opacity: smoothProgress * 0.6,
                    transform: `scale(${0.85 + smoothProgress * 0.15})`,
                  }}
                >
                  <div className="text-6xl mb-4">❓</div>
                  <h3 className="text-3xl font-black text-neon-cyan">TU ROL</h3>
                </div>
              )}

              {/* Contenido Revelado */}
              {revealed && (
                <div
                  className={`relative z-30 transition-all duration-500 ${
                    showContent
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  {isImpostor ? (
                    <>
                      <div className="text-6xl mb-4 animate-bounce">🎭</div>
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
                        <div className="mt-4 bg-neon-pink/10 border border-neon-pink/30 rounded-lg px-4 py-2 animate-fade-in">
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
                      <div className="bg-muted rounded-lg p-4 mt-4 w-full animate-fade-in">
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
        </div>

        {/* Next Button */}
        {revealed && showContent && (
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

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetDialog}
        title="¿Reiniciar?"
        message="Se perderá el progreso actual y volverás al inicio del juego."
        confirmText="Reiniciar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={() => {
          setShowResetDialog(false);
          onReset?.();
        }}
        onCancel={() => setShowResetDialog(false)}
      />
    </>
  );
}
