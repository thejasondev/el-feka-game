"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpCircle, Users, Eye, EyeOff, Vote, Trophy, X } from "lucide-react";

export function RulesSheet() {
  return (
    <Drawer handleOnly={true}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-14 right-4 z-50 w-10 h-10 rounded-full bg-muted/70 backdrop-blur-sm text-foreground hover:bg-neon-green/20 hover:text-neon-green border border-border/50 flex items-center justify-center shadow-lg"
          aria-label="¿Cómo jugar?"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] sm:max-h-[85vh] touch-none">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="text-left px-4 sm:px-6">
            <DrawerTitle className="text-xl sm:text-2xl font-black uppercase text-neon-green flex items-center gap-2">
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              ¿Cómo jugar?
            </DrawerTitle>
            <DrawerDescription className="text-xs font-bold sm:text-sm text-left">
              Guía rápida para jugar EL FEKA
            </DrawerDescription>
          </DrawerHeader>

          <ScrollArea className="px-4 sm:px-6 h-[55vh] sm:h-[50vh] overscroll-contain touch-auto">
            <div className="space-y-4 sm:space-y-6 pb-4">
              {/* Objetivo */}
              <section>
                <h3 className="font-bold uppercase text-xs sm:text-sm text-neon-cyan mb-1.5 sm:mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4 flex-shrink-0" />
                  El Objetivo
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Descubrir quién es el{" "}
                  <strong className="text-neon-pink">FEKA</strong> (impostor)
                  antes de que engañe a todos.
                </p>
              </section>

              {/* Roles */}
              <section>
                <h3 className="font-bold uppercase text-xs sm:text-sm text-neon-cyan mb-1.5 sm:mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  Los Roles
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 sm:gap-3 bg-neon-green/10 p-2.5 sm:p-3 rounded-lg">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-neon-green mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-neon-green text-xs sm:text-sm">
                        REALES
                      </p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                        Conocen la palabra secreta. Deben dar pistas sin ser
                        obvios.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 bg-neon-pink/10 p-2.5 sm:p-3 rounded-lg">
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-neon-pink mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-neon-pink text-xs sm:text-sm">
                        FEKA
                      </p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                        NO conoce la palabra. Debe fingir que sí la sabe.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Cómo jugar */}
              <section>
                <h3 className="font-bold uppercase text-xs sm:text-sm text-neon-cyan mb-1.5 sm:mb-2">
                  El Juego
                </h3>
                <ol className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-muted-foreground list-decimal list-inside leading-relaxed">
                  <li>
                    Cada jugador ve su rol en <strong>secreto</strong>
                  </li>
                  <li>Todos debaten dando pistas sobre la palabra</li>
                  <li>El FEKA debe adivinar de qué hablan sin delatarse</li>
                  <li>Los REALES deben identificar quién no sabe</li>
                </ol>
              </section>

              {/* Votación */}
              <section>
                <h3 className="font-bold uppercase text-xs sm:text-sm text-neon-cyan mb-1.5 sm:mb-2 flex items-center gap-2">
                  <Vote className="w-4 h-4 flex-shrink-0" />
                  La Votación
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1.5">
                  Todos votan por quién creen que es el FEKA:
                </p>
                <ul className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
                  <li className="text-neon-green">
                    ✓ Si aciertan → ¡Los REALES ganan!
                  </li>
                  <li className="text-neon-pink">
                    ✗ Si fallan → ¡El FEKA gana!
                  </li>
                </ul>
              </section>

              {/* Tips */}
              <section className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                <h3 className="font-bold uppercase text-xs sm:text-sm text-neon-cyan mb-1.5 sm:mb-2">
                  💡 Consejos Pro
                </h3>
                <ul className="space-y-1 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  <li>
                    <strong className="text-neon-green">REALES:</strong> Den
                    pistas sutiles, no obvias
                  </li>
                  <li>
                    <strong className="text-neon-pink">FEKA:</strong> Escucha
                    atento y actúa natural
                  </li>
                  <li>¡El mejor FEKA es el que hace preguntas inteligentes!</li>
                </ul>
              </section>
            </div>
          </ScrollArea>

          <DrawerFooter className="px-4 sm:px-6 pt-2">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full h-12 sm:h-10 text-sm font-bold"
              >
                <X className="w-4 h-4 mr-2" />
                ¡Entendido!
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
