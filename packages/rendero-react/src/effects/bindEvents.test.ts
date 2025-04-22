import { bindEvents } from "./bindEvents";

jest.mock("@vanekt/rendero-core", () => ({
  ...jest.requireActual("@vanekt/rendero-core"),
  getKeysValues: jest.fn(() => [
    ["vars", "event"],
    [{ count: 1 }, { type: "click" }],
  ]),
}));

describe("bindEvents", () => {
  it("should return the props unchanged if it is not an object", () => {
    expect(bindEvents(null, {})).toBe(null);
    expect(bindEvents(undefined, {})).toBe(undefined);
    expect(bindEvents("string", {})).toBe("string");
    expect(bindEvents(123, {})).toBe(123);
    expect(bindEvents([1, 2, 3], {})).toEqual([1, 2, 3]);
  });

  it("should return the object without on*-properties unchanged", () => {
    const props = { id: "hello", className: "test" };
    expect(bindEvents(props, {})).toEqual(props);
  });

  it("should wrap string event handlers into functions", () => {
    const props = {
      onClick: "console.log(vars.count, event.type)",
      id: "test",
    };

    const bound = bindEvents(props, { vars: { count: 1 } }) as Record<
      string,
      any
    >;

    expect(bound).not.toBeNull();
    expect(bound).toHaveProperty("onClick");
    expect(typeof bound.onClick).toBe("function");

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    bound.onClick({ type: "click" });

    expect(consoleSpy).toHaveBeenCalledWith(1, "click");

    consoleSpy.mockRestore();
  });

  it("should leave non-string event handlers as they are", () => {
    const fn = jest.fn();
    const props = { onChange: fn };

    const result = bindEvents(props, {}) as Record<string, any>;

    expect(result).not.toBeNull();
    expect(result).toHaveProperty("onChange");

    result.onChange({ type: "input" });
    expect(fn).not.toHaveBeenCalled();
  });
});
