"use client";

interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  variant?: "dots" | "bar" | "steps";
}

/**
 * A reusable progress indicator component showing current step in a sequence
 */
export function ProgressIndicator({
  current,
  total,
  label,
  variant = "dots",
}: ProgressIndicatorProps) {
  if (variant === "bar") {
    const percentage = (current / total) * 100;
    return (
      <div className="w-full max-w-xs">
        {label && (
          <p className="text-xs text-muted-foreground text-center mb-2">
            {label}
          </p>
        )}
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full bg-neon-green transition-all duration-300 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-1">
          {current} / {total}
        </p>
      </div>
    );
  }

  if (variant === "steps") {
    return (
      <div className="flex items-center gap-2">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < current
                  ? "bg-neon-green text-background"
                  : i === current
                  ? "bg-neon-cyan text-background animate-pulse"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            {i < total - 1 && (
              <div
                className={`w-4 h-0.5 ${
                  i < current ? "bg-neon-green" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Default: dots variant
  return (
    <div className="flex flex-col items-center gap-2">
      {label && <p className="text-xs text-muted-foreground">{label}</p>}
      <div className="flex justify-center gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < current
                ? "bg-neon-green scale-100"
                : i === current
                ? "bg-neon-pink animate-pulse scale-110"
                : "bg-muted scale-90"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
