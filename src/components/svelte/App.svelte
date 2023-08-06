<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Heading } from "flowbite-svelte";

  import Spinner from "@components/svelte/Spinner.svelte";

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
  $: playerInfo = $matchData?.players ? $matchData.players[$playerId] : null;
  $: console.log("Match datastore:", $matchData);
</script>

<svelte:head>
  <title>Match: {matchId} // SpicyBet</title>
</svelte:head>

<div class="root">
  {#if $matchData}
    {#if numberOfRegisteredPlayers < 2}
      <Heading tag="h1" class="flex items-center" size="text-5xl">
        Waiting on other players: {2 - numberOfRegisteredPlayers}
      </Heading>
    {:else if playerInfo}
      <Heading tag="h1" class="flex items-center" size="text-5xl">
        You are player {playerInfo.index + 1}
      </Heading>
    {:else}
      <Heading tag="h1" class="flex items-center" size="text-5xl">
        Match is full. Here's some spectator stats:
      </Heading>
      <p class="my-2.5 dark:text-gray-400">Match ID: {matchId}</p>
    {/if}
  {:else}
    <Heading tag="h1" class="flex items-center" size="text-5xl">
      <Spinner />
    </Heading>
  {/if}
</div>

<style lang="scss">
  .root {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 16px;
  }
</style>
