import "modern-normalize";
import { Case } from "./types";
import { buildNavigation, renderCase } from "./helpers";
import { example as vanillaExample } from "./modules/vanilla";
import { example as reactExample } from "./modules/react";
import { example as vueExample } from "./modules/vue";
import { example as svelteExample } from "./modules/svelte";
import { example as solidExample } from "./modules/solid";

const cases: Case[] = [
  vanillaExample,
  reactExample,
  vueExample,
  svelteExample,
  solidExample,
];

const search = new URLSearchParams(window.location.search);
const currentCase = search.get("case");

buildNavigation(currentCase, cases);
renderCase(currentCase, cases);
