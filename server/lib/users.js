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
    const { username, password, confirmPassword, email, confirmEmail } = data; // eslint-disable-line
    // Validate data here: check if user exists, if the passwords match, if the email is valid
    // How to crypt using bcrypt:
    try {
      const cryptedPwd = await bcrypt.hash(password, 10);
      if (password == confirmPassword && email == confirmEmail) {
        await sql("tbl_users").insert({
          username: username,
          password: cryptedPwd,
          email: email
        });
        // everything went fine
      }
    } catch (e) {
      // something failed in the try block (e holds the error)
      console.log(e);
    }
  },
  async authenticate(userName, password) {
    let rows = await sql("tbl_users")
      .select()
      //.where({ username: userName });
      .whereRaw("username = ?", [userName]); // Bind values with ?, bind column names with ?? (knex autoescapes the bound data)
    const match = await bcrypt.compare(password, rows[0].password);
    if (match) {
      // doSomething
      return true;
    } else {
      // userOrPasswordInvalid
      return false;
    }
  },
  async deauthenticate() {
    throw "Empty block";
  }
};

module.exports = users;
