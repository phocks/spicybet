<script lang="ts">
  let name: string;
  let score: number = 0;
  let spicyBetBalance: number = 3;

  export const incrementScore = () => {
    score++;
    spicyBetBalance--;
  };
</script>

<div class="info">
  <div class="key">Score:</div>
  <div class="value">{score}</div>
</div>
<div class="info">
  <div class="key">SpicyBalance:</div>
  <div class="value">{spicyBetBalance}</div>
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
