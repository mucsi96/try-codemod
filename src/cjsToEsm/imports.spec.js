const transformer = require("./imports");
const { testTransformer } = require("../testUtils");

describe("imports", () => {
  test("Migrates require to import", () => {
    testTransformer(
      transformer,
      `
        require("import1");
      `,
      `
        import "import1";
      `
    );
  });
});
