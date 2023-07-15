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

export const firebaseApp = async () => {
  const db = getDatabase();
  console.log(db);

  return db;
};
