function Enumeration(enumArg) {
  var i = 0,
    lbl = "",
    LBL = "";
  if (Array.isArray(enumArg)) {
    // a simple enum defined by a list of labels
    if (
      !enumArg.every(function (n) {
        return typeof n === "string";
      })
    ) {
      throw new ConstraintViolation(
        "A list of enumeration labels must be an array of strings!"
      );
    }
    this.labels = enumArg;
    this.enumLitNames = this.labels;
    this.codeList = null;
  } else if (typeof enumArg === "object" && Object.keys(enumArg).length > 0) {
    // a code list defined by a map
    if (
      !Object.keys(enumArg).every(function (code) {
        return typeof enumArg[code] === "string";
      })
    ) {
      throw new ConstraintViolation(
        "All values of a code list map must be strings!"
      );
    }
    this.codeList = enumArg;
    // use the codes as the names of enumeration literals
    this.enumLitNames = Object.keys(this.codeList);
    this.labels = this.enumLitNames.map(function (c) {
      return enumArg[c] + " (" + c + ")";
    });
  } else {
    throw new ConstraintViolation(
      "Invalid Enumeration constructor argument: " + enumArg
    );
  }
  this.MAX = this.enumLitNames.length;
  // generate the enumeration literals by capitalizing/normalizing the names
  for (i = 1; i <= this.enumLitNames.length; i++) {
    // replace " " and "-" with "_"
    lbl = this.enumLitNames[i - 1].replace(/( |-)/g, "_");
    // convert to array of words, capitalize them, and re-convert
    LBL = lbl
      .split("_")
      .map(function (lblPart) {
        return lblPart.toUpperCase();
      })
      .join("_");
    // assign enumeration index
    this[LBL] = i;
  }
  Object.freeze(this);
}
/*
 * Serialize a list of enumeration literals/indexes as a list of
 * enumeration literal names
 */
Enumeration.prototype.convertEnumIndexes2Names = function (a) {
  var listStr = a
    .map(function (enumInt) {
      return this.enumLitNames[enumInt - 1];
    }, this)
    .join(", ");
  return listStr;
};
