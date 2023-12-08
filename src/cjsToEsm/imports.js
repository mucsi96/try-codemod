function transformer(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  return root
    .find(j.ExpressionStatement, {
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'require'
        }
      }
    })
    .forEach((path) => {
      j(path).replaceWith(j.importDeclaration([], path.value.expression.arguments[0]));
    })
    .toSource(options);
}

transformer.displayName = "migrateImports";

module.exports = transformer;
