// TODO require the parts of Keystone needed for this script to work
require('../../keystone');
var fs = require('fs');
var path = require('path');
var schema = require('../schema');
var printSchema = require('graphql/utilities').printSchema;

// Save user readable type system shorthand of schema to help DX
fs.writeFileSync(
  path.join(__dirname, '../schema.graphql'),
  printSchema(schema)
);
process.exit();
