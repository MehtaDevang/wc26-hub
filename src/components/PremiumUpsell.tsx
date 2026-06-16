"use client";

import { X, Crown, Zap } from "lucide-react";
import { setPremium } from "@/lib/storage";

interface PremiumUpsellProps {
  onClose: () => void;
  feature?: string;
}

export function PremiumUpsell({ onClose, feature = "Premium features" }: PremiumUpsellProps) {
  function handleUpgrade() {
    setPremium(true);
    onClose();
    alert("🎉 Premium activated! (Demo mode - integrate Stripe for real payments)");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl card-elevated border border-amber-200 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <Crown className="text-amber-600" size={22} />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">Go Premium</h2>
        </div>

        <p className="text-zinc-500 text-sm mb-6">
          Unlock {feature} and maximize your World Cup experience.
        </p>

        <ul className="space-y-3 mb-6">
          {[
            "Ad-free experience",
            "Extra daily player guesses",
            "Exclusive puzzle archives",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-zinc-700">
              <Zap size={14} className="text-amber-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold text-amber-600">$4.99</span>
          <span className="text-zinc-400 text-sm">/ tournament</span>
        </div>

        <button onClick={handleUpgrade} className="btn-gold w-full py-3">
          Upgrade Now
        </button>

        <p className="text-center text-xs text-zinc-400 mt-3">
          One-time payment for the entire 2026 World Cup
        </p>
      </div>
    </div>
  );
}
