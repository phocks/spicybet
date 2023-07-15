import { atom ,computed  } from "nanostores";
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

import { matchId } from "./matchId";

export const count = computed(matchId, matchId => {
  const db = getDatabase();

  const countRef = ref(db, `match/${matchId}/count`);
  
  onValue(countRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data);
    
  });
});


