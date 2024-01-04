function JsonToXml() {
  this.result = [];
}
JsonToXml.prototype.spacialChars = ["&", "<", ">", "'", '"'];
JsonToXml.prototype.validChars = ["&amp;", "&lt;", "&gt;", "&apos;", "&quot;"];
JsonToXml.prototype.toString = function () {
  return this.result.join("");
};
JsonToXml.prototype.replaceSpecialChar = function (s) {
  for (let i = 0; i < this.spacialChars.length; i++) {
    s = s.replace(new RegExp(this.spacialChars[i], "g"), this.validChars[i]);
  }
  return s;
};
JsonToXml.prototype.appendText = function (s) {
  s = this.replaceSpecialChar(s);
  this.result.push(s);
};
JsonToXml.prototype.appendAttr = function (key, value) {
  this.result.push(" " + key + '="' + value + '"');
};
JsonToXml.prototype.appendFlagBeginS = function (s) {
  this.result.push("<" + s);
};
JsonToXml.prototype.appendFlagBeginE = function () {
  this.result.push(">");
};
JsonToXml.prototype.appendFlagEnd = function (s) {
  this.result.push("</" + s + ">");
};
JsonToXml.prototype.parse = function (json) {
  this.convert(json);
  return this.toString();
};
JsonToXml.prototype.convert = function (obj) {
  if(typeof obj === "string"){
    this.appendText(obj)
    return 
  }
  let nodeName = obj.xtag || "nameUndefined";
  this.appendFlagBeginS(nodeName);
  let arrayMap = {};
  for (let key in obj) {
    let item = obj[key];
    if (key == "xtag") {
      continue;
    }
    if (typeof item === "string" && key !== "text") {
      this.appendAttr(key, item);
    }
    if (Array.isArray(item)) {
      arrayMap[key] = item;
    }
  }
  this.appendFlagBeginE();
  if (obj.text) {
    this.appendText(obj.text);
  }
  for (let key in arrayMap) {
    let items = arrayMap[key];
    for (let i = 0; i < items.length; i++) {
      this.convert(items[i]);
    }
  }
  this.appendFlagEnd(nodeName);
};
export {JsonToXml}