import { describe, test, expect } from "@jest/globals";
import { isPlainObject } from "./isPlainObject";

describe("isPlainObject", () => {
  test("should return true for plain objects", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1, b: 2 })).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  test("should return false for null and primitives", () => {
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject(42)).toBe(false);
    expect(isPlainObject("string")).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(Symbol("sym"))).toBe(false);
  });

  test("should return false for built-in objects", () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(new Map())).toBe(false);
    expect(isPlainObject(new Set())).toBe(false);
    expect(isPlainObject(new WeakMap())).toBe(false);
    expect(isPlainObject(new WeakSet())).toBe(false);
    expect(isPlainObject(new RegExp("a"))).toBe(false);
    expect(isPlainObject(Math)).toBe(false);
    expect(isPlainObject(JSON)).toBe(false);
    expect(isPlainObject(new Error("Oops"))).toBe(false);
  });

  test("should return false for functions", () => {
    expect(isPlainObject(function () {})).toBe(false);
    expect(isPlainObject(() => {})).toBe(false);
    expect(isPlainObject(class {})).toBe(false);
  });

  test("should return false for class instances", () => {
    class MyClass {}
    expect(isPlainObject(new MyClass())).toBe(false);
  });

  test("should return false for objects with a custom prototype", () => {
    const objWithProto = Object.create({ someProp: 123 });
    expect(isPlainObject(objWithProto)).toBe(false);
  });
});
