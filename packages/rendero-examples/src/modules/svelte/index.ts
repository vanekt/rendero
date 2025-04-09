import { mount } from "svelte";

import {
  Module,
  EffectFunction,
  EffectScope,
  getKeysValues,
} from "@vanekt/rendero-core";
import { Case, LayoutType, SvelteNode } from "../../types";

import Hello from "./components/Hello.svelte";
import Eval from "./components/Eval.svelte";
import Wrapper from "./components/Wrapper.svelte";

interface HelloProps {
  value: string;
  key: number;
}

interface EvalProps {
  code: string;
  key: number;
}

const bindEvents: EffectFunction = (props, vars) => {
  if (typeof props !== "object" || Array.isArray(props) || !vars) return props;

  const result = { ...props };

  for (const name in props) {
    if (name.startsWith("on")) {
      result[name] = (event: unknown) => {
        const fnBody = props[name];
        const [keys, values] = getKeysValues({ vars, event });
        return new Function(...keys, String(fnBody))(...values);
      };
    }
  }

  return result;
};

function initSvelteModule(): Module<LayoutType> {
  return {
    name: "svelte",
    components: {
      hello: ({ value }: HelloProps) => ({
        component: Hello,
        props: { value },
      }),

      div: (props, { renderChildren }) => ({
        component: Wrapper,
        props: {
          tag: "div",
          props,
          children: renderChildren({ div: "div" }),
        },
      }),

      span: (props, { renderChildren }) => ({
        component: Wrapper,
        props: {
          tag: "span",
          props,
          children: renderChildren({ span: "span" }),
        },
      }),

      eval: (props: EvalProps) => ({
        component: Eval,
        props,
      }),
    },
    vars: { one: 1, two: 2, foo: "bar" },
    effects: [{ scope: EffectScope.GLOBAL, function: bindEvents }],
  };
}

function renderSvelteApp(layout: LayoutType) {
  const container = document.createElement("div");

  mount((layout as SvelteNode).component, {
    target: container,
    props: (layout as SvelteNode).props,
  });

  document.body.appendChild(container);
}

const example: Case = {
  index: "svelte",
  title: "Svelte",
  render: renderSvelteApp,
  modules: [initSvelteModule],
  template: {
    module: "svelte",
    type: "div",
    props: {
      id: "my-div",
      title: "My DIV",
      style: "display: flex; flex-direction: column",
    },
    children: [
      {
        module: "svelte",
        type: "span",
        props: {
          style: "color: green; cursor: pointer",
          onclick: "console.log('I am green!', vars, event.target);",
        },
        children: [
          {
            module: "svelte",
            type: "hello",
            props: { value: "Green" },
          },
        ],
      },

      {
        module: "svelte",
        type: "div",
        props: {
          id: "my-div2",
          title: "My DIV2",
          style: "display: flex; flex-direction: column",
        },
        children: [
          {
            module: "svelte",
            type: "span",
            props: {
              style: "color: pink;",
            },
            children: [
              {
                module: "svelte",
                type: "hello",
                props: { value: "Pink" },
              },
            ],
          },
        ],
      },

      {
        module: "svelte",
        type: "hello",
      },

      {
        module: "svelte",
        type: "eval",
        props: {
          code: 'console.log("Hi, {{name}}!")',
        },
      },
    ],
  },
  vars: { name: "Rendero" },
};

export { initSvelteModule, renderSvelteApp, example };
