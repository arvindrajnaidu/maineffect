
import { parse } from "../maineffect";

const parsed = parse(require.resolve("./modules"));

describe("modules", () => {
    describe("should be able to see the imports removed", () => {
        it("should return undefined", async () => {
            const result = parsed.getSandbox().getRemovedImports();
            expect(result.length).toBe(3);
        });
    });
});
