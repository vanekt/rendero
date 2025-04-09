import { describe, test, expect } from "@jest/globals";
import { createInstance } from "./instance";
import { ComponentRenderer, EffectScope, Module } from "./types";
import { replacePlaceholders } from "./effects/replacePlaceholders";

type PropsType = {
  [x: string]: unknown;
};

function createNode(name: string): ComponentRenderer<PropsType, Node> {
  return (_, { renderChildren, applyEffects, props: nodeProps, vars }) => {
    const node = document.createElement(name);

    const props = applyEffects(nodeProps, vars, node, [
      EffectScope.GLOBAL,
    ]) as PropsType;

    Object.keys(props || {}).forEach((key) => {
      const attr = document.createAttribute(key);
      attr.value = String(props[key]);
      node.setAttributeNode(attr);
    });

    const children = renderChildren({ [name]: name });

    node.append(...children);

    return node;
  };
}

interface HelloProps {
  value: string;
  key: number;
}

function initVanillaModule(): Module<Node> {
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
    effects: [],
  };
}

function initSecondModule(): Module<Node> {
  return {
    name: "second",
    components: {
      foo: () => document.createTextNode("bar"),
    },
    vars: {
      foo: "bar",
    },
    effects: [],
  };
}

const firstModule = initVanillaModule();
const secondModule = initSecondModule();
const instance = createInstance(firstModule, secondModule).addEffect({
  scope: EffectScope.GLOBAL,
  function: replacePlaceholders,
});

const vars = { name: "Rendero" };

describe("createInstance function", () => {
  test("correctly handles empty modules array", () => {
    const emptyInstance = createInstance();
    expect(emptyInstance.components).toEqual({});
    expect(emptyInstance.vars).toEqual({});
  });

  test("correctly handles modules without components or vars", () => {
    const instance = createInstance({
      name: "empty",
      components: {},
      vars: {},
      effects: [],
    });
    expect(instance.components).toEqual({ empty: {} });
    expect(instance.vars).toEqual({});
  });
});

describe("instance.components", () => {
  test("correctly add all modules", () => {
    expect(instance.components).toHaveProperty(firstModule.name);
    expect(instance.components).toHaveProperty(secondModule.name);
    expect(Object.keys(instance.components).length).toBe(2);
  });

  test(`correctly add "${firstModule.name}" module all components`, () => {
    expect(instance.components[firstModule.name]).toHaveProperty("div");
    expect(instance.components[firstModule.name]).toHaveProperty("span");
    expect(instance.components[firstModule.name]).toHaveProperty("hello");
    expect(instance.components[firstModule.name]).toHaveProperty("eval");
    expect(Object.keys(instance.components[firstModule.name]).length).toBe(
      Object.keys(firstModule.components!).length,
    );
  });

  test(`correctly add "${secondModule.name}" module all components`, () => {
    expect(instance.components[secondModule.name]).toHaveProperty("foo");
    expect(Object.keys(instance.components[secondModule.name]).length).toBe(
      Object.keys(secondModule.components!).length,
    );
  });
});

describe("instance.vars", () => {
  test("correctly add all vars", () => {
    expect(instance.vars).toHaveProperty("one");
    expect(instance.vars).toHaveProperty("two");
    expect(instance.vars).toHaveProperty("foo");
  });
});

describe("instance.render function", () => {
  test("correctly render vanilla.hello component", () => {
    const layout = instance.render(
      { module: "vanilla", type: "hello", props: {} },
      vars,
    ).layout;

    expect(layout instanceof Text).toBeTruthy();
    if (layout instanceof Text) {
      expect(layout.textContent).toBe("Hello, Vanilla!");
    }
  });

  test("correctly render vanilla.div component", () => {
    const div = instance.render(
      { module: "vanilla", type: "div", props: {} },
      vars,
    ).layout;

    expect(div instanceof Element).toBeTruthy();
    if (div instanceof Element) {
      expect(div.tagName).toBe("DIV");
    }
  });

  test("correctly render vanilla.div component with props", () => {
    const div = instance.render(
      {
        module: "vanilla",
        type: "div",
        props: {
          title: "My {{name}}",
          style: "display: flex; flex-direction: column;",
        },
      },
      vars,
    ).layout;

    expect(div instanceof Element).toBeTruthy();
    if (div instanceof Element) {
      expect(div.getAttribute("title")).toBe("My Rendero");
      expect(div.getAttribute("style")).toBe(
        "display: flex; flex-direction: column;",
      );
    }
  });

  test("correctly render vanilla.div component text node child", () => {
    const div = instance.render(
      {
        module: "vanilla",
        type: "div",
        props: {},
        children: [{ module: "vanilla", type: "hello", props: {} }],
      },
      vars,
    ).layout;

    expect(div instanceof Node).toBeTruthy();
    if (div instanceof Node) {
      expect(div.textContent).toBe("Hello, Vanilla!");
    }
  });

  test("correctly render vanilla.div component span child", () => {
    const div = instance.render(
      {
        module: "vanilla",
        type: "div",
        props: {},
        children: [
          {
            module: "vanilla",
            type: "span",
            props: {},
            children: [
              { module: "vanilla", type: "hello", props: { value: "YOU" } },
            ],
          },
          {
            module: "vanilla",
            type: "span",
            props: {},
            children: [
              {
                module: "vanilla",
                type: "hello",
                props: { value: "{{foo}}" },
              },
            ],
          },
        ],
      },
      vars,
    ).layout;

    expect(div instanceof Element).toBeTruthy();
    if (div instanceof Element) {
      expect(div.childElementCount).toBe(2);
      expect(div.firstElementChild?.tagName).toBe("SPAN");
      expect(div.firstElementChild?.textContent).toBe("Hello, YOU!");
      expect(div.lastElementChild?.tagName).toBe("SPAN");
      expect(div.lastElementChild?.textContent).toBe("Hello, bar!");
    }
  });

  test("throws error when render unknown component", () => {
    expect(() => {
      instance.render({ module: "vanilla", type: "unknown", props: {} }, vars);
    }).toThrowError("Wrong node type: vanilla:unknown");
  });

  test("correctly render vanilla.div component with incorrect children value", () => {
    const layout = instance.render(
      {
        module: "vanilla",
        type: "div",
        props: {},
        children: undefined,
      },
      vars,
    ).layout;

    expect(layout instanceof Element).toBeTruthy();
    if (layout instanceof Element) {
      expect(layout.childElementCount).toBe(0);
    }
  });

  test("throws with incorrect node value", () => {
    expect(() => {
      // @ts-expect-error allow wrong node value for test
      instance.render(null);
    }).toThrowError("Wrong node type: undefined:undefined");
    expect(() => {
      // @ts-expect-error allow wrong node value for test
      instance.render(undefined);
    }).toThrowError("Wrong node type: undefined:undefined");
    expect(() => {
      // @ts-expect-error allow wrong node value for test
      instance.render([]);
    }).toThrowError("Wrong node type: undefined:undefined");
  });

  test("throws with incorrect child value", () => {
    expect(() => {
      instance.render(
        {
          module: "vanilla",
          type: "div",
          // @ts-expect-error allow wrong children value for test
          children: [null],
        },
        vars,
      );
    }).toThrowError("Wrong node type: undefined:undefined");
  });
});
