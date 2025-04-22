import { ReactNode, useState } from "react";
import { RenderChildrenFunction } from "@vanekt/rendero-core";

interface UseStateProps {
  getter: string;
  setter: string;
  initialValue: unknown;
  renderChildren: RenderChildrenFunction<ReactNode>;
}

export function UseState({
  getter,
  setter,
  initialValue,
  renderChildren,
}: UseStateProps) {
  const [getterValue, setterValue] = useState(initialValue);

  return renderChildren({
    [getter]: getterValue,
    [setter]: setterValue,
  });
}
