import React from "react";
import { FC, ReactEventHandler, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  EffectFunction,
  EffectScope,
  Module,
  getKeysValues,
} from "@vanekt/rendero-core";
import { Case, LayoutType } from "../types";

interface HelloProps {
  value: string;
  key: number;
}

interface EvalProps {
  code: string;
}

const Eval: FC<EvalProps> = ({ code }) => {
  useEffect(() => {
    (function () {
      new Function(code)();
    })();
  }, []);
  return null;
};

const bindEvents: EffectFunction = (props, vars) => {
  if (typeof props !== "object" || Array.isArray(props) || !vars) return props;

  const result = { ...props };

  for (const name in props) {
    if (name.startsWith("on")) {
      result[name] = (event: ReactEventHandler) => {
        const fn = props[name];
        const [keys, values] = getKeysValues({ vars, event });

        return new Function(...keys, String(fn))(...values);
      };
    }
  }

  return result;
};

function initReactModule(): Module<LayoutType> {
  return {
    name: "react",
    components: {
      hello: ({ value }: HelloProps) => `Hello, ${value || "React"}!`,
      div: ({ key, ...props }, { renderChildren }) => (
        <div key={key} {...props}>
          {renderChildren({ div: "div" })}
        </div>
      ),
      span: ({ key, ...props }, { renderChildren }) => (
        <span key={key} {...props}>
          {renderChildren({ span: "span" })}
        </span>
      ),
      eval: ({ key, ...props }) => <Eval key={key} {...props} />,
    },
    vars: { one: 1, two: 2, foo: "bar" },
    effects: [{ scope: EffectScope.GLOBAL, function: bindEvents }],
  };
}

function renderReactApp(layout: LayoutType) {
  if (React.isValidElement(layout)) {
    const reactRootElement = document.createElement("div");
    const root = createRoot(reactRootElement);
    root.render(layout);
    document.body.appendChild(reactRootElement);
  }
}

const example: Case = {
  index: "react",
  title: "React",
  render: renderReactApp,
  modules: [initReactModule],
  template: {
    module: "react",
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
        module: "react",
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
            module: "react",
            type: "hello",
            props: { value: "Green" },
          },
        ],
      },

      {
        module: "react",
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
            module: "react",
            type: "span",
            props: {
              style: {
                color: "pink",
              },
            },
            children: [
              {
                module: "react",
                type: "hello",
                props: { value: "Pink" },
              },
            ],
          },
        ],
      },

      {
        module: "react",
        type: "hello",
      },

      {
        module: "react",
        type: "eval",
        props: {
          code: 'console.log("Hi, {{name}}!")',
        },
      },
    ],
  },
  vars: { name: "Rendero" },
};

export { initReactModule, renderReactApp, example };
