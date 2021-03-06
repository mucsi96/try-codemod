const transformer = require("./getIn");
const { testTransformer } = require("../testUtils");

describe("getIn", () => {
  test("Remove getIn calls", () => {
    testTransformer(
      transformer,
      `
        import { fromJS } from "immutable";

        const m = fromJS({ a: { b: true } }).getIn(['a', 'b']);
      `,
      `
        import { fromJS } from "immutable";

        const m = fromJS({ a: { b: true } }).a?.b;
      `
    );
  });

  test("Doesn`t tranform getIn in chains", () => {
    testTransformer(
      transformer,
      `
        import { fromJS } from "immutable";

        const m = fromJS({ a: { b: true } }).getIn(['a', 'b']).props();
      `,
      `
        import { fromJS } from "immutable";

        const m = fromJS({ a: { b: true } }).getIn(['a', 'b']).props();
      `
    );
  });

  test("Provides fallback value", () => {
    testTransformer(
      transformer,
      `
      import { fromJS } from "immutable";

      const m = fromJS({ a: { b: true } }).getIn(['a', 'b'], 'fallback');
      `,
      `
      import { fromJS } from "immutable";

      const m = (fromJS({ a: { b: true } }).a?.b ?? 'fallback');
      `
    );
  });

  test("Handles array length 1", () => {
    testTransformer(
      transformer,
      `
        import { fromJS } from "immutable";

        const m = fromJS({ a: { b: true } }).getIn(['a']);
      `,
      `
        import { fromJS } from "immutable";

        const m = fromJS({ a: { b: true } }).a;
      `
    );
  });

  test("Handles array length 3", () => {
    testTransformer(
      transformer,
      `
        import { fromJS } from "immutable";

        const m = fromJS({ a: { b: true } }).getIn(['a', 'b', 'c']);
      `,
      `
        import { fromJS } from "immutable";

        const m = fromJS({ a: { b: true } }).a?.b?.c;
      `
    );
  });

  test("Handles arrays", () => {
    testTransformer(
      transformer,
      `
        import { fromJS } from "immutable";

        const m = fromJS({ a: { b: true } }).getIn(['a', 0, 'c']);
      `,
      `
        import { fromJS } from "immutable";

        const m = fromJS({ a: { b: true } }).a?.[0]?.c;
      `
    );
  });

  test("Handles arrays with string keys", () => {
    testTransformer(
      transformer,
      `
        import { fromJS } from "immutable";

        const m = fromJS({ a: { b: true } }).getIn(['a', '0', 'c']);
      `,
      `
        import { fromJS } from "immutable";

        const m = fromJS({ a: { b: true } }).a?.[0]?.c;
      `
    );
  });

  test("Handles dynamic values", () => {
    testTransformer(
      transformer,
      `
        import { fromJS } from "immutable";

        const key = { name: 'a' };
        const m = fromJS({ a: { b: true } }).getIn(['a', key.name, 'c']);
      `,
      `
        import { fromJS } from "immutable";

        const key = { name: 'a' };
        const m = fromJS({ a: { b: true } }).a?.[key.name]?.c;
      `
    );
  });

  test("Ignores files with no getIn", () => {
    testTransformer(
      transformer,
      `
        import { fromJS } from "immutable";

        const m = fromJS({ a: { b: true } }).a;
      `,
      `
        import { fromJS } from "immutable";

        const m = fromJS({ a: { b: true } }).a;
      `
    );
  });
});
