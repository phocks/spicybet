<script lang="ts">
  import { onMount } from "svelte";
  import { Heading, Badge } from "flowbite-svelte";

  const params = new URLSearchParams(document.location.search);
  const matchId = params.get("match");
  console.log("Starting. Match id is:", matchId);

  // Get player ID
  import { playerId } from "@stores/player";
  console.log("Player ID is:", $playerId);

  // Firebase imports
  import {
    getFirebaseApp,
    getFirebaseDatabase,
    resetMatch,
  } from "@utils/firebase";

  // Do on mount
  onMount(async () => {
    const firebaseApp = getFirebaseApp();
    console.log("Connected to firebase:", firebaseApp.options.databaseURL);
    const data = await getFirebaseDatabase(matchId);
    console.log("App data:", data);
  });
</script>

<svelte:head>
  <title>Match: {matchId} // SpicyBet</title>
</svelte:head>

<div class="root">
  <Heading tag="h1" class="flex items-center" size="text-5xl">Welcome</Heading>
</div>

<style lang="scss">
  .root {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
