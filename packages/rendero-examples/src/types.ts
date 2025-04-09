import { ReactNode } from "react";
import type { VNode } from "vue";
import { SvelteComponent } from "svelte";
import { JSX } from "solid-js";
import { Module, TemplateNode, Vars } from "@vanekt/rendero-core";

export type SvelteNode = {
  component: typeof SvelteComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
};

export type LayoutType = Node | ReactNode | VNode | SvelteNode | JSX.Element;

type ModuleCreator = () => Module<LayoutType>;
export interface Case {
  index: string;
  title: string;
  modules: ModuleCreator[];
  template: TemplateNode;
  vars: Vars;
  render: (layout: LayoutType) => void;
}
