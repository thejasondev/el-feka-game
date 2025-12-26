"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Home, Check, X, Trophy, Flame } from "lucide-react";
import { haptic } from "@/lib/haptics";

interface PlayerVote {
  voterIndex: number;
  votedForIndices: number[];
}

interface ResultsScreenProps {
  players: string[];
  impostorIndices: number[];
  secretWord: string;
  categoryName: string;
  votes: PlayerVote[];
  scores: number[];
  streak: number;
  twoImpostors: boolean;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export function ResultsScreen({
  players,
  impostorIndices,
  secretWord,
  categoryName,
  votes,
  scores,
  streak,
  twoImpostors,
  onPlayAgain,
  onNewGame,
}: ResultsScreenProps) {
  // Contar votos (aplanando arrays)
  const voteCounts = players.map(
    (_, index) => votes.filter((v) => v.votedForIndices.includes(index)).length
  );
  const maxVotes = Math.max(...voteCounts);
  const votedOutIndex = voteCounts.indexOf(maxVotes);

  // Lógica de victoria según modo
  let realesWin: boolean;
  if (twoImpostors) {
    // En modo 2 impostores: REALES ganan si AMBOS impostores reciben votos
    const impostorsWithVotes = impostorIndices.filter(
      (idx) => voteCounts[idx] > 0
    );
    realesWin = impostorsWithVotes.length === 2;
  } else {
    realesWin = impostorIndices.includes(votedOutIndex);
  }

  // Calculate who guessed correctly (votó por algún impostor)
  const correctGuessers = votes
    .filter((v) =>
      v.votedForIndices.some((idx) => impostorIndices.includes(idx))
    )
    .map((v) => v.voterIndex);

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col safe-x animate-slide-in">
      {/* Result Banner */}
      <div
        className={`text-center mb-6 pt-8 mt-4 safe-top ${
          realesWin ? "neon-glow-green" : "neon-glow-pink"
        } p-6 rounded-2xl`}
      >
        <div className="text-5xl mb-3">{realesWin ? "🎉" : "😈"}</div>
        <h2
          className={`text-3xl md:text-4xl font-black uppercase ${
            realesWin ? "text-neon-green" : "text-neon-pink"
          } animate-pulse-neon`}
        >
          {realesWin
            ? twoImpostors
              ? "¡SACARON A LOS FEKAS!"
              : "¡SACARON AL FEKA!"
            : twoImpostors
            ? "¡LOS FEKAS CORONARON!"
            : "¡EL FEKA CORONÓ!"}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm uppercase">
          {realesWin
            ? "Los REALES ganan esta ronda"
            : twoImpostors
            ? "Al menos un FEKA escapó"
            : "El FEKA engañó a todos"}
        </p>

        {/* Streak indicator */}
        {streak > 1 && (
          <div className="mt-3 inline-flex items-center gap-2 bg-neon-cyan/20 px-4 py-2 rounded-full">
            <Flame className="w-4 h-4 text-neon-cyan" />
            <span className="text-neon-cyan font-bold text-sm">
              RACHA: {streak}
            </span>
          </div>
        )}
      </div>

      {/* Game Details */}
      <Card className="bg-card border-border mb-4">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground uppercase text-xs">
              {twoImpostors ? "Los FEKAS eran:" : "El FEKA era:"}
            </span>
            <span className="text-xl font-black text-neon-pink">
              {twoImpostors
                ? impostorIndices.map((i) => players[i]).join(" y ")
                : players[impostorIndices[0]]}
            </span>
          </div>
          <div className="border-t border-border pt-3">
            <span className="text-muted-foreground uppercase text-xs block mb-1">
              Palabra secreta ({categoryName}):
            </span>
            <span className="text-xl font-black text-neon-cyan">
              {secretWord}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Vote Results & Who Guessed Correctly */}
      <h3 className="text-sm font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-neon-green" />
        ¿Quién acertó?
      </h3>
      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-2">
          {players.map((player, index) => {
            // Skip all impostors in this list
            if (impostorIndices.includes(index)) return null;

            const playerVote = votes.find((v) => v.voterIndex === index);
            // Check if player voted for ANY impostor
            const guessedCorrectly = playerVote?.votedForIndices.some((idx) =>
              impostorIndices.includes(idx)
            );
            const votedFor = playerVote
              ? playerVote.votedForIndices.map((i) => players[i]).join(", ")
              : "No votó";

            return (
              <Card
                key={index}
                className={`${
                  guessedCorrectly
                    ? "border-neon-green/50 bg-neon-green/10"
                    : "border-border bg-card"
                }`}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        guessedCorrectly ? "bg-neon-green/20" : "bg-muted"
                      }`}
                    >
                      {guessedCorrectly ? (
                        <Check className="w-4 h-4 text-neon-green" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold uppercase text-sm">
                        {player}
                      </span>
                      <span className="text-muted-foreground text-xs block">
                        Votó: {votedFor}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-black text-lg ${
                      guessedCorrectly
                        ? "text-neon-green"
                        : "text-muted-foreground"
                    }`}
                  >
                    {guessedCorrectly ? "+1" : "0"}
                  </span>
                </CardContent>
              </Card>
            );
          })}

          {/* Show all impostors' results */}
          {impostorIndices.map((impostorIdx) => (
            <Card
              key={`impostor-${impostorIdx}`}
              className="border-neon-pink/50 bg-neon-pink/10"
            >
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neon-pink/20">
                    <span className="text-sm">😈</span>
                  </div>
                  <div>
                    <span className="font-bold uppercase text-sm text-neon-pink">
                      {players[impostorIdx]}
                    </span>
                    <span className="text-muted-foreground text-xs block">
                      {twoImpostors ? "FEKA" : "EL FEKA"}
                    </span>
                  </div>
                </div>
                <span
                  className={`font-black text-lg ${
                    realesWin ? "text-muted-foreground" : "text-neon-pink"
                  }`}
                >
                  {realesWin ? "0" : "+2"}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Scoreboard */}
      <Card className="bg-card border-neon-cyan/30 mb-4">
        <CardContent className="p-3">
          <h4 className="text-xs font-bold uppercase text-neon-cyan mb-2 flex items-center gap-2">
            <Trophy className="w-3 h-3" />
            MARCADOR
          </h4>
          <div className="flex flex-wrap gap-2">
            {players
              .map((player, index) => ({ player, score: scores[index], index }))
              .sort((a, b) => b.score - a.score)
              .map(({ player, score, index }) => (
                <div
                  key={index}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    impostorIndices.includes(index)
                      ? "bg-neon-pink/20 text-neon-pink"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {player}: {score}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pb-6 safe-bottom">
        <Button
          onClick={() => {
            haptic.medium();
            onPlayAgain();
          }}
          className="flex-1 h-14 font-bold uppercase neon-glow-green bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          OTRA RONDA
        </Button>
        <Button
          onClick={() => {
            haptic.light();
            onNewGame();
          }}
          variant="outline"
          className="flex-1 h-14 font-bold uppercase bg-transparent"
        >
          <Home className="w-5 h-5 mr-2" />
          NUEVO JUEGO
        </Button>
      </div>
    </div>
  );
}
