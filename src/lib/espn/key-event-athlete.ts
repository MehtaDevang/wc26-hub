import type { EspnKeyEvent } from "./client";

/** ESPN puts the player on `participants` for cards/subs; goals may use `athlete`. */
export function getKeyEventAthlete(
  event: EspnKeyEvent
): NonNullable<EspnKeyEvent["athlete"]> | undefined {
  if (event.athlete?.displayName) return event.athlete;
  const fromParticipant = event.participants?.find((p) => p.athlete?.displayName)?.athlete;
  if (!fromParticipant?.displayName) return undefined;
  return {
    id: fromParticipant.id ?? fromParticipant.displayName,
    displayName: fromParticipant.displayName,
  };
}
