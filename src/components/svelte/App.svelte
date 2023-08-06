<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Heading } from "flowbite-svelte";

  // Firebase imports
  import { getFirebaseApp, getFirebaseDatabase } from "@utils/firebase";

  let unsubscribe: () => void;
  let matchState: "registration" = "registration";

  // Stores
  import { setMatchId } from "@stores/match";
  import { matchData, subscribeAll, registerPlayer } from "@stores/firebase";

  // Get matchId from URL
  const params = new URLSearchParams(document.location.search);
  const matchId = params.get("match");
  console.log("Starting. Match id is:", matchId);
  setMatchId(matchId);

  // Get player ID from local storage
  import { playerId } from "@stores/player";
  console.log("Player ID is:", $playerId);

  // Do on mount
  onMount(async () => {
    const firebaseApp = getFirebaseApp();
    console.log("Connected to firebase:", firebaseApp.options.databaseURL);
    const data = await getFirebaseDatabase(matchId);
    console.log(Object.keys(data.players).length);
    unsubscribe = subscribeAll();
    registerPlayer($playerId, data.players);
  });

  onDestroy(() => {
    unsubscribe();
  });

  $: numberOfRegisteredPlayers = $matchData?.players
    ? Object.keys($matchData.players).length
    : 0;
  $: console.log("Match datastore:", $matchData);
</script>

<svelte:head>
  <title>Match: {matchId} // SpicyBet</title>
</svelte:head>

<div class="root">
  {#if $matchData}
    {#if numberOfRegisteredPlayers < 2}
      <Heading tag="h1" class="flex items-center" size="text-5xl">
        Waiting on other players: {numberOfRegisteredPlayers}
      </Heading>
    {:else}
      <Heading tag="h1" class="flex items-center" size="text-5xl">
        Ready to play!
      </Heading>
    {/if}
  {/if}
</div>

<style lang="scss">
  .root {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
</style>
