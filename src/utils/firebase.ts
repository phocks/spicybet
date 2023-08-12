import { initializeApp } from "firebase/app";
import wrap from "await-to-js";
import { match, P } from "ts-pattern";

// Use Day.js for time calculations
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
console.log(dayjs.utc().format());

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

// Types
export type Match = {
  matchId: string;
  roundNumber: number;
  createdTime: string;
  currentBetterIndex: number;
  isSpicy: boolean;
  players: Players;
};

export type Player = {
  index: number;
  playerId: string;
  score: number;
  spicyBetBalance: number;
  currentBetColor: "blue" | "red" | "none";
  betAmount: number;
};

export interface Players {
  [playerId: string]: Player;
}

function getInitialData(matchId: string): Match {
  const initialData: Match = {
    matchId: matchId,
    roundNumber: 0,
    createdTime: dayjs.utc().format(),
    currentBetterIndex: 0,
    isSpicy: false,
    players: {},
  };

  return initialData;
}

// Config
const firebaseConfig = {
  databaseURL:
    "https://spicybet-99ed9-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

export const getFirebaseApp = () => {
  const app = initializeApp(firebaseConfig);
  return app;
};

const resetWithInitialData = async (matchId: string) => {
  const db = getDatabase();

  const initialData = getInitialData(matchId);

  const [error, result] = await wrap(
    set(ref(db, "match/" + matchId), initialData)
  );

  if (!error) console.log("Initial data set on Firebase:", initialData);
  else console.log("Error creating initial data", error);

  return initialData;
};

export const getFirebaseDatabase = async (matchId): Promise<Match> => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `match/${matchId}`));

  if (snapshot.exists()) {
    console.log("Data exists. Checking if consistent...");
    const matchData = snapshot.val();
    console.log("matchData", matchData);
    const confirmedData = await match(matchData)
      .with(
        {
          matchId: P.string,
          roundNumber: P.number,
          createdTime: P.string,
          currentBetterIndex: P.number,
          isSpicy: P.boolean,
          players: {},
        },
        data => {
          console.log("Data is consistent");
          return data;
        }
      )
      .otherwise(async data => {
        console.log("Data is inconsistent, updating...");
        const initialData = await resetWithInitialData(matchId);
        return initialData;
      });

    return confirmedData;
  } else {
    console.log("Data not there, creating...");
    await resetWithInitialData(matchId);
    return getInitialData(matchId);
  }
};

export const resetMatch = async (matchId: string) => {
  resetWithInitialData(matchId);
};
