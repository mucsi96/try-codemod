function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.MemberExpression, {
      property: { name: "size" },
    })
    .forEach((path) => {
      if (path.name === "object") {
        return;
      }

      j(path).replaceWith(
        j.memberExpression(path.node.object, j.identifier("length"))
      );
    })
    .toSource();
}

transformer.displayName = "size";

module.exports = transformer;
