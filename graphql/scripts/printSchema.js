// TODO require the parts of Keystone needed for this script to work
import '../../keystone';
import fs from 'fs';
import path from 'path';
import schema from '../schema';
import {printSchema} from 'graphql/utilities';

// Save user readable type system shorthand of schema to help DX
fs.writeFileSync(
  path.join(__dirname, '../schema.graphql'),
  printSchema(schema)
);
process.exit();
