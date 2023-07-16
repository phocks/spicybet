<script lang="ts">
  // import { count } from "../stores/count";
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
  import { onMount, onDestroy } from "svelte";
  import { getFirebaseApp } from "@utils/firebase";

  const app = getFirebaseApp();

  let count: number | null = null;
  let unsubscribe: () => void = () => {};

  // import { app } from "../stores/app";

  // const init = () => {
  //   const db = getDatabase();

  //   unsubscribe = onValue(ref(db, "match/1/count"), (snapshot) => {
  //     console.log("Data changed!", snapshot.val());
  //     count = snapshot.val();
  //   });
  // };

  // $: if ($app != null) init();

  const handleClick = () => {
    addCount();
  };

  function addCount() {
    const dbRef = ref(getDatabase(app));

    const updates = {};
    updates[`match/1/count`] = increment(1);
    update(dbRef, updates);
  }

  onMount(() => {
    const db = getDatabase(app);
    unsubscribe = onValue(ref(db, "match/1/count"), (snapshot) => {
      console.log("Data changed!", snapshot.val());
      count = snapshot.val();
    });
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<button on:click={handleClick}>{count === null ? "-" : count}</button>

<style lang="scss">
  button {
    // margin-top: 2rem;
    font-size: 2rem;
    font-weight: bold;
    color: #fff;
    background-color: #000;
    padding: 1rem;
    border-radius: 0.5rem;
    border: none;
  }
</style>
