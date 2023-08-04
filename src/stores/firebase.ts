import { atom, map } from "nanostores";
import {
  getDatabase,
  ref,
  get,
  set,
  onValue,
  child,
  push,
  update,
  increment,
} from "firebase/database";
import { match, P } from "ts-pattern";

import { matchId } from "./match";

import type { Match } from "@utils/firebase";
type ColorChoice = "red" | "blue" | "none";

export const matchData = atom<Match>(null);

export const round = atom<number | null>(null);
export const player1Guess = atom<ColorChoice>(null);
export const player2Guess = atom<ColorChoice>(null);
export const player1Score = atom<number>(0);
export const player2Score = atom<number>(0);

export const subscribeAll = () => {
  const db = getDatabase();
  const unsubscribe = onValue(
    ref(db, `match/${matchId.get()}/`),
    (snapshot) => {
      const data = snapshot.val();

      // Using a single map now I think 
      matchData.set(data);

      round.set(data.round);
      player1Guess.set(data.player1Guess ? data.player1Guess : null);
      player2Guess.set(data.player2Guess ? data.player2Guess : null);
      player1Score.set(data.player1Score);
      player2Score.set(data.player2Score);
    }
  );
};

function getOtherPlayerColor(color: ColorChoice) {
  return match(color)
    .with("red", () => "blue")
    .with("blue", () => "red")
    .with("none", () => "none")
    .exhaustive();
}

export const choosePlayer1Color = async (color: ColorChoice) => {
  const db = getDatabase();

  const otherPlayerColor = getOtherPlayerColor(color);

  update(ref(db, `match/${matchId.get()}/`), {
    player1Guess: color,
    player2Guess: otherPlayerColor,
  });
};

export const choosePlayer2Color = async (color: ColorChoice) => {
  const db = getDatabase();

  const otherPlayerColor = getOtherPlayerColor(color);

  update(ref(db, `match/${matchId.get()}/`), {
    player2Guess: color,
    player1Guess: otherPlayerColor,
  });
};

export const incrementPlayer1Score = async () => {
  const db = getDatabase();

  update(ref(db, `match/${matchId.get()}/`), {
    player1Score: increment(1),
  });
};

export const incrementPlayer2Score = async () => {
  const db = getDatabase();

  update(ref(db, `match/${matchId.get()}/`), {
    player2Score: increment(1),
  });
};

export const incrementRound = async () => {
  const db = getDatabase();

  update(ref(db, `match/${matchId.get()}/`), {
    round: increment(1),
    player1Guess: null,
    player2Guess: null,
  });
};
