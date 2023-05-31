import { expect } from "chai";
import { parseFn } from "../maineffect";

const parsed = parseFn(require.resolve("./partner.js"));

describe("getFoo()", () => {
  beforeEach(() => {
    parsed.reset();
  });
  it("should return a word", () => {
    parsed.find("Conversation").callWith();
  });
  it("should return a word", () => {
    parsed.find("replyTo").callWith(1);
  });
});
