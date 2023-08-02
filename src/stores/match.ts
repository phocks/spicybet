import { atom } from "nanostores";

export const matchId = atom<string | null>(null);

export const setMatchId = matchId.set;
