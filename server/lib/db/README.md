# How to add tables to the database and autopopulate them

## 1. Create a table model in /models/<name>.js

Preferably the name of the model should be close to what the table will be named.
Example: If table is named `tbl_milestones` ideally you would use `milestones.js`

You should copy an existing model and modify it since all the logic is done inside you just need to change a couple lines (see example.js)

## 2. Create a seed file in /seeds/<name>.js

Preferably the name of the seeds should be close to what the table will be named.
Example: If table is named `tbl_milestones` ideally you would use `milestones.js`

You should copy an existing model and modify it since all the logic is done inside you just need to change a couple lines (see example.js)

## 3. Import the model to the database

To add the model to your database import the new model file in the `config.js` file

You need to import it first at the beginning of the file: `const exampleModel = require("./models/example.js")`
Then call the `create` function somewhere in the `config.js` script: `exampleModel.create(sql, **true**)` (please not that adding the parameter true will remove the previous table and create a new one, if the parameter is not declared and the table exists already the table will not be replaced!)