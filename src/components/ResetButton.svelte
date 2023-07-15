<script lang="ts">
  import {
    getDatabase,
    ref,
    get,
    set,
    onValue,
    child,
    push,
    update,
    increment,
  } from "firebase/database";

  const handleClick = () => {
    resetCount();
  };

  function resetCount() {
    const dbRef = ref(getDatabase());

    const updates = {};
    updates[`match/1/count`] = 0;
    update(dbRef, updates);
  }
</script>

<button on:click={handleClick}>Reset</button>

<style lang="scss">
  button {
    font-size: 2rem;
    font-weight: bold;
    color: #fff;
    background-color: #000;
    padding: 1rem;
    border-radius: 0.5rem;
    border: none;
  }
</style>
