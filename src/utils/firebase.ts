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
  matchId: string;
  roundNumber: number;
}

function getInitialData(matchId: string): Match {
  const initialData: Match = {
    id: matchId,
    round: 1,
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
};

export const getFirebaseDatabase = async (matchId) => {
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
