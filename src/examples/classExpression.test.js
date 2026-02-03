import { expect } from "chai";
import { parseFn } from "../maineffect";

const parsed = parseFn(require.resolve("./classExpression"));

describe("ClassExpression", () => {
  beforeEach(() => {
    parsed.reset();
  });

  it("should find a class expression assigned to a variable", () => {
    const result = parsed
      .find("Foo")
      .find("greet")
      .callWith("World");
    expect(result).to.equal("Hello World");
  });

  it("should find a named class expression by its own name", () => {
    const result = parsed
      .find("Bar")
      .find("getValue")
      .callWith();
    expect(result).to.equal(42);
  });
});
