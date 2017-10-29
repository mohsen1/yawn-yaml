var Yawn = require('./yawn-yaml-babelfied.js');

module.exports = YawnYaml;

function YawnYaml(content) {
  this.loadedYaml = new Yawn(content);
}
YawnYaml.prototype.set = function(json) {
  this.loadedYaml.json = json;
}
YawnYaml.prototype.assign = function (json) {
  this.loadedYaml.json = Object.assign(this.loadedYaml.json, json);
}
YawnYaml.prototype.getYaml = function() {
  return this.loadedYaml.yaml;
}
YawnYaml.prototype.getJson = function() {
  return this.loadedYaml.json;
}

Object.defineProperty(YawnYaml.prototype, 'json', { get: function() {
  return this.loadedYaml.json }
});
Object.defineProperty(YawnYaml.prototype, 'yaml', { get: function() {
  return this.loadedYaml.yaml }
});
