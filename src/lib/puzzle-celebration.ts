const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

export function firePuzzleConfetti() {
  if (typeof window === "undefined") return;

  void import("canvas-confetti").then(({ default: confetti }) => {
    const burst = (x: number, delay = 0) => {
      setTimeout(() => {
        confetti({
          particleCount: 70,
          spread: 65,
          startVelocity: 38,
          origin: { x, y: 0.58 },
          colors: COLORS,
          zIndex: 9999,
          disableForReducedMotion: true,
        });
      }, delay);
    };

    burst(0.2);
    burst(0.5, 120);
    burst(0.8, 240);

    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: COLORS,
        zIndex: 9999,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: COLORS,
        zIndex: 9999,
        disableForReducedMotion: true,
      });
    }, 350);
  });
}
