<script lang="ts">
  // Props
  export let matchId: string;

  // Imports
  import { onMount } from "svelte";

  // Local Imports
  import { getFirebaseApp, getFirebaseDatabase } from "@utils/firebase";

  onMount(async () => {
    console.log("mounted");
    const firebaseApp = getFirebaseApp();
    const result = await getFirebaseDatabase(matchId);
    console.log(result);
  });
</script>

<div />
