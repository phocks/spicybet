<script lang="ts">
  // Props
  export let matchId: string;

  // Imports
  import { onMount, onDestroy } from "svelte";

  // Local Imports
  import { getFirebaseApp, getFirebaseDatabase } from "@utils/firebase";
  import {
    round,
    player1Guess,
    player2Guess,
    subscribeAll,
    choosePlayer1Color,
    choosePlayer2Color,
  } from "@stores/firebase";

  // State

  function nullDash(value: number | string | null) {
    return value === null ? "-" : value;
  }

  onMount(async () => {
    console.log("mounted");
    const firebaseApp = getFirebaseApp();
    const data = await getFirebaseDatabase(matchId);
    console.log(data);
    subscribeAll(matchId);
  });

  function processWin(winner: string) {
    console.log("processWin", winner);

    if (winner === "red") {
      if ($player1Guess === "red") {
        console.log("player 1 wins");
      } else {
        console.log("player 2 wins");
      }
    } else {
      if ($player2Guess === "blue") {
        console.log("player 2 wins");
      } else {
        console.log("player 1 wins");
      }
    }
  }
</script>

<div>
  <h2>Round {nullDash($round)}</h2>
  <h3>Player 1 choice: {$player1Guess}</h3>
  <button class="choose-red" on:click={() => choosePlayer1Color(matchId, "red")}
    >Choose red</button
  >
  <button
    class="choose-blue"
    on:click={() => choosePlayer1Color(matchId, "blue")}>Choose blue</button
  >
  <h3>Player 2 choice: {$player2Guess}</h3>
  <button
    class="choose-red"
    on:click={() => choosePlayer2Color(matchId, "red")}
  >
    Choose red
  </button>
  <button
    class="choose-blue"
    on:click={() => choosePlayer2Color(matchId, "blue")}>Choose blue</button
  >
  <h3>Who won?</h3>
  <button on:click={() => processWin("red")}>Red</button>
  <button on:click={() => processWin("blue")}>Blue</button>
</div>

<style lang="scss">
  .choose-red {
    background-color: red;
  }

  .choose-blue {
    background-color: lightblue;
  }
</style>
