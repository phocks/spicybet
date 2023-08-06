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

import type { Match, Players } from "@utils/firebase";
type ColorChoice = "red" | "blue" | "none";

const MAX_PLAYERS = 2;

export const matchData = atom<Match>(null);

// export const round = atom<number | null>(null);
// export const player1Guess = atom<ColorChoice>(null);
// export const player2Guess = atom<ColorChoice>(null);
// export const player1Score = atom<number>(0);
// export const player2Score = atom<number>(0);

export const subscribeAll = () => {
  const db = getDatabase();
  const unsubscribe = onValue(ref(db, `match/${matchId.get()}/`), snapshot => {
    const data = snapshot.val();
    matchData.set(data);
  });
  return unsubscribe;
};

function getOtherPlayerColor(color: ColorChoice) {
  return match(color)
    .with("red", () => "blue")
    .with("blue", () => "red")
    .with("none", () => "none")
    .exhaustive();
}

// export const choosePlayer1Color = async (color: ColorChoice) => {
//   const db = getDatabase();

//   const otherPlayerColor = getOtherPlayerColor(color);

//   await update(ref(db, `match/${matchId.get()}/`), {
//     player1Guess: color,
//     player2Guess: otherPlayerColor,
//   });
// };

// export const choosePlayer2Color = async (color: ColorChoice) => {
//   const db = getDatabase();

//   const otherPlayerColor = getOtherPlayerColor(color);

//   await update(ref(db, `match/${matchId.get()}/`), {
//     player2Guess: color,
//     player1Guess: otherPlayerColor,
//   });
// };

// export const incrementPlayer1Score = async () => {
//   const db = getDatabase();

//   await update(ref(db, `match/${matchId.get()}/`), {
//     player1Score: increment(1),
//   });
// };

// export const incrementPlayer2Score = async () => {
//   const db = getDatabase();

//   await update(ref(db, `match/${matchId.get()}/`), {
//     player2Score: increment(1),
//   });
// };

// export const incrementRound = async () => {
//   const db = getDatabase();

//   await update(ref(db, `match/${matchId.get()}/`), {
//     round: increment(1),
//     player1Guess: null,
//     player2Guess: null,
//   });
// };

export const registerPlayer = async (
  playerId: string,
  currentPlayers: Players
) => {
  // Check current config
  const getKeyCount = obj => Object.keys(obj).length;
  if (getKeyCount(currentPlayers) >= MAX_PLAYERS) return false;

  // Check if player already exists
  if (currentPlayers[playerId]) return false;

  const db = getDatabase();

  await update(ref(db, `match/${matchId.get()}/players`), {
    [playerId]: {
      index: getKeyCount(currentPlayers),
      playerId: playerId,
      score: 0,

    },
  });

  return true;
};
