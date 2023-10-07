<script lang="ts"></script>

<main class="layout">
  <div class="box">
    <h1>Player 1</h1>
  </div>
  <div class="box">
    <h1>Match stats</h1>
  </div>
  <div class="box">
    <h1>Player 2</h1>
  </div>
</main>

<style lang="scss">
  .layout {
    display: grid;
    grid-auto-flow: row;
    gap: 1rem;
  }

  .box {
    background-color: #333;
    padding: 1rem;
    border: 2px solid #ccc;
    border-radius: 1rem;
  }

  h1 {
    color: #fff;
    font-size: 1.5rem;
    margin: 0;
  }

  @media (min-width: 55em) {
    .layout {
      grid-auto-flow: column;
    }
  }
</style>
