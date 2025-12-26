"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CATEGORIES, type CategoryKey } from "@/lib/game-data";
import { Users, Timer, Play, UserX } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { RulesSheet } from "@/components/game/rules-sheet";
import { Footer } from "@/components/game/footer";

interface SetupScreenProps {
  onStartGame: (
    playerCount: number,
    category: CategoryKey,
    timerDuration: number,
    twoImpostors: boolean
  ) => void;
}

export function SetupScreen({ onStartGame }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(
    null
  );
  const [timerDuration, setTimerDuration] = useState(180);
  const [twoImpostors, setTwoImpostors] = useState(false);

  const canStart = selectedCategory !== null;
  // Two impostors only available with 6+ players
  const canHaveTwoImpostors = playerCount >= 6;

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col safe-x animate-slide-in relative">
      {/* Header */}
      <div className="text-center mb-8 pt-8 safe-top">
        <h1 className="text-4xl sm:text-5xl md:text-7xl uppercase tracking-tight text-neon-green animate-pulse-neon title-graffiti">
          EL FEKA
        </h1>
        <p className="text-muted-foreground mt-2 uppercase tracking-wide text-sm">
          ¿Quién es el impostor?
        </p>
      </div>

      {/* Help Button */}
      <RulesSheet />

      {/* Player Count */}
      <Card className="bg-card border-border mb-4">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-neon-cyan" />
            <h2 className="text-lg font-bold uppercase">Jugadores</h2>
            <span className="ml-auto text-3xl font-black text-neon-green">
              {playerCount}
            </span>
          </div>
          <Slider
            value={[playerCount]}
            onValueChange={(value) => {
              setPlayerCount(value[0]);
              // Disable two impostors if less than 6 players
              if (value[0] < 6) setTwoImpostors(false);
            }}
            min={3}
            max={15}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>3</span>
            <span>15</span>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`bg-card border-border mb-4 ${
          !canHaveTwoImpostors ? "opacity-50" : ""
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserX className="w-5 h-5 text-neon-pink" />
              <div>
                <h3 className="font-bold uppercase text-sm">2 FEKAS</h3>
                <p className="text-xs text-muted-foreground">
                  Modo caos (6+ jugadores)
                </p>
              </div>
            </div>
            <Switch
              checked={twoImpostors}
              onCheckedChange={setTwoImpostors}
              disabled={!canHaveTwoImpostors}
            />
          </div>
        </CardContent>
      </Card>

      {/* Timer Duration */}
      <Card className="bg-card border-border mb-4">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Timer className="w-6 h-6 text-neon-pink" />
            <h2 className="text-lg font-bold uppercase">Tiempo</h2>
            <span className="ml-auto text-xl font-bold text-neon-pink">
              {Math.floor(timerDuration / 60)}:
              {(timerDuration % 60).toString().padStart(2, "0")}
            </span>
          </div>
          <Slider
            value={[timerDuration]}
            onValueChange={(value) => setTimerDuration(value[0])}
            min={60}
            max={600}
            step={30}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1 min</span>
            <span>10 min</span>
          </div>
        </CardContent>
      </Card>

      {/* Category Selection */}
      <h2 className="text-lg font-bold uppercase mb-3 flex items-center gap-2">
        <span className="text-neon-cyan">🎯</span> Categoría
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {(
          Object.entries(CATEGORIES) as [
            CategoryKey,
            (typeof CATEGORIES)[CategoryKey]
          ][]
        ).map(([key, category]) => (
          <Card
            key={key}
            className={`cursor-pointer transition-all duration-200 ${
              selectedCategory === key
                ? "neon-glow-green border-primary bg-primary/10"
                : "bg-card border-border hover:border-muted-foreground"
            }`}
            onClick={() => setSelectedCategory(key)}
          >
            <CardContent className="p-4 text-center min-h-[80px] flex flex-col items-center justify-center">
              <span className="text-2xl mb-1 block">{category.emoji}</span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">
                {category.name}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Start Button */}
      <div className="mt-auto pb-8 safe-bottom">
        <Button
          onClick={() => {
            if (canStart) {
              haptic.medium();
              onStartGame(
                playerCount,
                selectedCategory!,
                timerDuration,
                twoImpostors
              );
            }
          }}
          disabled={!canStart}
          className="w-full h-16 text-xl font-black uppercase neon-glow-green bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-6 h-6 mr-2" />
          ¡A JUGAR!
        </Button>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
