<script lang="ts">
  export let title: string;
  export let isHighlighted: boolean = false;
</script>

<div class="box {isHighlighted ? 'is-highlighted' : ''}">
  <h1>{title}</h1>
  <div class="layout">
    <slot />
  </div>
</div>

<style lang="scss">
  .box {
    background-color: #333;
    padding: 1rem;
    border: 2px solid #393939;
    border-radius: 0.8rem;
    min-width: 150px;
  }

  .is-highlighted {
    border-color: #bbb;
  }

  h1 {
    font-size: 1.1rem;
    margin: 0 0 1em 0;
    font-weight: 700;
  }
</style>
