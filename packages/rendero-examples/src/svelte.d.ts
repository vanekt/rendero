declare module "*.svelte" {
  import { SvelteComponentTyped } from "svelte";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export default class Component extends SvelteComponentTyped<any, any, any> {}
}
