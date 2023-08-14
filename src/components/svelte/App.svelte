<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Heading, GradientButton, Toggle } from "flowbite-svelte";

  import Spinner from "@components/svelte/Spinner.svelte";

  // Firebase imports
  import { getFirebaseApp, getFirebaseDatabase } from "@utils/firebase";

  const NUMBER_OF_PLAYERS = 2;

  let isLoading = true;
  let isWaitingForPlayers = true;
  let isSpectator = true;
  let isWaitingToStartMatch = true;
  let isWaitingForOtherBets = true;
  let isYetToLockInBet = true;
  let isWaitingOnResult = true;

  let howManyHaveBet = 0;

  let unsubscribe: () => void;
  let matchState: "loading";
  let isSpicyBet = false;
  let betChoice: "blue" | "red" | "none" = "none";

  // Stores
  import { setMatchId } from "@stores/match";
  import {
    matchData,
    subscribeAll,
    registerPlayer,
    incrementRound,
    submitBet,
    setSpicy,
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

  onMount(async () => {
    const firebaseApp = getFirebaseApp();
    console.log("Connected to firebase:", firebaseApp.options.databaseURL);
    const data = await getFirebaseDatabase(matchId);
    unsubscribe = subscribeAll();

    // When registering players at the same time this can cause
    // two players to be registered with the same index.
    // TODO: Fix.
    registerPlayer($playerId, data.players);
    isSpicyBet = data.isSpicy;
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

  const handleChooseSide = ({ betColor }: { betColor: "blue" | "red" }) => {
    betChoice = betColor;
    submitBet({ betColor: betChoice, playerId: $playerId });
    isYetToLockInBet = false;
  };

  // const handleLockInBet = () => {
  //   console.log("Locking in bet...");
  //   submitBet({ betColor: betChoice, playerId: $playerId });
  //   isYetToLockInBet = false;
  // };

  // const doRoundChange = (roundNumber: number) => {
  //   match(roundNumber)
  //     .with(0, () => (matchState = "waiting-to-start"))
  //     .when(
  //       n => n > 0,
  //       () => {
  //         matchState = "waiting-for-bet";
  //       }
  //     );
  // };

  // const reactToSpicyChange = async (isSpicy: boolean) => {
  //   if (isLoading) return;
  //   if (isSpicy) await setSpicy(true);
  //   else await setSpicy(false);
  // };

  const reactToMatchDataChange = (matchData: any) => {
    if (isLoading) return;

    if (matchData.isSpicy) {
      console.log("Match is spicy!");
      isSpicyBet = true;
    } else {
      console.log("Match is not spicy!");
      isSpicyBet = false;
    }
  };

  $: numberOfRegisteredPlayers = $matchData?.players
    ? Object.keys($matchData.players).length
    : 0;
  $: playerInfo = $matchData?.players ? $matchData.players[$playerId] : null;
  $: console.log("Match datastore:", $matchData);
  $: howManyHaveBet = $matchData?.players
    ? Object.keys($matchData.players).filter(
        id => $matchData.players[id].currentBetColor !== "none"
      ).length
    : 0;

  // $: isNotMyTurn =
  //   $matchData?.currentBetterIndex !== playerInfo?.index ||
  //   howManyHaveBet < numberOfRegisteredPlayers - 1;
  $: isMyTurnFirst = $matchData?.currentBetterIndex === playerInfo?.index;

  $: console.log("How many have bet:", howManyHaveBet);

  // $: outOfSpicyBets = playerInfo?.spicyBetBalance > 0;
  // $: doRoundChange($matchData?.roundNumber);
  // $: isSpicyBet = $matchData.isSpicy;
  // $: {
  //   console.log("Is spicy bet:", isSpicyBet);
  //   reactToSpicyChange(isSpicyBet);
  // }
  $: reactToMatchDataChange($matchData);

  // View logic
  $: isLoading = !$matchData;
  $: isWaitingForPlayers = numberOfRegisteredPlayers < NUMBER_OF_PLAYERS;
  $: isSpectator = !playerInfo;
  $: isWaitingToStartMatch = $matchData?.roundNumber === 0;
  $: console.log("playerinfo:", playerInfo);

  function randomIndex(n: number) {
    return Math.floor(Math.random() * n);
  }

  function getOpponentData(players) {
    const playerIds = Object.keys(players);
    const opponentId = playerIds.find(id => id !== $playerId);
    return players[opponentId];
  }

  function findPlayerByIndex(players, index) {
    const playerIds = Object.keys(players);
    const playerId = playerIds.find(id => players[id].index === index);
    return players[playerId];
  }
</script>

<svelte:head>
  <title>Match: {matchId} // SpicyBet</title>
</svelte:head>

<div class="root">
  {#if isLoading}
    <Heading tag="h1" class="flex items-center" size="text-5xl">
      <Spinner />
    </Heading>
  {:else if isWaitingForPlayers}
    <Heading tag="h1" class="flex items-center" size="text-5xl">
      Waiting on other players: {2 - numberOfRegisteredPlayers}
    </Heading>
  {:else if isSpectator}
    <Heading tag="h1" class="flex items-center" size="text-5xl">
      Match is full. You are a spectator.
    </Heading>
    <p class="dark:text-gray-400">Match ID: {matchId}</p>
    <p class="dark:text-gray-400">...more to come</p>
  {:else if isWaitingToStartMatch}
    <Heading tag="h1" class="flex items-center mb-4" size="text-5xl">
      You are player {playerInfo?.index + 1}
    </Heading>
    <GradientButton on:click={handleNextRound} color="purpleToBlue">
      Start match!
    </GradientButton>
  {:else if isMyTurnFirst && isYetToLockInBet}
    <!-- {:else if isNotMyTurn}
    <Heading tag="h1" class="flex items-center mb-4" size="text-5xl">
      Waiting on other bets...
    </Heading>
  {:else if isYetToLockInBet} -->
    <!-- <Toggle bind:checked={isSpicyBet} disabled={outOfSpicyBets ? false : true}>
      {isSpicyBet ? "SPICY BET!!! (3)" : "Normal bet (1)"}
    </Toggle> -->
    {#if howManyHaveBet === 0}
      <div class="bet-buttons">
        <span>
          <GradientButton
            on:click={() => handleChooseSide({ betColor: "blue" })}
            color="blue"
          >
            Blue
          </GradientButton>
        </span>
        <span>
          <GradientButton
            on:click={() => handleChooseSide({ betColor: "red" })}
            color="red"
          >
            Red
          </GradientButton>
        </span>
      </div>
    {:else}
      <Heading tag="h1" class="flex items-center mb-4" size="text-5xl">
        Waiting on other bets...
      </Heading>
    {/if}

    <!-- <div class="pre-bet-choice">
      <p class="dark:text-gray-400 mb-0">Your bet choice:</p>
      <p class="text-2xl">
        {#if betChoice === "blue"}
          <span class="text-blue-500">Blue</span>
        {:else if betChoice === "red"}
          <span class="text-red-500">Red</span>
        {:else}
          <span class="dark:text-gray-400">None</span>
        {/if}
      </p>
    </div> -->
    <!-- <div class="lock-it-in-button">
      <GradientButton
        on:click={handleLockInBet}
        color="redToYellow"
        disabled={betChoice === "none"}
      >
        Lock it in!
      </GradientButton>
    </div> -->
  {:else if isWaitingOnResult}
    <div>waiting on result</div>
  {/if}
  <!-- {#if $matchData}
    {#if numberOfRegisteredPlayers < 2}
      <Heading tag="h1" class="flex items-center" size="text-5xl">
        Waiting on other players: {2 - numberOfRegisteredPlayers}
      </Heading>
    {:else if $matchData.roundNumber > 0}
      <Heading tag="h1" class="" size="text-5xl">
        Round {$matchData.roundNumber}
      </Heading>
      {#if $matchData.currentBetterIndex === playerInfo?.index}
        <p class="dark:text-gray-400">It's your turn to bet!</p>
        <Toggle
          bind:checked={isSpicyBet}
          disabled={playerInfo.spicyBetBalance > 0 ? false : true}
        >
          {isSpicyBet ? "SPICY BET!!! (3)" : "Normal bet (1)"}
        </Toggle>
        <div class="bet-buttons">
          <span>
            <GradientButton
              on:click={() =>
                handleChooseSide({ betColor: "blue", spicyBet: isSpicyBet })}
              color="blue"
            >
              Blue
            </GradientButton>
          </span>
          <span>
            <GradientButton
              on:click={() =>
                handleChooseSide({ betColor: "red", spicyBet: isSpicyBet })}
              color="red"
            >
              Red
            </GradientButton>
          </span>
        </div>
        <div class="pre-bet-choice">
          <p class="dark:text-gray-400 mb-0">Your bet choice:</p>
          <p class="text-2xl">
            {#if betChoice === "blue"}
              <span class="text-blue-500">Blue</span>
            {:else if betChoice === "red"}
              <span class="text-red-500">Red</span>
            {:else}
              <span class="dark:text-gray-400">None</span>
            {/if}
          </p>
        </div>
        <div class="lock-it-in-button">
          <GradientButton
            on:click={handleLockInBet}
            color="redToYellow"
            disabled={betChoice === "none"}
          >
            Lock it in!
          </GradientButton>
        </div>
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
  {/if} -->
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

  .bet-buttons {
    margin-top: 1rem;

    .spicy-red {
      color: red;
    }
  }

  .pre-bet-choice {
    margin-top: 1rem;
  }
</style>
