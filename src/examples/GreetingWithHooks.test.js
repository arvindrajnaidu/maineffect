import { expect } from "chai";
import { parseFn } from "../maineffect";
import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

describe("GreeetingWithHooks", () => {
  const parsed = parseFn(require.resolve("./GreetingWithHooks.js"), {
    React,
    useState,
  });

  it("should render", () => {
    const Greeting = parsed.find("Greeting").getFn();

    const { getByTestId } = render(<Greeting greet="FOO" />);

    fireEvent.click(getByTestId("greet"));
    expect(screen.getByText("Hello FOO the great")).to.be.ok;
  });
});
