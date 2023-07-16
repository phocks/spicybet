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
export const player1Guess = atom<ColorChoice>("none");
export const player2Guess = atom<ColorChoice>("none");

export const subscribeAll = (matchId: string) => {
  const db = getDatabase();
  const unsubscribe = onValue(ref(db, `match/${matchId}/`), (snapshot) => {
    round.set(snapshot.val().round);
    player1Guess.set(snapshot.val().player1Guess);
    player2Guess.set(snapshot.val().player2Guess);
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
