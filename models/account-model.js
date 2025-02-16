const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

/***************************
 * week 5 updates account
 *
 * ****************************/
async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email
) {
  try {
    const data = await pool.query(
      `UPDATE accounts SET first_name = ?, last_name = ?, email = ? WHERE account_id = ?`,
      [account_firstname, account_lastname, account_email, account_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("updateAccount error " + error);
    return null;
  }
}

/***************************
 * update password
 *
 **************************/
async function updatePassword(account_id, hashedPassword) {
  try {
    await pool.execute(
      `UPDATE accounts SET password = ? WHERE account_id = ?`,
      [hashedPassword, account_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("updatePassword error " + error);
    return null;
  }
}

// Function to query account information
const getAccountView= (account_id, callback) => {
  const query = 'SELECT * FROM accounts WHERE account_id = $1';
  const values = [account_id];
  db.query(query, values, (err, result) => {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
};


module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  updateAccount,
  updatePassword,
  getAccountView
};
