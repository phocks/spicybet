import { initializeApp } from "firebase/app";
import wrap from "await-to-js";
import { match, P } from "ts-pattern";

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
interface Match {
  id: string;
  round: number;
  player1Id: string | null;
  player2Id: string | null;
  player1Guess: "red" | "blue" | null;
  player2Guess: "red" | "blue" | null;
  player1Score: number;
  player2Score: number;
}

function getInitialData(matchId: string): Match {
  const initialData: Match = {
    id: matchId,
    round: 1,
    player1Id: null,
    player2Id: null,
    player1Guess: null,
    player2Guess: null,
    player1Score: 0,
    player2Score: 0,
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

  if (!error) console.log("Initial data created");
  else console.log("Error creating initial data", error);
};

export const getFirebaseDatabase = async (matchId) => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `match/${matchId}`));

  if (snapshot.exists()) {
    console.log("Data exists. Checking if consistent...");
    const matchData = snapshot.val();
    console.log("matchData", matchData);
    await match(matchData)
      .with(
        {
          id: P.string,
          round: P.number,
          player1Id: P.optional(P.string),
          player2Id: P.optional(P.string),
          player1Guess: P.optional(P.string),
          player2Guess: P.optional(P.string),
          player1Score: P.number,
          player2Score: P.number,
        },
        (data) => {
          console.log("Data is consistent");
          return data;
        }
      )
      .otherwise(async (data) => {
        console.log("Data is inconsistent, updating...");
        await resetWithInitialData(matchId);
        return data;
      });

    return matchData;
  } else {
    console.log("Data not there, creating...");
    await resetWithInitialData(matchId);
    return getInitialData(matchId);
  }
};

export const resetMatch = async (matchId: string) => {
  resetWithInitialData(matchId);
};
