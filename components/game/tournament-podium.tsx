"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Home } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { sounds } from "@/lib/sounds";

interface TournamentPodiumProps {
  players: string[];
  scores: number[];
  totalRounds: number;
  onNewGame: () => void;
}

export function TournamentPodium({
  players,
  scores,
  totalRounds,
  onNewGame,
}: TournamentPodiumProps) {
  // Sort players by score (descending)
  const ranked = players
    .map((name, index) => ({ name, score: scores[index], index }))
    .sort((a, b) => b.score - a.score);

  const medals = ["🥇", "🥈", "🥉"];
  const podiumColors = ["text-yellow-400", "text-gray-300", "text-amber-600"];

  // Play victory fanfare on mount
  useEffect(() => {
    haptic.success();
    sounds.victory();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center safe-x animate-slide-in">
      {/* Header */}
      <div className="text-center pt-8 mb-8 safe-top">
        <div className="text-6xl mb-4 animate-bounce">🏆</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-neon-green animate-pulse-neon">
          ¡TORNEO FINALIZADO!
        </h1>
        <p className="text-muted-foreground mt-2 uppercase tracking-wide text-sm">
          {totalRounds} rondas completadas
        </p>
      </div>

      {/* Podium - Top 3 */}
      <div className="w-full max-w-md mb-6">
        {ranked.slice(0, 3).map((player, podiumPos) => (
          <Card
            key={player.index}
            className={`mb-3 transition-all ${
              podiumPos === 0
                ? "border-yellow-400/50 bg-yellow-400/10 neon-glow-green"
                : podiumPos === 1
                  ? "border-gray-300/30 bg-gray-300/5"
                  : "border-amber-600/30 bg-amber-600/5"
            }`}
            style={{
              animationDelay: `${podiumPos * 200}ms`,
            }}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <span className="text-3xl sm:text-4xl">{medals[podiumPos]}</span>
              <div className="flex-1">
                <span
                  className={`font-black uppercase text-lg sm:text-xl ${podiumColors[podiumPos]}`}
                >
                  {player.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-neon-green">
                  {player.score}
                </span>
                <span className="text-xs text-muted-foreground block uppercase">
                  pts
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rest of players */}
      {ranked.length > 3 && (
        <Card className="w-full max-w-md bg-card border-border mb-6">
          <CardContent className="p-3 space-y-2">
            {ranked.slice(3).map((player, i) => (
              <div
                key={player.index}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-bold text-sm w-6 text-center">
                    {i + 4}°
                  </span>
                  <span className="font-bold uppercase text-sm">
                    {player.name}
                  </span>
                </div>
                <span className="font-bold text-muted-foreground">
                  {player.score} pts
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* MVP Badge */}
      {ranked.length > 0 && (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-neon-green/10 border border-neon-green/30 px-6 py-3 rounded-full">
            <Trophy className="w-5 h-5 text-neon-green" />
            <span className="text-neon-green font-bold uppercase text-sm">
              MVP: {ranked[0].name}
            </span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="w-full max-w-md mt-auto pb-8 safe-bottom">
        <Button
          onClick={() => {
            haptic.medium();
            onNewGame();
          }}
          className="w-full h-16 text-xl font-black uppercase neon-glow-green bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Home className="w-6 h-6 mr-2" />
          NUEVO TORNEO
        </Button>
      </div>
    </div>
  );
}
