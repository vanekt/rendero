<script lang="ts">
  export let code: string;

  import { onMount } from "svelte";
  onMount(() => {
    new Function(code)();
  });
</script>
