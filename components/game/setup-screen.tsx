"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CATEGORIES, type CategoryKey } from "@/lib/game-data";
import {
  Users,
  Timer,
  Play,
  UserX,
  Vote,
  Volume2,
  VolumeX,
  Trophy,
} from "lucide-react";
import { haptic } from "@/lib/haptics";
import { sounds } from "@/lib/sounds";
import { Footer } from "@/components/game/footer";

// Dynamic import para evitar errores de hidratación con el Drawer
const RulesSheet = dynamic(
  () => import("@/components/game/rules-sheet").then((mod) => mod.RulesSheet),
  { ssr: false },
);

interface SetupScreenProps {
  onStartGame: (
    playerCount: number,
    category: CategoryKey,
    timerDuration: number,
    twoImpostors: boolean,
    skipVoting: boolean,
    totalRounds: number,
  ) => void;
}

export function SetupScreen({ onStartGame }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(
    null,
  );
  const [timerDuration, setTimerDuration] = useState(180);
  const [twoImpostors, setTwoImpostors] = useState(false);
  const [skipVoting, setSkipVoting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [tournamentMode, setTournamentMode] = useState(false);
  const [totalRounds, setTotalRounds] = useState(5);

  // Load sound preference
  useEffect(() => {
    setSoundEnabled(!sounds.getMuted());
  }, []);

  const canStart = selectedCategory !== null;
  // Two impostors only available with 6+ players
  const canHaveTwoImpostors = playerCount >= 6;

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col safe-x animate-slide-in relative">
      {/* Header with Help Button */}
      <div className="mb-8 pt-8 safe-top relative">
        {/* Help & Sound Buttons */}
        <div className="absolute top-8 right-0 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const muted = sounds.toggleMute();
              setSoundEnabled(!muted);
              if (!muted) sounds.tap();
            }}
            className="w-10 h-10 rounded-full"
            aria-label={soundEnabled ? "Silenciar" : "Activar sonido"}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-neon-cyan" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
          <RulesSheet />
        </div>

        {/* Título centrado */}
        <div className="text-center pr-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl uppercase tracking-tight text-neon-green animate-pulse-neon title-graffiti">
            EL FEKA
          </h1>
          <p className="text-muted-foreground mt-2 uppercase tracking-wide text-sm">
            ¿Quién es el impostor?
          </p>
        </div>
      </div>

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
            max={25}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>3</span>
            <span>25</span>
          </div>
        </CardContent>
      </Card>
      {/* Two Impostors Mode */}
      <Card
        className={`bg-card border-border mb-4 transition-all ${
          !canHaveTwoImpostors
            ? "opacity-50"
            : twoImpostors
              ? "border-neon-pink neon-glow-pink"
              : ""
        }`}
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  twoImpostors ? "bg-neon-pink/20" : "bg-muted"
                }`}
              >
                <UserX
                  className={`w-5 h-5 ${
                    twoImpostors ? "text-neon-pink" : "text-muted-foreground"
                  }`}
                />
              </div>
              <div>
                <h3
                  className={`font-bold uppercase text-sm ${
                    twoImpostors ? "text-neon-pink" : ""
                  }`}
                >
                  2 FEKAS
                </h3>
                <p className="text-xs text-muted-foreground">
                  {canHaveTwoImpostors
                    ? "Modo caos activable"
                    : "Requiere 6+ jugadores"}
                </p>
              </div>
            </div>
            <Switch
              checked={twoImpostors}
              onCheckedChange={setTwoImpostors}
              disabled={!canHaveTwoImpostors}
              className="data-[state=checked]:bg-neon-pink data-[state=unchecked]:bg-muted-foreground/30 data-[state=unchecked]:border data-[state=unchecked]:border-muted-foreground/50"
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

      {/* Skip Voting Toggle */}
      <Card
        className={`bg-card border-border mb-4 transition-all ${
          skipVoting ? "border-neon-cyan/50" : ""
        }`}
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  !skipVoting ? "bg-neon-cyan/20" : "bg-muted"
                }`}
              >
                <Vote
                  className={`w-5 h-5 ${
                    !skipVoting ? "text-neon-cyan" : "text-muted-foreground"
                  }`}
                />
              </div>
              <div>
                <h3
                  className={`font-bold uppercase text-sm ${
                    !skipVoting ? "text-neon-cyan" : "text-muted-foreground"
                  }`}
                >
                  Votación en la App
                </h3>
                <p className="text-xs text-muted-foreground">
                  {skipVoting
                    ? "Votan verbalmente"
                    : "Votación individual en la app"}
                </p>
              </div>
            </div>
            <Switch
              checked={!skipVoting}
              onCheckedChange={(checked) => {
                const newSkipVoting = !checked;
                setSkipVoting(newSkipVoting);
                // Si desactivan la votación, el torneo se apaga obligatoriamente
                if (newSkipVoting) {
                  setTournamentMode(false);
                }
              }}
              className="data-[state=checked]:bg-neon-cyan data-[state=unchecked]:bg-muted-foreground/30 data-[state=unchecked]:border data-[state=unchecked]:border-muted-foreground/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tournament Mode */}
      <Card
        className={`bg-card border-border mb-4 transition-all ${
          tournamentMode ? "border-neon-green/50 neon-glow-green" : ""
        }`}
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tournamentMode
                    ? "bg-neon-green/20"
                    : skipVoting
                      ? "bg-muted/30"
                      : "bg-muted"
                }`}
              >
                <Trophy
                  className={`w-5 h-5 ${
                    tournamentMode
                      ? "text-neon-green"
                      : skipVoting
                        ? "text-muted-foreground/40"
                        : "text-muted-foreground"
                  }`}
                />
              </div>
              <div>
                <h3
                  className={`font-bold uppercase text-sm ${
                    tournamentMode
                      ? "text-neon-green"
                      : skipVoting
                        ? "text-muted-foreground/50"
                        : ""
                  }`}
                >
                  Torneo
                </h3>
                <p
                  className={`text-xs ${
                    skipVoting
                      ? "text-destructive/80 font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {skipVoting
                    ? "Requiere Votación en la App"
                    : tournamentMode
                      ? `${totalRounds} rondas con podio final`
                      : "Partidas libres sin l\u00edmite"}
                </p>
              </div>
            </div>
            <Switch
              checked={tournamentMode && !skipVoting}
              onCheckedChange={setTournamentMode}
              disabled={skipVoting}
              className="data-[state=checked]:bg-neon-green data-[state=unchecked]:bg-muted-foreground/30 data-[state=unchecked]:border data-[state=unchecked]:border-muted-foreground/50 disabled:opacity-50"
            />
          </div>
          {/* Round selector pills */}
          {tournamentMode && (
            <div className="flex gap-2 mt-4 justify-center">
              {[3, 5, 7].map((rounds) => (
                <button
                  key={rounds}
                  onClick={() => {
                    setTotalRounds(rounds);
                    haptic.light();
                    sounds.tap();
                  }}
                  className={`px-5 py-2 rounded-full text-sm font-bold uppercase transition-all ${
                    totalRounds === rounds
                      ? "bg-neon-green text-black"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {rounds}
                </button>
              ))}
            </div>
          )}
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
            (typeof CATEGORIES)[CategoryKey],
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
              sounds.unlock();
              sounds.gameStart();
              onStartGame(
                playerCount,
                selectedCategory!,
                timerDuration,
                twoImpostors,
                skipVoting,
                tournamentMode ? totalRounds : 0,
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
