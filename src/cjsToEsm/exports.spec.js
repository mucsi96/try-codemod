const transformer = require("./exports");
const { testTransformer } = require("../testUtils");

describe("exports", () => {
  test("Migrates module exports", () => {
    testTransformer(
      transformer,
      `
        const a = 1;
        function b () {}
        module.exports = {
          a,
          b
        }
      `,
      `
        export const a = 1;
        export function b () {}
      `
    );
  });
});
