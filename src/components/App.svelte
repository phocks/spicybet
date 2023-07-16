<script lang="ts">
  // Props
  export let matchId: string;

  // Local Imports
  import { getFirebaseApp, getFirebaseDatabase } from "@utils/firebase";

  const firebaseApp = getFirebaseApp();
  const result = getFirebaseDatabase(matchId);
</script>

<div />
