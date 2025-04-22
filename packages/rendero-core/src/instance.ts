import {
  AddEffectFunction,
  ApplyEffectsFunction,
  Components,
  Effect,
  EffectScope,
  Instance,
  Module,
  RenderFunctionResult,
  RenderFunction,
  RenderChildrenFunction,
  TemplateNodeProps,
  Vars,
} from "./types";

export function createInstance<L>(...modules: Module<L>[]): Instance<L> {
  const components: Record<string, Components<L>> = modules.reduce(
    (acc, { name, components = {} }) => ({
      ...acc,
      [name]: components,
    }),
    {},
  );

  const globalVars: Vars = modules.reduce(
    (acc, { vars }) => ({ ...acc, ...vars }),
    {},
  );

  const effects: Effect[] = modules.reduce(
    (acc, { effects = [] }) => [...acc, ...effects],
    [] as Effect[],
  );

  const addEffect: AddEffectFunction<L> = (effect) => {
    effects.push(effect);
    return instance;
  };

  const render: RenderFunction<L> = (node, renderVars) => {
    const {
      module,
      type,
      props: nodeProps,
      children: nodeChildren,
      key = 0,
    } = node || {};
    const component = components?.[module]?.[type];

    if (!component) {
      throw new Error(`Wrong node type: ${module}:${type}`);
    }

    let children: RenderFunctionResult<L>[] = [];

    const renderChildren: RenderChildrenFunction<L> = (extraVars = {}) => {
      children.length = 0; // clean children

      if (!Array.isArray(nodeChildren)) {
        return [];
      }

      children.push(
        ...nodeChildren.map((child, idx) =>
          render({ ...child, key: idx }, { ...renderVars, ...extraVars }),
        ),
      );

      return children.map((child) => child.layout);
    };

    const applyEffects: ApplyEffectsFunction = (props, vars, node, scopes) => {
      return effects
        .filter((effect) => scopes.includes(effect.scope))
        .reduce((acc, eff) => eff.function(acc, vars, node), props);
    };

    const vars = { ...globalVars, ...renderVars };

    const props = applyEffects(nodeProps, vars, null, [EffectScope.GLOBAL]) as {
      [key: string]: TemplateNodeProps;
    };

    const layout = component(
      { key, ...props },
      {
        children: nodeChildren,
        props: nodeProps,
        vars,
        applyEffects,
        render,
        renderChildren,
      },
    );

    return { layout, children, vars };
  };

  const instance = {
    components,
    effects,
    vars: globalVars,
    addEffect,
    render,
  };

  return instance;
}
