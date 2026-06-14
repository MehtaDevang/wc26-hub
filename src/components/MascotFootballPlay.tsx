"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { WC26MascotIcon } from "@/components/mascots/WC26Mascots";
import { useMounted } from "@/hooks/useMounted";
import type { MascotId } from "@/lib/wc26-brand";

const PASS_CHAIN: MascotId[] = ["zayu", "clutch", "maple"];

/** Ball bounce targets aligned with the overlapping mascot stack */
const SLOTS: Record<MascotId, { x: number; y: number }> = {
  zayu: { x: 0.16, y: 0.78 },
  clutch: { x: 0.5, y: 0.74 },
  maple: { x: 0.84, y: 0.78 },
};

const BOUNCE_MS = 3200;

type BallState = { x: number; y: number; air: boolean };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function defaultBall(): BallState {
  const start = SLOTS.zayu;
  return { x: start.x, y: start.y - 0.06, air: false };
}

function computeBall(elapsed: number): BallState {
  const leg = Math.floor(elapsed / BOUNCE_MS) % PASS_CHAIN.length;
  const t = (elapsed % BOUNCE_MS) / BOUNCE_MS;

  const fromId = PASS_CHAIN[leg]!;
  const toId = PASS_CHAIN[(leg + 1) % PASS_CHAIN.length]!;
  const from = SLOTS[fromId];
  const to = SLOTS[toId];

  const fromY = from.y - 0.06;
  const toY = to.y - 0.06;
  const bounceT = easeInOutSine(t);
  const dist = Math.abs(to.x - from.x);
  const hop = 0.14 + dist * 0.08;

  return {
    x: lerp(from.x, to.x, bounceT),
    y: lerp(fromY, toY, bounceT) - hop * Math.sin(Math.PI * bounceT),
    air: t > 0.08 && t < 0.92,
  };
}

function FootballBall() {
  return (
    <Image
      src="/football-soccer.png"
      alt=""
      width={14}
      height={14}
      className="navbar-mascot-ball-img"
      aria-hidden
      draggable={false}
    />
  );
}

/** Header logo mascots (original stack) + slow bouncing ball */
export function MascotFootballPlay({ className = "" }: { className?: string }) {
  const mounted = useMounted();
  const [ball, setBall] = useState<BallState>(defaultBall);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!mounted || reducedMotion.current) return;

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      setBall(computeBall(now - start));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  return (
    <div className={`navbar-mascots flex items-start pt-0.5 ${className}`} aria-hidden>
      <div
        className="navbar-mascot-ball"
        style={{
          left: `${ball.x * 100}%`,
          top: `${ball.y * 100}%`,
          zIndex: ball.air ? 30 : 5,
        }}
      >
        <FootballBall />
      </div>

      <div className="flex items-center -space-x-1.5 relative z-20">
        <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--wc-mexico-light)] border border-[var(--wc-mexico)]/15 overflow-hidden">
          <WC26MascotIcon id="zayu" size={26} />
        </div>
        <div className="relative z-20 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--wc-usa-light)] border border-[var(--wc-usa)]/15 shadow-sm overflow-hidden">
          <WC26MascotIcon id="clutch" size={30} />
        </div>
        <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--wc-canada-light)] border border-[var(--wc-canada)]/15 overflow-hidden">
          <WC26MascotIcon id="maple" size={26} />
        </div>
      </div>
    </div>
  );
}
