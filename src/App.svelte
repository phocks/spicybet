<script lang="ts">
  import Box from "./lib/Box.svelte";
  import Player from "./lib/Player.svelte";
  import { generatePlayer, getDiff } from "./lib/utils";

  let matchRound = 1;

  let p1 = generatePlayer("Player 1");
  let p2 = generatePlayer("Player 2");
</script>

<main class="layout">
  <Box title={p1.name}>
    <Player />
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
  </Box>
  <Box title={p2.name}>
    <Player />
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
