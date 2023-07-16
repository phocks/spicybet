<script lang="ts">
  // Props
  export let matchId: string;

  // Imports
  import { onMount } from "svelte";

  // Local Imports
  import { getFirebaseApp, getFirebaseDatabase } from "@utils/firebase";

  // State
  let round = 0;

  onMount(async () => {
    console.log("mounted");
    const firebaseApp = getFirebaseApp();
    const result = await getFirebaseDatabase(matchId);
    console.log(result);

    round = result.round;
  });
</script>

<div>
  <h2>Round {round}</h2>
</div>
