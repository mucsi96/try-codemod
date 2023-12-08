const transformer = require("./defaultImports");
const { testTransformer } = require("../testUtils");

describe("defaultImports", () => {
  test("Migrates default imports", () => {
    testTransformer(
      transformer,
      `
        const a = require("import1");
      `,
      `
        import a from "import1";
      `
    );
  });
});
