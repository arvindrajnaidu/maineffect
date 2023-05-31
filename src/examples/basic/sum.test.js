import { logger } from "./logger";
import { two } from "./sum";

var mockLogger = {
    file: jest.fn().mockReturnThis(),
    debug: jest.fn().mockReturnThis(),
};

// var mockLoggerModule = ;

jest.mock("./logger", () => {
  return {
    __esModule: true,
    logger: jest.fn(() => {
        return mockLogger
    }),
  };
});

describe("two", () => {
  it("should call logger, file, and debug methods with the correct arguments", () => {
    const result = two();
    expect(logger).toHaveBeenCalledWith("this");
    expect(mockLogger.file).toHaveBeenCalledWith("is");
    expect(mockLogger.debug).toHaveBeenCalledWith("awesome");
  });
});
