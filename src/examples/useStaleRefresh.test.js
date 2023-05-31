import { parseFn, Stubs } from "../maineffect";
import { fireEvent, render, screen } from "@testing-library/react";
import React, { useEffect, useState } from "react";

let parsed = parseFn(require.resolve("./useStaleRefresh"));

describe("useStaleRefresh", () => {
  
  beforeEach(() => {
    parsed.reset();
  });

  test("should say is loading and data should be default on first invocation", () => {
    let a = parsed
      .find("useStaleRefresh")
      .provide({
        useState: (...args) => [...args],
        useEffect: jest.fn(),
      })
      .callWith("foo", "bar");
    expect(a).toEqual(["bar", true]);
  });

  test("should have correct state if cache has the URL", () => {
    const stub = Stubs(jest.fn);
    parsed
      .findCallback("useEffect", 0)
      .provide({
        CACHE: { foo: "fooData" },
        url: "foo",
        defaultValue: "bar",
      })
      .stub("setLoading()", stub.createStub)
      .stub("setData()", stub.createStub)
      .stub("fetch().then().then()", stub.createStub)
      .callWith();

    expect(stub.getStubs().setLoading).toBeCalledWith(false);
    expect(stub.getStubs().setData).toBeCalledWith("fooData");
  });

  test("should have correct state if cache does not have the URL", () => {
    const stub = Stubs(jest.fn);
    parsed
      .findCallback("useEffect", 0)
      .provide({
        CACHE: {},
        url: "foo",
        defaultValue: "bar",
      })
      .stub("setLoading()", stub.createStub)
      .stub("setData()", stub.createStub)
      .stub("fetch().then().then()", stub.createStub)
      .callWith();

    expect(stub.getStubs().setLoading).toBeCalledWith(true);
    expect(stub.getStubs().setData).toBeCalledWith('bar');
  });

  test("should have correct state if cache does not have the URL", () => {
    const stub = Stubs(jest.fn);
    const fn = parsed
      .findCallback("useEffect", 0)
      .provide({
        CACHE: {},
        url: "foo",
        defaultValue: "bar",
      })
      .stub("setLoading()", stub.createStub)
      .stub("setData()", stub.createStub)
      .stub("fetch().then()", stub.createStub)
    
    stub.getStubs().then.mockImplementation(fn => fn('foobar'));
    fn.callWith();

    expect(stub.getStubs().setLoading).toBeCalledWith(false);
    expect(stub.getStubs().setData).toBeCalledWith('foobar');
  });
});
