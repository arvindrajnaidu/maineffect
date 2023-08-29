import { parseFn } from "../maineffect";
const parsed = parseFn(
    require.resolve("./annotations")
    , { routes: () => {} }
  );


describe("annotations", () => {

  beforeEach(() => {
    parsed.reset();
  });

  describe("foo()", () => {
    it("should find annotated fn", async () => {
      const result = await parsed.find("vHandler").callWith();
      expect(result).toBe(1);
    });
  });

  describe("barHandler()", () => {
    it("should find annotated fn", async () => {
      const result = await parsed.find("barHandler").callWith();
      expect(result).toBe(2);
    });
  });
});
