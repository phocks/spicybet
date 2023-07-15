<script lang="ts">
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

  import { initializeApp } from "firebase/app";

  import { app } from "../stores/app";

  const firebaseConfig = {
    databaseURL:
      "https://spicybet-99ed9-default-rtdb.asia-southeast1.firebasedatabase.app/",
  };

  const appInit = initializeApp(firebaseConfig);
  app.set(appInit);

  function initMatch(matchId: string) {
    const db = getDatabase();

    set(ref(db, "match/" + matchId), {
      id: matchId,
      count: 0,
    });
  }

  // For now it's just the one match
  const matchId = "1";

  const dbRef = ref(getDatabase());

  get(child(dbRef, `match/${matchId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log("Data exists. All is well...");
        console.log(snapshot.val());
      } else {
        console.log("Data not there, creating...");
        initMatch("1");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  // function updateCount() {
  //   const db = getDatabase();

  //   update(ref(db, "match/1/"), {
  //     count: 3,
  //   });
  // }

  // updateCount();

  // function addStar(uid, key) {
  //   // import { getDatabase, increment, ref, update } from "firebase/database";
  //   const dbRef = ref(getDatabase());

  //   const updates = {};
  //   updates[`posts/${key}/stars/${uid}`] = true;
  //   updates[`posts/${key}/starCount`] = increment(1);
  //   updates[`user-posts/${key}/stars/${uid}`] = true;
  //   updates[`user-posts/${key}/starCount`] = increment(1);
  //   update(dbRef, updates);
  // }

  // addStar("1", "1");

  // const db = getDatabase();

  // const countRef = ref(db, "match/1/count");

  // onValue(countRef, (snapshot) => {
  //   const data = snapshot.val();
  //   console.log(data);
  // });

  // function writeNewPost(uid, username, picture, title, body) {
  //   const db = getDatabase();

  //   // A post entry.
  //   const postData = {
  //     author: username,
  //     uid: uid,
  //     body: body,
  //     title: title,
  //     starCount: 0,
  //     authorPic: picture,
  //   };

  //   // Get a key for a new Post.
  //   const newPostKey = push(child(ref(db), "posts")).key;

  //   // Write the new post's data simultaneously in the posts list and the user's post list.
  //   const updates = {};
  //   updates["/posts/" + newPostKey] = postData;
  //   updates["/user-posts/" + uid + "/" + newPostKey] = postData;

  //   return update(ref(db), updates);
  // }

  // writeNewPost(
  //   "1",
  //   "SpicyBet",
  //   "https://spicybet.com/favicon.ico",
  //   "Hello World",
  //   "Hello World"
  // );
</script>

<div />
