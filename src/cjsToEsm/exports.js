function transformer(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  return root
    .find(j.ExpressionStatement, {
      expression: {
        type: "AssignmentExpression",
        operator: "=",
        left: {
          type: "MemberExpression",
          object: {
            type: "Identifier",
            name: "module",
          },
          property: {
            type: "Identifier",
            name: "exports",
          },
        },
      },
    })
    .forEach((path) => {
      path.value.expression.right.properties.forEach((property) => {
        const name = property.key.name;

        root
          .find(j.VariableDeclaration, {
            declarations: [
              {
                type: "VariableDeclarator",
                id: {
                  type: "Identifier",
                  name,
                },
              },
            ],
          })
          .forEach((path) =>
            j(path).replaceWith(j.exportNamedDeclaration(path.value))
          );

        root
          .find(j.FunctionDeclaration, {
            id: {
              type: 'Identifier',
              name
            }
          })
          .forEach((path) =>
            j(path).replaceWith(j.exportNamedDeclaration(path.value))
          );
      });

      j(path).remove();
    })
    .toSource(options);
}

transformer.displayName = "migrateExports";

module.exports = transformer;
