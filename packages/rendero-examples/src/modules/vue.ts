import { h, defineComponent, VNode, createApp } from "vue";
import {
  Module,
  EffectFunction,
  EffectScope,
  getKeysValues,
} from "@vanekt/rendero-core";
import { Case, LayoutType } from "../types";

interface HelloProps {
  value: string;
  key: number;
}

interface EvalProps {
  code: string;
  key: number;
}

const Eval = defineComponent({
  props: {
    code: { type: String, required: true },
  },
  mounted() {
    new Function(this.code!)();
  },
  render() {
    return null;
  },
});

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

function initVueModule(): Module<LayoutType> {
  return {
    name: "vue",
    components: {
      hello: ({ value }: HelloProps) => `Hello, ${value || "Vue"}!`,
      div: (props, { renderChildren }) =>
        h("div", props, renderChildren({ div: "div" }) as VNode[]),
      span: (props, { renderChildren }) =>
        h("span", props, renderChildren({ span: "span" }) as VNode[]),
      eval: (props: EvalProps) => h(Eval, props),
    },
    vars: { one: 1, two: 2, foo: "bar" },
    effects: [{ scope: EffectScope.GLOBAL, function: bindEvents }],
  };
}

function renderVueApp(layout: LayoutType) {
  const vueRootElement = document.createElement("div");
  document.body.appendChild(vueRootElement);
  const app = createApp({
    render: () => layout,
  });
  app.mount(vueRootElement);
}

const example: Case = {
  index: "vue",
  title: "Vue",
  render: renderVueApp,
  modules: [initVueModule],
  template: {
    module: "vue",
    type: "div",
    props: {
      id: "my-div",
      title: "My DIV",
      style: {
        display: "flex",
        flexDirection: "column",
      },
    },
    children: [
      {
        module: "vue",
        type: "span",
        props: {
          style: {
            color: "green",
            cursor: "pointer",
          },
          onClick: "console.log('I am green!', vars, event.target);",
        },
        children: [
          {
            module: "vue",
            type: "hello",
            props: { value: "Green" },
          },
        ],
      },

      {
        module: "vue",
        type: "div",
        props: {
          id: "my-div2",
          title: "My DIV2",
          style: {
            display: "flex",
            flexDirection: "column",
          },
        },
        children: [
          {
            module: "vue",
            type: "span",
            props: {
              style: {
                color: "pink",
              },
            },
            children: [
              {
                module: "vue",
                type: "hello",
                props: { value: "Pink" },
              },
            ],
          },
        ],
      },

      {
        module: "vue",
        type: "hello",
      },

      {
        module: "vue",
        type: "eval",
        props: {
          code: 'console.log("Hi, {{name}}!")',
        },
      },
    ],
  },
  vars: { name: "Rendero" },
};

export { initVueModule, renderVueApp, example };
