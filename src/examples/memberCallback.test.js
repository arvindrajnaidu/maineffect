import { expect } from "chai";
import { parseFn } from "../maineffect";

const parsed = parseFn(require.resolve("./memberCallback"), {
  app: { get: jest.fn(), post: jest.fn() },
});

describe("findCallback with member expressions", () => {
  beforeEach(() => {
    parsed.reset();
  });

  it("should find a callback passed to app.get", () => {
    const sendStub = jest.fn();
    parsed
      .findCallback("app.get", 1)
      .callWith({ params: { name: "World" } }, { send: sendStub });
    expect(sendStub.mock.calls[0][0]).to.equal("Hello World");
  });

  it("should find a callback passed to app.post", () => {
    const jsonStub = jest.fn();
    parsed
      .findCallback("app.post", 1)
      .callWith({ body: { item: "test" } }, { json: jsonStub });
    expect(jsonStub.mock.calls[0][0]).to.deep.equal({ created: true, body: { item: "test" } });
  });
});
