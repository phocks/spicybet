<script lang="ts">
  // Props
  export let matchId: string;

  // Imports
  import { onMount, onDestroy } from "svelte";
  import { match } from "ts-pattern";

  // Local Imports
  import {
    getFirebaseApp,
    getFirebaseDatabase,
    resetMatch,
  } from "@utils/firebase";
  import { nullDash } from "@lib/helpers";

  import { playerId } from "@stores/player";
  console.log("playerId", $playerId);

  // Stores
  import {
    round,
    player1Guess,
    player2Guess,
    subscribeAll,
    choosePlayer1Color,
    choosePlayer2Color,
    incrementPlayer1Score,
    incrementPlayer2Score,
    player1Score,
    player2Score,
    incrementRound,
  } from "@stores/firebase";
  import { setMatchId } from "@stores/match";

  // State
  let databaseReady: boolean = false;

  onMount(async () => {
    setMatchId(matchId);
    const firebaseApp = getFirebaseApp();
    console.log("firebaseApp", firebaseApp);
    const data = await getFirebaseDatabase(matchId);
    console.log(data);
    databaseReady = true;
    subscribeAll();
  });

  type Winner = "player1" | "player2" | "tie";

  function whichPlayer(winner): Winner {
    if ($player1Guess === $player2Guess) {
      return "tie";
    } else if (winner === "red") {
      if ($player1Guess === "red") {
        return "player1";
      } else if ($player2Guess === "red") {
        return "player2";
      }
    } else {
      if ($player2Guess === "blue") {
        return "player2";
      } else if ($player1Guess === "blue") {
        return "player1";
      }
    }
  }

  function processWin(winner: string) {
    console.log("processWin", winner);

    const winningPlayer = whichPlayer(winner);

    match(winningPlayer)
      .with("player1", () => {
        incrementPlayer1Score();
      })
      .with("player2", () => {
        incrementPlayer2Score();
      })
      .with("tie", () => {
        console.log("tie");
      })
      .exhaustive();

    incrementRound();
  }
</script>

<div>
  <h2>Round {nullDash($round)}</h2>
  <h3>Player 1 choice: {$player1Guess}</h3>
  <button class="choose-red" on:click={() => choosePlayer1Color("red")}
    >Choose red</button
  >
  <button class="choose-blue" on:click={() => choosePlayer1Color("blue")}
    >Choose blue</button
  >
  <h3>Player 2 choice: {$player2Guess}</h3>
  <button class="choose-red" on:click={() => choosePlayer2Color("red")}>
    Choose red
  </button>
  <button class="choose-blue" on:click={() => choosePlayer2Color("blue")}
    >Choose blue</button
  >
  <h3>Who won?</h3>
  <button on:click={() => processWin("red")}>Red</button>
  <button on:click={() => processWin("blue")}>Blue</button>

  <h3>Player 1 score: {$player1Score}</h3>
  <h3>Player 2 score: {$player2Score}</h3>

  <button on:click={() => resetMatch(matchId)}>Reset</button>
</div>

<style lang="scss">
  .choose-red {
    background-color: red;
  }

  .choose-blue {
    background-color: lightblue;
  }
</style>
