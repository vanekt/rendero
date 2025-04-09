<script lang="ts">
  export let tag: string;
  export let props: {
    [x: string]: unknown;
  };
  export let children: SvelteNode[];
</script>

<svelte:element this={tag} {...props}>
  {#each children as child}
    <svelte:component this={child.component} {...child.props} />
  {/each}
</svelte:element>
