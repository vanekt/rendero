import React from "react";
import { createRoot } from "react-dom/client";
import { Module } from "@vanekt/rendero-core";
import { initModule as initRenderoReactModule } from "@vanekt/rendero-react";
import { Case, LayoutType } from "../types";

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
  modules: [initRenderoReactModule as () => Module<LayoutType>],
  template: {
    module: "react",
    type: "use_state",
    props: {
      getter: "counter",
      setter: "setCounter",
      initialValue: 0,
    },
    children: [
      {
        module: "react",
        type: "strict_mode",
        children: [
          {
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
                  onClick:
                    "console.log('I am green!', vars, event.target); vars.setCounter(vars.counter + 1);",
                },
                children: [
                  {
                    module: "react",
                    type: "string",
                    props: { value: "Hello, Green!" },
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
                        type: "string",
                        props: { value: "Hello, Pink!" },
                      },
                    ],
                  },
                ],
              },

              {
                module: "react",
                type: "string",
                props: { value: "Hello, {{name}}! {{counter}}" },
              },

              {
                module: "react",
                type: "use_effect",
                props: {
                  code: 'console.log("Hi, {{name}}!")',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  vars: { name: "Rendero" },
};

export { initRenderoReactModule, renderReactApp, example };
