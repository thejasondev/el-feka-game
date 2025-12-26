"use client";

import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="text-center py-4 text-xs text-muted-foreground">
      <a
        href="https://instagram.com/thejasondev"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
      >
        Desarrollado por
        <span className="font-semibold text-neon-cyan">@thejasondev</span>
      </a>
    </footer>
  );
}
