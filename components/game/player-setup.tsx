"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, ArrowRight, UserPlus, X } from "lucide-react";
import { haptic } from "@/lib/haptics";

interface PlayerSetupProps {
  playerCount: number;
  onConfirmPlayers: (players: string[]) => void;
  onBack: () => void;
}

export function PlayerSetup({
  playerCount,
  onConfirmPlayers,
  onBack,
}: PlayerSetupProps) {
  const [players, setPlayers] = useState<string[]>(
    Array.from({ length: playerCount }, (_, i) => `Jugador ${i + 1}`)
  );
  const [currentInput, setCurrentInput] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const handleEditSubmit = (index: number) => {
    if (currentInput.trim()) {
      handleNameChange(index, currentInput.trim());
    }
    setEditingIndex(null);
    setCurrentInput("");
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setCurrentInput(players[index]);
  };

  const allNamesValid = players.every((name) => name.trim().length > 0);

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col safe-x animate-slide-in">
      {/* Header */}
      <div className="text-center mb-6 pt-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Users className="w-8 h-8 text-neon-cyan" />
          <h2 className="text-3xl md:text-4xl font-black uppercase text-neon-cyan">
            LA CREW
          </h2>
        </div>
        <p className="text-muted-foreground uppercase text-sm">
          Asere, Pongan sus nombres
        </p>
      </div>

      {/* Player List */}
      <ScrollArea className="flex-1 mb-6">
        <div className="space-y-3 p-1">
          {players.map((player, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-neon-cyan/50 transition-all"
            >
              <CardContent className="p-4">
                {editingIndex === index ? (
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan font-black text-sm">
                      {index + 1}
                    </span>
                    <Input
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleEditSubmit(index)
                      }
                      placeholder="Nombre..."
                      className="flex-1 bg-muted border-none text-lg font-bold"
                      autoFocus
                      maxLength={15}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleEditSubmit(index)}
                      className="bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30"
                    >
                      OK
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingIndex(null);
                        setCurrentInput("");
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => startEditing(index)}
                  >
                    <span className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan font-black text-sm">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-lg font-bold uppercase truncate">
                      {player}
                    </span>
                    <UserPlus className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="pb-8 space-y-3 safe-bottom">
        <Button
          onClick={() => {
            haptic.medium();
            onConfirmPlayers(players);
          }}
          disabled={!allNamesValid}
          className="w-full h-16 text-xl font-black uppercase neon-glow-green bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <ArrowRight className="w-6 h-6 mr-2" />
          ¡ARRANCAR!
        </Button>
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full h-12 font-bold uppercase bg-transparent"
        >
          VOLVER
        </Button>
      </div>
    </div>
  );
}
