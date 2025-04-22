import {
  createElement,
  Fragment,
  ReactNode,
  StrictMode,
  Suspense,
} from "react";
import { Components, EffectScope, Module } from "@vanekt/rendero-core";

import { UseEffect } from "./components/UseEffect";
import { UseState } from "./components/UseState";
import { bindEvents } from "./effects/bindEvents";
import { HTML_ELEMENT_TYPES, SVG_ELEMENT_TYPES } from "./constants";

type PrimitiveProps<T> = { value: T };

function initModule(): Module<ReactNode> {
  const components: Components<ReactNode> = {
    // Primitives
    null: () => null,
    undefined: () => undefined,
    boolean: ({ value }: PrimitiveProps<boolean>) => value,
    string: ({ value }: PrimitiveProps<string>) => value,
    number: ({ value }: PrimitiveProps<number>) => value,
    array: (_, { renderChildren }) => renderChildren({}),

    // Built-in React Components
    fragment: ({ key }, { renderChildren }) =>
      createElement(Fragment, { key }, renderChildren({})),
    strict_mode: ({ key }, { renderChildren }) =>
      createElement(StrictMode, { key }, renderChildren({})),
    suspense: (props, { renderChildren }) =>
      createElement(Suspense, props, renderChildren({})),

    // Hooks
    use_effect: (props, { renderChildren }) =>
      createElement(UseEffect, { ...props, renderChildren }),
    use_state: (props, { renderChildren }) =>
      createElement(UseState, { ...props, renderChildren }),

    // DOM-elements
    ...Object.fromEntries(
      [...HTML_ELEMENT_TYPES, ...SVG_ELEMENT_TYPES].map((tag) => [
        tag,
        (props, { renderChildren }) =>
          createElement(tag, props, renderChildren({})),
      ]),
    ),
  };

  return {
    name: "react",
    components,
    effects: [{ scope: EffectScope.GLOBAL, function: bindEvents }],
  };
}

export { initModule };
