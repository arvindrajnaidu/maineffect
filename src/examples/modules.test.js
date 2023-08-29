import util from "util";
import { parse } from "../maineffect";

const parsed = parse(require.resolve("./modules"));

describe("modules", () => {
  describe("should be able to provide a private fn", () => {
    it("should return undefined", async () => {
      const result = parsed
        .find("show")
        .provide({ util, foo: parsed.find("foo").getFn()})
        .callWith({ foo: "bar" });
      expect(result).toBe("foo");
    });
  });
  describe("should be able to see the imports removed", () => {
    it("should return undefined", async () => {
      const result = parsed.getSandbox().getRemovedImports();
      expect(result.length).toBe(3);
    });
  });
});
