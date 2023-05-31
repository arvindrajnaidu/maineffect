import { expect } from "chai";
import { parseFn } from "../maineffect";

describe("Side Effects", () => {
  const parsed = parseFn(require.resolve("./side-effects.js"));
  beforeEach(() => {
    parsed.reset();
  });

  it("should return a word", () => {
    const result = parsed.find("generateFoo").callWith();
    expect(result).to.equal("foo");
  });

  it("should return a word using a service", async () => {
    const result = await parsed
      .find("generateFooService")
      .provide("request", () => "foo")
      .callWith();
    expect(result).to.equal("foo");
  });
});
