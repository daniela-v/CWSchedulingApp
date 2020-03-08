const bcrypt = require("bcrypt"); // bcrypt is a great module to crypt passwords: https://www.npmjs.com/package/bcrypt#with-promises
// const validate = require("validate"); // validate is a great module to validate data: https://validatejs.org/
const sql = require("./db/config.js");

const users = {
  async register(data) {
    // Example of data variable:
    // {
    //   user: "username",
    //   pwd: "plainPassword",
    //   confirmPwd: "plainPassword",
    //   email: "123@abc.com",
    //   confirmEmail: "123@abc.com"
    // }
    // Using object destructuring we store the values into the variables specified
    const { user, pwd, confirmPwd, email, confirmEmail } = data; // eslint-disable-line
    // Validate data here: check if user exists, if the passwords match, if the email is valid
    // How to crypt using bcrypt:
    try {
      const cryptedPwd = await bcrypt.hash(pwd, 10);
      await sql("tableName").insert({
        username: user,
        password: cryptedPwd,
        email: email
      });
      // everything went fine
    } catch (e) {
      // something failed in the try block (e holds the error)
    }
  },
  async authenticate(data) {
    // Example of data variable:
    // {
    //   user: "username or email",
    //   pwd: "plainPassword",
    // }
    // Using object destructuring we store the values into the variables specified
    const { user, pwd } = data;
    // Select rows from database where user matches
    let rows = await sql("tableName")
      .select()
      .whereRaw("username = ?", [user]); // Bind values with ?, bind column names with ?? (knex autoescapes the bound data)
    const match = await bcrypt.compare(pwd, rows[0].password);
    if (match) {
      // doSomething
    } else {
      // userOrPasswordInvalid
    }
    return rows;
  },
  async deauthenticate() {
    throw "Empty block";
  }
};

module.exports = users;
