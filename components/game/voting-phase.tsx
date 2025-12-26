"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flame, Check } from "lucide-react";
import { haptic } from "@/lib/haptics";

interface VotingPhaseProps {
  playerCount: number;
  onVote: (votedPlayer: number) => void;
}

export function VotingPhase({ playerCount, onVote }: VotingPhaseProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (selectedPlayer !== null) {
      setConfirmed(true);
      setTimeout(() => onVote(selectedPlayer), 500);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col safe-x animate-slide-in">
      {/* Header */}
      <div className="text-center mb-6 pt-8">
        <h2 className="text-3xl md:text-4xl font-black uppercase text-neon-pink animate-pulse-neon">
          ¡QUEMARLO!
        </h2>
        <p className="text-muted-foreground mt-2 uppercase text-sm">
          ¿Quién es el FEKA?
        </p>
      </div>

      {/* Voting Grid */}
      <ScrollArea className="flex-1 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
          {Array.from({ length: playerCount }, (_, i) => i + 1).map(
            (player) => (
              <Card
                key={player}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedPlayer === player
                    ? "neon-glow-pink border-secondary bg-secondary/20"
                    : "bg-card border-border hover:border-muted-foreground"
                } ${confirmed && selectedPlayer === player ? "scale-105" : ""}`}
                onClick={() => !confirmed && setSelectedPlayer(player)}
              >
                <CardContent className="p-4 text-center min-h-[80px] flex flex-col items-center justify-center">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                      selectedPlayer === player
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {selectedPlayer === player ? (
                      <Flame className="w-6 h-6" />
                    ) : (
                      <span className="text-xl font-black">{player}</span>
                    )}
                  </div>
                  <span className="text-sm font-bold uppercase">
                    Jugador {player}
                  </span>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </ScrollArea>

      {/* Confirm Button */}
      <div className="pb-8 safe-bottom">
        <Button
          disabled={selectedPlayer === null || confirmed}
          onClick={() => {
            if (selectedPlayer !== null) {
              haptic.success();
              handleConfirm();
            }
          }}
          className="w-full h-16 text-xl font-black uppercase neon-glow-pink bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
        >
          {confirmed ? (
            <>
              <Check className="w-6 h-6 mr-2" />
              ¡QUEMADO!
            </>
          ) : (
            <>
              <Flame className="w-6 h-6 mr-2" />
              QUEMAR JUGADOR {selectedPlayer || "?"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
