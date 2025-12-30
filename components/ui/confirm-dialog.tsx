"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { haptic } from "@/lib/haptics";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning";
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    haptic.medium();
    onConfirm();
  };

  const handleCancel = () => {
    haptic.light();
    onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={handleCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className="relative w-full max-w-sm bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`p-4 flex items-center gap-3 ${
            variant === "danger"
              ? "bg-destructive/10 border-b border-destructive/20"
              : "bg-yellow-500/10 border-b border-yellow-500/20"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              variant === "danger"
                ? "bg-destructive/20 text-destructive"
                : "bg-yellow-500/20 text-yellow-500"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black uppercase text-foreground flex-1">
            {title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="w-8 h-8 rounded-full hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-muted-foreground text-sm text-center">{message}</p>
        </div>

        {/* Actions */}
        <div className="p-4 pt-0 flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 h-12 font-bold uppercase border-2"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={`flex-1 h-12 font-bold uppercase ${
              variant === "danger"
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : "bg-yellow-500 hover:bg-yellow-600 text-black"
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Hook para usar el dialog más fácilmente
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning";
    onConfirm: () => void;
  } | null>(null);

  const confirm = useCallback(
    (options: {
      title: string;
      message: string;
      confirmText?: string;
      cancelText?: string;
      variant?: "danger" | "warning";
    }): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfig({
          ...options,
          onConfirm: () => {
            setIsOpen(false);
            resolve(true);
          },
        });
        setIsOpen(true);
      });
    },
    []
  );

  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const DialogComponent = config ? (
    <ConfirmDialog
      isOpen={isOpen}
      title={config.title}
      message={config.message}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
      variant={config.variant}
      onConfirm={config.onConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { confirm, DialogComponent };
}
