function transformer(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  return root
    .find(j.VariableDeclaration, {
      declarations: [
        {
          type: "VariableDeclarator",
          id: {
            type: "Identifier",
          },
          init: {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "require",
            },
          },
        },
      ],
    })
    .forEach((path) => {
      j(path).replaceWith(
        j.importDeclaration(
          [j.importDefaultSpecifier(path.value.declarations[0].id)],
          path.value.declarations[0].init.arguments[0]
        )
      );
    })
    .toSource(options);
}

transformer.displayName = "migrateNamedImports";

module.exports = transformer;
