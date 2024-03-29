import { expect } from "chai";
import { stub } from "sinon";
import { parse } from "../maineffect";

const parsed = parse(require.resolve("./casino"), {
  request: () => "Joe",
  // Logger: () => ({
  //   info: () => {},
  // }),
});

describe("casino", () => {
  const handler = parsed.find("handler");
  beforeEach(() => {
    parsed.reset();
  });
  it("should return undefined", async () => {
    const sendStub = stub();
    const result = await handler
      .provide("log", { info: () => {} })
      .inject("Math", { random: () => 1 })
      .callWith({ query: { user: "James" } }, { send: sendStub }).result;
    const expected = `Hello James. I am Joe. Your lucky number is 1`;
    expect(sendStub.calledWithExactly(expected)).to.equal(true);
    expect(result).to.equal(undefined);
  });
});
