<script lang="ts">
  import type { Player } from "./types";

  export let player: Player;
</script>

<div class="info">
  <div class="key">Score:</div>
  <div class="value">{player.score}</div>
</div>
<div class="info">
  <div class="key">SpicyBalance:</div>
  <div class="value">{player.spicyBetBalance}</div>
</div>

<style lang="scss">
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
</style>
