import { describe, test, expect } from "@jest/globals";
import { getKeysValues } from "./getKeysValues";

describe("getKeysValues", () => {
  test("returns keys and values for a regular object", () => {
    const obj = { a: 1, b: "test", c: true };
    const [keys, values] = getKeysValues(obj);

    expect(keys).toEqual(["a", "b", "c"]);
    expect(values).toEqual([1, "test", true]);
  });

  test("works with an empty object", () => {
    const [keys, values] = getKeysValues({});

    expect(keys).toEqual([]);
    expect(values).toEqual([]);
  });

  test("handles objects with undefined and null values", () => {
    const obj = { a: undefined, b: null };
    const [keys, values] = getKeysValues(obj);

    expect(keys).toEqual(["a", "b"]);
    expect(values).toEqual([undefined, null]);
  });

  test("ignores inherited properties", () => {
    const proto = { inherited: "should be ignored" };
    const obj = Object.create(proto);
    obj.a = 42;

    const [keys, values] = getKeysValues(obj);

    expect(keys).toEqual(["a"]);
    expect(values).toEqual([42]);
  });

  test("works when called without arguments", () => {
    const [keys, values] = getKeysValues();

    expect(keys).toEqual([]);
    expect(values).toEqual([]);
  });
});
