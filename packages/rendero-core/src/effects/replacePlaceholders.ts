import { getKeysValues } from "../helpers/getKeysValues";
import { EffectFunction } from "../types";

enum PLACEHOLDER {
  START = "{{",
  END = "}}",
  START_TEMP = "<<<",
  END_TEMP = ">>>",
}

export const replacePlaceholders: EffectFunction = (props, vars) => {
  if (!props || !vars) return props;

  if (typeof props === "string") {
    let result = props;
    let start = result.indexOf(PLACEHOLDER.START);

    while (start >= 0) {
      const end = result.indexOf(
        PLACEHOLDER.END,
        start + PLACEHOLDER.START.length,
      );

      if (end === -1) break;

      const attribute = result.substring(start + PLACEHOLDER.START.length, end);
      const placeholder = `${PLACEHOLDER.START}${attribute}${PLACEHOLDER.END}`;

      if (attribute.startsWith("e!")) {
        try {
          const fn = attribute.substring(2);
          const [k, v] = getKeysValues(vars);

          const fnResult = new Function(...k, fn)(...v);

          if (typeof fnResult !== "string" && props === placeholder) {
            return fnResult;
          }

          result = result.replace(placeholder, `${fnResult}`);
        } catch {
          result = result
            .replace(PLACEHOLDER.START, PLACEHOLDER.START_TEMP)
            .replace(PLACEHOLDER.END, PLACEHOLDER.END_TEMP);
        }
      } else if (attribute in vars) {
        const value = vars[attribute];

        if (typeof value !== "string" && props === placeholder) {
          return value;
        }

        result = result.replace(placeholder, `${value}`);
      } else {
        result = result
          .replace(PLACEHOLDER.START, PLACEHOLDER.START_TEMP)
          .replace(PLACEHOLDER.END, PLACEHOLDER.END_TEMP);
      }

      start = result.indexOf(PLACEHOLDER.START);
    }

    return result
      .replace(PLACEHOLDER.START_TEMP, PLACEHOLDER.START)
      .replace(PLACEHOLDER.END_TEMP, PLACEHOLDER.END);
  }

  if (Array.isArray(props)) {
    return props.map((item) => replacePlaceholders(item, vars));
  }

  if (typeof props === "object" && props !== null) {
    return Object.fromEntries(
      Object.entries(props).map(([key, value]) => [
        key,
        replacePlaceholders(value, vars),
      ]),
    );
  }

  return props;
};
