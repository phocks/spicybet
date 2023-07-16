import { initializeApp } from "firebase/app";
const firebaseConfig = {
  databaseURL:
    "https://spicybet-99ed9-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

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

export const getFirebaseApp = () => {
  const app = initializeApp(firebaseConfig);
  return app;
};
