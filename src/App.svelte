<script lang="ts">
  import Box from "./lib/Box.svelte";

  let matchRound = 0;
</script>

<main class="layout">
  <Box title="Player 1" />
  <Box title="Match stats">
    <div class="info">
      <div class="key">Round:</div>
      <div class="value">{matchRound}</div>
    </div>
  </Box>
  <Box title="Player 2" />
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

  .button {
    width: 100%;
  }
</style>
