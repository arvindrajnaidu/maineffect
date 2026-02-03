import { expect } from "chai";
import { parseFn } from "../maineffect";

const parsed = parseFn(require.resolve("./fnExpression"), {
  goo: jest.fn(),
});

describe("barani", () => {
  beforeEach(() => {
    parsed.reset();
  });
  it("should find a function expression", () => {
    let result = parsed.find("bar1").callWith();
    expect(result).to.equal(1);
  });
  it("should find an anonymous function expession with comments", () => {
    let result = parsed.find("bar2").callWith();
    expect(result).to.equal(2);
  });
  it("should find an anonymous function expression assigned to a variable", () => {
    let result = parsed.find("bar3").callWith();
    expect(result).to.equal(3);
  });
});
