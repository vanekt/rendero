import {
  ComponentRenderer,
  EffectFunction,
  EffectScope,
  Module,
  getKeysValues,
} from "@vanekt/rendero-core";
import { Case, LayoutType } from "../types";

type PropsType = {
  [x: string]: unknown;
};

interface HelloProps {
  value: string;
  key: number;
}

const bindEvents: EffectFunction = (props, vars, node) => {
  if (typeof props !== "object" || Array.isArray(props) || !vars) return props;

  const result = { ...props };

  for (const name in props) {
    if (name.startsWith("on") && node instanceof Node) {
      const event = name.slice(2);
      const handler = (event: Event) => {
        const fnBody = props[name];
        const [keys, values] = getKeysValues({ vars, event });
        return new Function(...keys, String(fnBody))(...values);
      };

      node.addEventListener(event, handler);
    }
  }

  return result;
};

function initVanillaModule(): Module<LayoutType> {
  return {
    name: "vanilla",
    components: {
      hello: ({ value }: HelloProps) =>
        document.createTextNode(`Hello, ${value || "Vanilla"}!`),
      div: createNode("div"),
      span: createNode("span"),
      eval: ({ code }) => {
        const node = document.createElement("script");

        node.textContent = `
            (function() {
              new Function(${code})();
            })();
          `;

        return node;
      },
    },
    vars: { one: 1, two: 2, foo: "bar" },
    effects: [{ scope: EffectScope.NODE, function: bindEvents }],
  };
}

function createNode(name: string): ComponentRenderer<PropsType, LayoutType> {
  return (_, { renderChildren, applyEffects, props: nodeProps, vars }) => {
    const node = document.createElement(name);

    // TODO упростить
    const props = applyEffects(nodeProps, vars, node, [
      EffectScope.GLOBAL,
      EffectScope.NODE,
    ]) as PropsType;

    Object.keys(props || {}).forEach((key) => {
      if (key.startsWith("on")) {
        return;
      }

      const attr = document.createAttribute(key);
      attr.value = String(props[key]);
      node.setAttributeNode(attr);
    });

    const children = renderChildren({ [name]: name });

    if (
      Array.isArray(children) &&
      children.every((child) => child instanceof Node)
    ) {
      node.append(...children);
    }

    return node;
  };
}

function renderVanillaApp(layout: LayoutType) {
  if (layout instanceof Node) {
    document.body.appendChild(layout);
  }
}

const example: Case = {
  index: "vanilla",
  title: "Vanilla",
  render: renderVanillaApp,
  modules: [initVanillaModule],
  template: {
    module: "vanilla",
    type: "div",
    props: {
      id: "my-div",
      title: "My DIV",
      style: "display: flex; flex-direction: column;",
    },
    children: [
      {
        module: "vanilla",
        type: "span",
        props: {
          style: "color: green; cursor: pointer;",
          onclick: "console.log('I am green!', vars, event.target);",
        },
        children: [
          {
            module: "vanilla",
            type: "hello",
            props: { value: "Green" },
          },
        ],
      },

      {
        module: "vanilla",
        type: "div",
        props: {
          id: "my-div2",
          title: "My DIV2",
          style: "display: flex; flex-direction: column;",
        },
        children: [
          {
            module: "vanilla",
            type: "span",
            props: {
              style: "color: pink;",
            },
            children: [
              {
                module: "vanilla",
                type: "hello",
                props: { value: "Pink" },
              },
            ],
          },
        ],
      },

      {
        module: "vanilla",
        type: "hello",
      },

      {
        module: "vanilla",
        type: "eval",
        props: {
          code: 'console.log("Hi, {{name}}!")',
        },
      },
    ],
  },
  vars: { name: "Rendero" },
};

export { initVanillaModule, renderVanillaApp, example };
