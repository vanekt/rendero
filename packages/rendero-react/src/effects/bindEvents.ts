import { ReactEventHandler } from "react";
import { EffectFunction, getKeysValues } from "@vanekt/rendero-core";

export const bindEvents: EffectFunction = (props, vars) => {
  if (!props || typeof props !== "object" || Array.isArray(props) || !vars) {
    return props;
  }

  const result = { ...props };

  for (const name in props) {
    if (name.startsWith("on")) {
      result[name] = (event: ReactEventHandler) => {
        const fn = props[name];

        if (typeof fn !== "string") {
          return fn;
        }

        const [keys, values] = getKeysValues({ vars, event });
        return new Function(...keys, fn)(...values);
      };
    }
  }

  return result;
};
