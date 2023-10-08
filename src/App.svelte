<script lang="ts">
  import Box from "./lib/Box.svelte";
  import Player from "./lib/Player.svelte";
  import { generatePlayer } from "./lib/utils";

  let matchRound = 1;

  let player1 = generatePlayer("Player 1");
  let player2 = generatePlayer("Player 2");
</script>

<main class="layout">
  <Box title={player1.name}>
    <Player player={player1} />
  </Box>

  <Box title="Match stats">
    <div class="info">
      <div class="key">Round:</div>
      <div class="value">{matchRound}</div>
    </div>
  </Box>
  <Box title={player2.name}>
    <Player player={player1} />
  </Box>
</main>
<div class="controls">
  <button on:click={() => matchRound++}>Next round</button>
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
    /* font-weight: bold; */
    text-align: start;
  }

  .value {
    text-align: end;
  }

  .controls {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    min-width: 150px;
  }
</style>
