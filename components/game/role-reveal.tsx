"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowRight, ChevronLeft } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { useSwipe } from "@/hooks/use-swipe";
import { ProgressIndicator } from "@/components/game/progress-indicator";

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

  const handleReveal = () => {
    haptic.reveal();
    setRevealed(true);
  };
  const handleHide = () => {
    setRevealed(false);
    onNext();
  };

  // Swipe left to pass to next player
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
      {...swipeHandlers}
    >
      {/* Player Turn Indicator */}
      <div className="text-center mb-8">
        <p className="text-muted-foreground uppercase tracking-wide text-sm mb-2">
          Pásale el cel a...
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
        className={`w-full max-w-sm transition-all duration-500 ${
          revealed
            ? isImpostor
              ? "neon-glow-pink border-secondary"
              : "neon-glow-green border-primary"
            : "bg-card border-border"
        }`}
      >
        <CardContent className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
          {!revealed ? (
            <>
              <EyeOff className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground uppercase tracking-wide mb-6">
                Solo tú debes ver esto
              </p>
              <Button
                onClick={handleReveal}
                className="w-full h-14 text-lg font-bold uppercase bg-muted text-foreground hover:bg-muted/80"
              >
                <Eye className="w-5 h-5 mr-2" />
                SOY {playerName.toUpperCase()}
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
          <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
            <ChevronLeft className="w-3 h-3" />
            Desliza para pasar
            <ChevronLeft className="w-3 h-3 rotate-180" />
          </p>
        </div>
      )}
    </div>
  );
}
