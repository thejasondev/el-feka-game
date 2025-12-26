"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpCircle, Users, Eye, EyeOff, Vote, Trophy, X } from "lucide-react";

export function RulesSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Solo renderizar después del montaje para evitar hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Placeholder durante SSR - mismas dimensiones que el botón real
    return (
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted/70 border border-border/50" />
    );
  }

  return (
    <>
      {/* Help Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted/70 backdrop-blur-sm text-foreground hover:bg-neon-green/20 hover:text-neon-green border border-border/50 flex items-center justify-center shadow-lg transition-colors"
        aria-label="¿Cómo jugar?"
      >
        <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div
            className="w-full max-w-lg bg-background rounded-t-2xl max-h-[90vh] animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 sm:px-6 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-neon-green flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  ¿Cómo jugar?
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs font-bold sm:text-sm text-left text-muted-foreground">
                Guía rápida para jugar EL FEKA
              </p>
            </div>

            {/* Content */}
            <ScrollArea className="px-4 sm:px-6 h-[55vh] sm:h-[50vh]">
              <div className="space-y-4 sm:space-y-6 pb-4">
                {/* Objetivo */}
                <section>
                  <h3 className="text-neon-cyan font-bold uppercase text-sm flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 shrink-0" />
                    EL OBJETIVO
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Descubrir quién es el{" "}
                    <span className="text-neon-pink font-bold">FEKA</span>{" "}
                    (impostor) antes de que engañe a todos.
                  </p>
                </section>

                {/* Roles */}
                <section>
                  <h3 className="text-neon-cyan font-bold uppercase text-sm flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 shrink-0" />
                    LOS ROLES
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-neon-green/10 border border-neon-green/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-neon-green shrink-0" />
                        <span className="font-bold text-neon-green uppercase text-sm">
                          REALES
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Conocen la palabra secreta. Deben dar pistas sin ser
                        obvios.
                      </p>
                    </div>
                    <div className="bg-neon-pink/10 border border-neon-pink/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <EyeOff className="w-4 h-4 text-neon-pink shrink-0" />
                        <span className="font-bold text-neon-pink uppercase text-sm">
                          FEKA
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        NO conoce la palabra. Debe fingir que sí la sabe.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Gameplay */}
                <section>
                  <h3 className="text-neon-cyan font-bold uppercase text-sm flex items-center gap-2 mb-3">
                    <Vote className="w-4 h-4 shrink-0" />
                    EL JUEGO
                  </h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-neon-green font-bold">1.</span>
                      <span>
                        Cada jugador ve su rol en secreto (REAL o FEKA).
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-neon-green font-bold">2.</span>
                      <span>
                        Por turnos, cada uno dice una palabra relacionada con la
                        palabra secreta.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-neon-green font-bold">3.</span>
                      <span>
                        El FEKA debe improvisar sin conocer la palabra.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-neon-green font-bold">4.</span>
                      <span>Al terminar el tiempo, todos votan.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-neon-green font-bold">5.</span>
                      <span>
                        Si descubren al FEKA, ¡REALES ganan! Si no,{" "}
                        <span className="text-neon-pink">FEKA corona</span>.
                      </span>
                    </li>
                  </ol>
                </section>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-border">
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full h-12 font-bold uppercase"
              >
                <X className="w-4 h-4 mr-2" />
                ¡Entendido!
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
