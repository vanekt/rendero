import { ReactNode, useEffect } from "react";
import { RenderChildrenFunction } from "@vanekt/rendero-core";

interface UseEffectProps {
  code: string;
  deps: unknown[];
  renderChildren: RenderChildrenFunction<ReactNode>;
}

export function UseEffect({ code, deps = [], renderChildren }: UseEffectProps) {
  useEffect(() => {
    (function () {
      new Function(code)();
    })();
  }, deps);

  return renderChildren({});
}
