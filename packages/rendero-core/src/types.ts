export type TemplateNodeProps =
  | string
  | TemplateNodeProps[]
  | { [key: string]: TemplateNodeProps }
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- TODO
  | Function;

export type TemplateNodeKey = string | number;
export interface TemplateNode {
  module: string;
  type: string;
  props?: TemplateNodeProps;
  children?: TemplateNode[];
  key?: TemplateNodeKey;
}

export type Vars = Record<string, unknown>;

export type RenderedLayout<L = unknown> = L;

export type RenderChildrenFunction<L> = (
  extraVars: Vars,
) => RenderedLayout<L>[];
export interface RenderFunctionResult<L> {
  children: RenderFunctionResult<L>[];
  layout: RenderedLayout<L>;
  vars: Vars;
}

export type RenderFunction<L> = (
  node: TemplateNode,
  renderVars: Vars,
) => RenderFunctionResult<L>;

export enum EffectScope {
  GLOBAL,
  NODE,
}

export type EffectFunction = (
  props: TemplateNodeProps,
  vars: Vars,
  node?: unknown,
) => TemplateNodeProps;

export interface Effect {
  scope: EffectScope;
  function: EffectFunction;
}

export type ApplyEffectsFunction = (
  props: TemplateNodeProps,
  vars: Vars,
  node: unknown | null,
  scopes: EffectScope[],
) => TemplateNodeProps;

export type AddEffectFunction<L> = (effect: Effect) => Instance<L>;
export interface ComponentRendererExtra<L> {
  children?: TemplateNode[];
  props: TemplateNodeProps;
  vars: Vars;
  applyEffects: ApplyEffectsFunction;
  render: RenderFunction<L>;
  renderChildren: RenderChildrenFunction<L>;
}

export type ComponentRenderer<TProps extends Record<string, unknown>, L> = (
  props: TProps,
  extra: ComponentRendererExtra<L>,
) => RenderedLayout<L>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Components<L> = Record<string, ComponentRenderer<any, L>>;

export interface Module<L> {
  name: string;
  components?: Components<L>;
  vars?: Vars;
  effects?: Effect[];
}

export interface Instance<L> {
  render: (node: TemplateNode, renderVars: Vars) => RenderFunctionResult<L>;
  addEffect: AddEffectFunction<L>;
  components: Record<string, Components<L>>;
  vars: Vars;
  effects: Effect[];
}
