<script lang="ts">
  import Box from "./lib/Box.svelte";
  import Player from "./lib/Player.svelte";
  import { generatePlayer, getDiff, getRandomInt } from "./lib/utils";

  let matchRound = 1;
  let turnIndex = getRandomInt(2);
  let isSpicy = false;

  let p1 = generatePlayer("Player 1");
  let p2 = generatePlayer("Player 2");

  function doNextRound() {
    matchRound++;
  }

  function toggleSpicy() {
    if (turnIndex === 0) {
      if (p1.spicyBetBalance === 0) return;
      p1.spicyBetBalance -= isSpicy ? -1 : 1;
      isSpicy = !isSpicy;
    } else {
      if (p2.spicyBetBalance === 0) return;
      p2.spicyBetBalance -= isSpicy ? -1 : 1;
      isSpicy = !isSpicy;
    }
  }
</script>

<div class="info-container">Let's get Spicy!!</div>
<main class="layout">
  <Box title={p1.name} isHighlighted={turnIndex === 0 ? true : false}>
    <Player player={p1} />
  </Box>

  <Box title="Match stats">
    <div class="info">
      <div class="key">Round:</div>
      <div class="value">{matchRound}</div>
    </div>
    <div class="info">
      <div class="key">Diff:</div>
      <div class="value">{getDiff(p1.score, p2.score)}</div>
    </div>
    <div class="info">
      <div class="key">Turn:</div>
      <div class="value">{turnIndex === 0 ? "p1" : "p2"}</div>
    </div>
  </Box>
  <Box title={p2.name} isHighlighted={turnIndex === 1 ? true : false}>
    <Player player={p2} />
  </Box>
</main>
<div class="controls">
  <button class={isSpicy ? "spicy" : "not-spicy"} on:click={toggleSpicy}>
    {isSpicy ? "Spice: 🌶️" : "Spice: 😔"}
  </button>
  <button on:click={doNextRound}>Next round</button>
</div>

<style lang="scss">
  .layout {
    display: grid;
    grid-auto-flow: row;
    gap: 1rem;
  }

  @media (min-width: 680px) {
    .layout {
      grid-auto-flow: column;
    }
  }

  .info {
    display: grid;
    grid-auto-flow: column;
    gap: 1rem;
  }

  .key {
    text-align: start;
  }

  .value {
    text-align: end;
  }

  .controls {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin-top: 1rem;
    min-width: 150px;
  }

  button {
    margin: 0 0.2rem;
  }

  .spicy {
    background-color: maroon;
  }

  .info-container {
    font-size: 1.2rem;
    text-align: center;
    margin: 1rem 0;
  }
</style>
