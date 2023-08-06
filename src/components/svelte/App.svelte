<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Heading, GradientButton, Toggle } from "flowbite-svelte";

  import Spinner from "@components/svelte/Spinner.svelte";

  // Firebase imports
  import { getFirebaseApp, getFirebaseDatabase } from "@utils/firebase";

  let unsubscribe: () => void;
  let matchState: "registering" | "waiting-to-start" | "waiting-for-bet" =
    "registering";
  let isSpicyBet = false;

  // Stores
  import { setMatchId } from "@stores/match";
  import {
    matchData,
    subscribeAll,
    registerPlayer,
    incrementRound,
  } from "@stores/firebase";

  // Get matchId from URL
  const params = new URLSearchParams(document.location.search);
  const matchId = params.get("match");
  console.log("Starting. Match id is:", matchId);
  setMatchId(matchId);

  // Get player ID from local storage
  import { playerId } from "@stores/player";
  import { match } from "ts-pattern";
  console.log("Player ID is:", $playerId);

  // Do on mount
  onMount(async () => {
    const firebaseApp = getFirebaseApp();
    console.log("Connected to firebase:", firebaseApp.options.databaseURL);
    const data = await getFirebaseDatabase(matchId);
    unsubscribe = subscribeAll();
    registerPlayer($playerId, data.players);
  });

  onDestroy(() => {
    unsubscribe();
  });

  const handleNextRound = () => {
    console.log("Incrementing round...");

    const randomBetterIndex = randomIndex(numberOfRegisteredPlayers);
    console.log("Random better index:", randomBetterIndex);

    incrementRound({ nextBetter: randomBetterIndex });
  };

  const doRoundChange = (roundNumber: number) => {
    match(roundNumber)
      .with(0, () => (matchState = "waiting-to-start"))
      .when(
        n => n > 0,
        () => {
          matchState = "waiting-for-bet";
        },
      );
  };

  $: numberOfRegisteredPlayers = $matchData?.players
    ? Object.keys($matchData.players).length
    : 0;
  $: playerInfo = $matchData?.players ? $matchData.players[$playerId] : null;
  $: console.log("Match datastore:", $matchData);
  $: doRoundChange($matchData?.roundNumber);
  $: console.log("Is spicy bet:", isSpicyBet);

  function randomIndex(n: number) {
    return Math.floor(Math.random() * n);
  }
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
    {:else if $matchData.roundNumber > 0}
      <Heading tag="h1" class="" size="text-5xl">
        Round {$matchData.roundNumber}
      </Heading>
      {#if $matchData.currentBetterIndex === playerInfo.index}
        <p class="dark:text-gray-400">It's your turn to bet!</p>
        <Toggle bind:checked={isSpicyBet} disabled={false}>
          <span>Spicy bet?!!?</span>
        </Toggle>
      {:else}
        <p class="dark:text-gray-400">
          Waiting for player {$matchData.currentBetterIndex + 1} to bet...
        </p>
      {/if}
    {:else if playerInfo}
      <Heading tag="h1" class="flex items-center mb-4" size="text-5xl">
        You are player {playerInfo.index + 1}
      </Heading>
      <GradientButton on:click={handleNextRound} color="purpleToBlue">
        Start match!
      </GradientButton>
    {:else}
      <Heading tag="h1" class="flex items-center" size="text-5xl">
        Match is full. Here's some spectator stats:
      </Heading>
      <p class="dark:text-gray-400">Match ID: {matchId}</p>
      <p>...add more here</p>
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
