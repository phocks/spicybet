import { initializeApp } from "firebase/app";

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
  const createInitialData = async (matchId: string) => {
    const db = getDatabase();

    const result = await set(ref(db, "match/" + matchId), {
      id: matchId,
    });

    console.log("Initial data created", result);
  };

  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `match/${matchId}`));

  if (snapshot.exists()) {
    console.log("Data exists. All is well...");
    console.log(snapshot.val());
  } else {
    console.log("Data not there, creating...");
    await createInitialData(matchId);
  }
};
