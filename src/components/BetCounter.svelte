<script lang="ts">
  let count: number = 0;

  const handleClick = () => {
    count = count + 1;
  };
</script>

<button on:click={handleClick}>{count}</button>

<style lang="scss">
  button {
    margin-top: 2rem;
    font-size: 2rem;
    font-weight: bold;
    color: #fff;
    background-color: #000;
    padding: 1rem;
    border-radius: 0.5rem;
    border: none;
  }
</style>
