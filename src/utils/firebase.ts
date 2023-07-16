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

// Config
const firebaseConfig = {
  databaseURL:
    "https://spicybet-99ed9-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

export const getFirebaseApp = () => {
  const app = initializeApp(firebaseConfig);
  return app;
};

export const getFirebaseDatabase = async (matchId) => {
  const initialData = {
    id: matchId,
    round: 1,
  };

  const createInitialData = async (matchId: string) => {
    const db = getDatabase();

    const [error, result] = await wrap(
      set(ref(db, "match/" + matchId), initialData)
    );

    if (!error) console.log("Initial data created");
    else console.log("Error creating initial data", error);
  };

  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `match/${matchId}`));

  if (snapshot.exists()) {
    console.log("Data exists. Checking if consistent...");
    const matchData = snapshot.val();
    match(matchData)
      .with({ id: P.string, round: P.number }, () => {
        console.log("Data is consistent");
      })
      .otherwise(async () => {
        console.log("Data is inconsistent, updating...");
        await createInitialData(matchId);
      });

    return matchData;
  } else {
    console.log("Data not there, creating...");
    await createInitialData(matchId);
    return initialData;
  }
};
