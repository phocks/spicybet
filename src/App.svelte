<script lang="ts"></script>

<main class="layout">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
</main>

<style lang="scss">
  .layout {
    display: grid;
    grid-auto-flow: row;
    gap: 1rem;
  }

  .box {
    padding: 1rem;
    border: 2px solid #ccc;
    border-radius: 1rem;
  }

  @media (min-width: 55em) {
    .layout {
      grid-auto-flow: column;
    }
  }
</style>
