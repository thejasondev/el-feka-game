"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flame, Check, Eye, EyeOff, ArrowRight } from "lucide-react";
import { haptic } from "@/lib/haptics";

interface IndividualVotingProps {
  players: string[];
  currentVoterIndex: number;
  onVote: (votedPlayerIndices: number[]) => void;
  onSkipToResults: () => void;
  votesCollected: number;
  twoImpostors: boolean;
}

export function IndividualVoting({
  players,
  currentVoterIndex,
  onVote,
  onSkipToResults,
  votesCollected,
  twoImpostors,
}: IndividualVotingProps) {
  const [revealed, setRevealed] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const currentVoter = players[currentVoterIndex];
  const requiredVotes = twoImpostors ? 2 : 1;

  const handleReveal = () => {
    haptic.light();
    setRevealed(true);
  };

  const handleSelectPlayer = (index: number) => {
    if (index === currentVoterIndex || confirmed) return;
    haptic.light();

    setSelectedPlayers((prev) => {
      // Si ya está seleccionado, lo deseleccionamos
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      // Si ya tenemos el máximo de votos, reemplazamos el primero
      if (prev.length >= requiredVotes) {
        return [...prev.slice(1), index];
      }
      // Agregamos el nuevo voto
      return [...prev, index];
    });
  };

  const handleConfirm = () => {
    if (selectedPlayers.length === requiredVotes) {
      haptic.success();
      setConfirmed(true);
      setTimeout(() => {
        onVote(selectedPlayers);
        // Reset state for next voter
        setRevealed(false);
        setSelectedPlayers([]);
        setConfirmed(false);
      }, 1200);
    }
  };

  // Pre-reveal: waiting for voter to take the device
  if (!revealed) {
    return (
      <div className="min-h-screen bg-background p-4 flex flex-col items-center justify-center safe-x animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-neon-pink/20 flex items-center justify-center mb-4">
            <EyeOff className="w-10 h-10 text-neon-pink" />
          </div>
          <p className="text-muted-foreground uppercase text-sm mb-2">
            Pásale el cel a...
          </p>
          <h2 className="text-4xl md:text-5xl font-black uppercase text-neon-pink animate-pulse-neon">
            {currentVoter}
          </h2>
          <p className="text-muted-foreground mt-4 text-sm">
            Voto {votesCollected + 1} de {players.length}
          </p>
          {twoImpostors && (
            <p className="text-neon-cyan mt-2 text-xs font-bold uppercase">
              ⚠️ Elige a 2 sospechosos
            </p>
          )}
        </div>

        <Button
          onClick={handleReveal}
          className="w-full max-w-xs h-16 text-xl font-black uppercase neon-glow-pink bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          <Eye className="w-6 h-6 mr-2" />
          SOY {currentVoter.toUpperCase()}
        </Button>

        {/* Skip option after at least half have voted */}
        {votesCollected >= Math.ceil(players.length / 2) && (
          <Button
            onClick={() => {
              haptic.light();
              onSkipToResults();
            }}
            variant="ghost"
            className="mt-4 text-muted-foreground uppercase text-sm"
          >
            Ver resultados ahora
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    );
  }

  // Voting screen
  return (
    <div className="min-h-screen bg-background p-4 flex flex-col safe-x animate-slide-in">
      {/* Header */}
      <div className="text-center mb-4 pt-6">
        <p className="text-muted-foreground uppercase text-xs mb-1">
          {currentVoter}, ¿quién{twoImpostors ? "es son" : " es"}...
        </p>
        <h2 className="text-3xl md:text-4xl font-black uppercase text-neon-pink animate-pulse-neon">
          {twoImpostors ? "LOS FEKAS?" : "EL FEKA?"}
        </h2>
        {twoImpostors && (
          <p className="text-neon-cyan text-xs mt-2 font-bold">
            Selecciona {requiredVotes - selectedPlayers.length} sospechoso
            {requiredVotes - selectedPlayers.length !== 1 ? "s" : ""} más
          </p>
        )}
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center gap-1 mb-4">
        {players.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i < votesCollected
                ? "bg-neon-green"
                : i === votesCollected
                ? "bg-neon-pink animate-pulse"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Voting Grid */}
      <ScrollArea className="flex-1 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
          {players.map((player, index) => {
            const isSelf = index === currentVoterIndex;
            const isSelected = selectedPlayers.includes(index);
            const selectionOrder = selectedPlayers.indexOf(index) + 1;

            return (
              <Card
                key={index}
                className={`transition-all duration-200 ${
                  isSelf
                    ? "opacity-40 cursor-not-allowed"
                    : isSelected
                    ? "neon-glow-pink border-secondary bg-secondary/20 cursor-pointer scale-[1.02]"
                    : "bg-card border-border hover:border-muted-foreground cursor-pointer active:scale-95"
                } ${confirmed && isSelected ? "scale-105" : ""}`}
                onClick={() => handleSelectPlayer(index)}
              >
                <CardContent className="p-4 text-center min-h-[80px] flex flex-col items-center justify-center relative">
                  {/* Selection badge for 2 impostors mode */}
                  {twoImpostors && isSelected && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-neon-pink text-background text-xs font-black flex items-center justify-center">
                      {selectionOrder}
                    </div>
                  )}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isSelected
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {isSelected ? (
                      <Flame className="w-6 h-6 animate-pulse" />
                    ) : (
                      <span className="text-lg font-black">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs font-bold uppercase truncate block max-w-full">
                    {isSelf ? "(TÚ)" : player}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Confirm Button */}
      <div className="pb-6 safe-bottom">
        <Button
          onClick={handleConfirm}
          disabled={selectedPlayers.length !== requiredVotes || confirmed}
          className="w-full h-14 text-sm sm:text-lg font-black uppercase neon-glow-pink bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
        >
          {confirmed ? (
            <>
              <Check className="w-5 h-5 mr-2 shrink-0" />
              ¡VOTADO!
            </>
          ) : (
            <>
              <Flame className="w-5 h-5 mr-2 shrink-0" />
              <span className="truncate">
                {selectedPlayers.length === requiredVotes
                  ? twoImpostors
                    ? `QUEMAR: ${selectedPlayers
                        .map((i) => players[i])
                        .join(" + ")}`
                    : `QUEMAR A ${players[selectedPlayers[0]].toUpperCase()}`
                  : twoImpostors
                  ? `ELIGE ${requiredVotes - selectedPlayers.length} MÁS`
                  : "SELECCIONA AL FEKA"}
              </span>
            </>
          )}
        </Button>
      </div>

      {/* Fullscreen confirmation overlay */}
      {confirmed && (
        <div className="fixed inset-0 bg-background/95 flex flex-col items-center justify-center z-50 animate-scale-in">
          <div className="text-6xl mb-4">🔥</div>
          <Check className="w-16 h-16 text-neon-green mb-4" />
          <p className="text-neon-green text-2xl font-black uppercase">
            ¡VOTO{twoImpostors ? "S" : ""} REGISTRADO{twoImpostors ? "S" : ""}!
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Pasando al siguiente votante...
          </p>
        </div>
      )}
    </div>
  );
}
