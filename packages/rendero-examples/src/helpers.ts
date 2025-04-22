import {
  EffectScope,
  createInstance,
  replacePlaceholders,
} from "@vanekt/rendero-core";
import { Case, LayoutType } from "./types";

function createNavLink(title: string, idx: string, active: boolean) {
  const node = document.createElement("a");

  const attr = document.createAttribute("href");
  attr.value = `?case=${idx}`;
  node.setAttributeNode(attr);

  node.style.color = "black";
  node.style.backgroundColor = "white";
  node.style.padding = "10px 20px";
  node.style.textDecoration = "none";
  node.style.opacity = "1";
  if (active) {
    node.style.outline = "2px solid black";
  }

  node.innerText = title;

  return node;
}

export function buildNavigation(index: string | null, cases: Case[]) {
  const navElement = document.createElement("div");
  navElement.style.display = "flex";
  navElement.style.alignItems = "center";
  navElement.style.gap = "10px";
  navElement.style.padding = "10px";
  navElement.style.marginBottom = "10px";
  navElement.style.backgroundColor = "skyblue";

  cases.forEach((item) => {
    const link = createNavLink(item.title, item.index, item.index === index);
    navElement.appendChild(link);
  });

  document.body.appendChild(navElement);
}

export function renderCase(index: string | null, cases: Case[]): void {
  const currentCase = cases.find((item) => item.index === index);

  if (!currentCase) {
    const result = document.createElement("span");
    result.innerText = "Please, select case";
    document.body.appendChild(result);
    return;
  }

  const modules = currentCase.modules.map((module) => module());
  const instance = createInstance<LayoutType>(...modules).addEffect({
    scope: EffectScope.GLOBAL,
    function: replacePlaceholders,
  });

  const result = instance.render(currentCase.template, currentCase.vars);

  currentCase.render(result.layout);

  console.log("instance", instance);
  console.log("debug", result);
}
