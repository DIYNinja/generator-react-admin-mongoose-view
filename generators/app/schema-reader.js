const mongoose = require('mongoose');
require('mongoose-type-email');

var capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

var SchemaReader = function(modelPath) {
  var App = function() {};
  App.prototype.get = function(arg) {
    return mongoose;
  };
  this.paths = [];
  this.modelPath = modelPath;
  let createModel = require(this.modelPath);
  this.model = createModel(new App());
};

SchemaReader.prototype.getRessourceName = function() {
  return capitalize(this.model.modelName);
};

SchemaReader.prototype.getPaths = function() {
  for (const path in this.model.schema.paths) {
    if (this.model.schema.paths.hasOwnProperty(path)) {
      const pathObj = this.model.schema.paths[path];
      this.paths.push(pathObj.path);
    }
  }
  return this.paths;
};

module.exports = SchemaReader;
