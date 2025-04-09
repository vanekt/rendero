import { JSX, createEffect } from "solid-js";
import { render } from "solid-js/web";
import {
  Module,
  EffectFunction,
  EffectScope,
  getKeysValues,
} from "@vanekt/rendero-core";
import { Case, LayoutType } from "../types";

interface HelloProps {
  value: string;
}

interface EvalProps {
  code: string;
}

const Eval = (props: EvalProps) => {
  createEffect(() => {
    new Function(props.code)();
  });

  return null;
};

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

function initSolidModule(): Module<LayoutType> {
  return {
    name: "solid",
    components: {
      hello: ({ value }: HelloProps) => <>Hello, {value || "Solid"}!</>,
      div: (props, { renderChildren }) => (
        <div {...props}>{renderChildren({ div: "div" })}</div>
      ),
      span: (props, { renderChildren }) => (
        <span {...props}>{renderChildren({ span: "span" })}</span>
      ),
      eval: (props: EvalProps) => <Eval {...props} />,
    },
    vars: { one: 1, two: 2, foo: "bar" },
    effects: [{ scope: EffectScope.GLOBAL, function: bindEvents }],
  };
}

function renderSolidApp(layout: LayoutType) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(() => layout as JSX.Element, container);
}

const example: Case = {
  index: "solid",
  title: "SolidJS",
  render: renderSolidApp,
  modules: [initSolidModule],
  template: {
    module: "solid",
    type: "div",
    props: {
      id: "my-div",
      title: "My DIV",
      style: {
        display: "flex",
        ["flex-direction"]: "column",
      },
    },
    children: [
      {
        module: "solid",
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
            module: "solid",
            type: "hello",
            props: { value: "Green" },
          },
        ],
      },

      {
        module: "solid",
        type: "div",
        props: {
          id: "my-div2",
          title: "My DIV2",
          style: {
            display: "flex",
            ["flex-direction"]: "column",
          },
        },
        children: [
          {
            module: "solid",
            type: "span",
            props: {
              style: {
                color: "pink",
              },
            },
            children: [
              {
                module: "solid",
                type: "hello",
                props: { value: "Pink" },
              },
            ],
          },
        ],
      },

      {
        module: "solid",
        type: "hello",
      },

      {
        module: "solid",
        type: "eval",
        props: {
          code: 'console.log("Hi, {{name}}!")',
        },
      },
    ],
  },
  vars: { name: "Rendero" },
};

export { initSolidModule, renderSolidApp, example };
