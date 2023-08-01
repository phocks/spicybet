<script lang="ts">
  import { Heading, Badge } from "flowbite-svelte";

  const params = new URLSearchParams(document.location.search);
  const matchId = params.get("match");
  console.log("Starting. Match id is:", matchId);
</script>

<!-- <div class="text-base dark:text-white">Welcome...</div>
 -->
<div class="root">
<Heading tag="h1" class="flex items-center" size="text-5xl">Welcome</Heading>
</div>

<style lang="scss">
  .root {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100dvh;
  }
</style>