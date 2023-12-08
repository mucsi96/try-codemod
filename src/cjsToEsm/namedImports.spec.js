const transformer = require("./namedImports");
const { testTransformer } = require("../testUtils");

describe("namedImports", () => {
  test("Migrates named imports", () => {
    testTransformer(
      transformer,
      `
        const { a } = require("import1");
      `,
      `
        import { a } from "import1";
      `
    );
  });
});
