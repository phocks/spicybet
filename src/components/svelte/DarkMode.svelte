<script lang="ts">
  import { DarkMode } from "flowbite-svelte";
</script>

<div class="dark-mode-selector">
  <DarkMode />
</div>

<style lang="scss">
  .dark-mode-selector {
    position: absolute;
    top: 0;
    right: 0;
    padding: 1rem;
  }
</style>
