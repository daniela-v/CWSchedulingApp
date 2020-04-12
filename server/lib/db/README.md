# How to add tables to the database and autopopulate them

## 1. Create a table model in /models/`name`.js

Preferably the name of the model should be close to what the table will be named.
Example: If table is named `tbl_milestones` ideally you would use `milestones.js`

You should copy an existing model and modify it since all the logic is done inside you just need to change a couple lines

## 2. Create a seed file in /seeds/`name`.js

Seeds are used to auto-populate the tables on creation mostly

Preferably the name of the seeds should be close to what the table will be named.
Example: If table is named `tbl_milestones` ideally you would use `milestones.js`

You should copy an existing seed and modify it since all the logic is done inside you just need to change a couple lines

## 3. Import the model to your database config

The models folder is automatically scanned for models and the models are automatically added
