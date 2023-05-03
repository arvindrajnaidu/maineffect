import { parseFn, Stubs } from "../maineffect";

describe("Stubs", () => {
  const parsed = parseFn(require.resolve("./stubs"));

  test("should handle chain of objects", () => {
    const stubs = Stubs(jest.fn);
    parsed
      .find("one")
      .stub("logger.stream.foo.bar.info()", stubs.createStub)
      .callWith();
    expect(stubs.getStubs().info).toBeCalledWith("adding");
  });

  test("should handle chain of functions", () => {
    const stubs = Stubs(jest.fn);
    parsed
      .find("two")
      .stub("logger().info().debug()", stubs.createStub)
      .callWith();
    expect(stubs.getStubs().logger).toBeCalledWith("this");
    expect(stubs.getStubs().info).toBeCalledWith("is");
    expect(stubs.getStubs().debug).toBeCalledWith("awesome");
  });

  test("should handle a mix of objects and functions", () => {
    const stubs = Stubs(jest.fn);
    parsed
      .find("three")
      .stub("logger.info().severe.armageddon()", stubs.createStub)
      .callWith();
    expect(stubs.getStubs().armageddon).toBeCalledWith("explosive");
  });
});
