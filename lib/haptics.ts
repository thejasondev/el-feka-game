/**
 * Haptic feedback utilities for mobile devices
 * Uses the Vibration API when available
 */

type HapticPattern = number | number[];

const vibrate = (pattern: HapticPattern): boolean => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    return navigator.vibrate(pattern);
  }
  return false;
};

export const haptic = {
  /** Light tap - for UI interactions like button presses */
  light: () => vibrate(10),

  /** Medium tap - for confirmations and selections */
  medium: () => vibrate(25),

  /** Heavy tap - for important actions */
  heavy: () => vibrate([50, 30, 50]),

  /** Success pattern - for positive outcomes */
  success: () => vibrate([10, 50, 10, 50, 10]),

  /** Error/warning pattern - for negative outcomes or alerts */
  error: () => vibrate([100, 30, 100]),

  /** Reveal pattern - for dramatic reveals like showing roles */
  reveal: () => vibrate([30, 50, 100]),
};

export default haptic;
