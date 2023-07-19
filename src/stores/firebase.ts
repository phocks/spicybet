import { atom } from "nanostores";
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

type ColorChoice = "red" | "blue" | "none";

export const round = atom<number | null>(null);
export const player1Guess = atom<ColorChoice>(null);
export const player2Guess = atom<ColorChoice>(null);
export const player1Score = atom<number>(0);
export const player2Score = atom<number>(0);

export const subscribeAll = (matchId: string) => {
  const db = getDatabase();
  const unsubscribe = onValue(ref(db, `match/${matchId}/`), (snapshot) => {
    const data = snapshot.val();
    round.set(data.round);
    player1Guess.set(data.player1Guess ? data.player1Guess : null);
    player2Guess.set(data.player2Guess ? data.player2Guess : null);
    player1Score.set(data.player1Score);
    player2Score.set(data.player2Score);
  });
};

function getOtherPlayerColor(color: ColorChoice) {
  return match(color)
    .with("red", () => "blue")
    .with("blue", () => "red")
    .with("none", () => "none")
    .exhaustive();
}

export const choosePlayer1Color = async (
  matchId: string,
  color: ColorChoice
) => {
  const db = getDatabase();

  const otherPlayerColor = getOtherPlayerColor(color);

  update(ref(db, `match/${matchId}/`), {
    player1Guess: color,
    player2Guess: otherPlayerColor,
  });
};

export const choosePlayer2Color = async (
  matchId: string,
  color: ColorChoice
) => {
  const db = getDatabase();

  const otherPlayerColor = getOtherPlayerColor(color);

  update(ref(db, `match/${matchId}/`), {
    player2Guess: color,
    player1Guess: otherPlayerColor,
  });
};

export const incrementPlayer1Score = async (matchId: string) => {
  const db = getDatabase();

  update(ref(db, `match/${matchId}/`), {
    player1Score: increment(1),
  });
};

export const incrementPlayer2Score = async (matchId: string) => {
  const db = getDatabase();

  update(ref(db, `match/${matchId}/`), {
    player2Score: increment(1),
  });
};

export const incrementRound = async (matchId: string) => {
  const db = getDatabase();

  update(ref(db, `match/${matchId}/`), {
    round: increment(1),
    player1Guess: null,
    player2Guess: null,
  });
};
