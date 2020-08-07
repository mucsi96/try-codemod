function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const importDeclaration = root.find(j.ImportDeclaration, {
    source: { value: "immutable" },
  });
  const hasMultipleSpecifiers =
    importDeclaration.find(j.ImportSpecifier).length > 1;
  const importSpecifier = importDeclaration.find(j.ImportSpecifier, {
    imported: { name: "List" },
  });
  const localName = importSpecifier.get(0).node.local.name;

  if (localName) {
    if (hasMultipleSpecifiers) {
      importSpecifier.remove();
    } else {
      importDeclaration.remove();
    }
  }

  return root
    .find(j.CallExpression, {
      callee: { name: localName },
    })
    .forEach((path) => {
      const args = path.node.arguments;
      j(path).replaceWith(args.length ? args[0] : j.arrayExpression([]));
    })
    .toSource();
}

module.exports = transformer;
