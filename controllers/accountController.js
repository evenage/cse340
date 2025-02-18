/* ****************************************
 * Account controller
 *************************************** */
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const e = require("connect-flash");
require("dotenv").config();


/* ****************************************
 * Deliver login view
 *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login",
  { title: "Login",
  nav,
  errors: null });
}

/* ****************************************
 * Deliver register view
 *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 * Process Login
 *************************************** */
async function loginAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const loginResult = await accountModel.loginAccount(
    account_email,
    account_password
  );
  if (loginResult) {
    req.session.userId = loginResult.id;
    req.flash("notice", `Welcome, you're logged in.`);
    res.status(200).render("dashboard", { 
    title: "Dashboard",
     nav,
    errors: null });
  } else {
    req.flash("notice", "Sorry, the login failed.");
    res.status(401).render("account/login", { 
    title: "Login",
     nav,
    errors: null });
  }
}

/* ****************************************
 * Process Registration
 *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", { title: "Login", nav, errors:null });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", { title: "Registration", nav, errors:null});
  }
}

/* ****************************************
 *account  management view
 *************************************** */
async function buildAccountManagementView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/**********************************
 * get account information on
 *  login
 * ******************************/

// Render the account update view
async function getAccountView(req, res, next) {
  if (!req.user) return res.redirect("/account/login"); // Redirect if not logged in

  let nav = await utilities.getNav();
  const accountData = req.user;

  res.render("./account/update",
    {
    title: "Update Account",
    nav,
    errors: null,
    accountData,
  });
}

// Handle account updates
async function updateAccount(req, res, next) {
  try {
    const { account_id, first_name, last_name, email } = req.body;

    let nav = await utilities.getNav();
    const existingUser = await accountModel.getAccountByEmail(email);

    // Prevent email duplication (only allow update if it's the same user)
    if (existingUser && existingUser.account_id !== parseInt(account_id)) {
      return res.render("./account/update", {
        title: "Update Account",
        nav,
        errors: [{ msg: "Email is already in use." }],
        accountData: req.body,
      });
    }

    // Update account details
    await accountModel.updateAccount(account_id, first_name, last_name, email);

    res.redirect("/account/manage");
  } catch (error) {
    console.error(error);
    res.render("./account/update", {
      title: "Update Account",
      nav,
      errors: [{ msg: "Error updating account." }],
      accountData: req.body,
    });
  }
}

// Handle password updates
async function updatePassword(req, res, next) {
  try {
    const { account_id, new_password } = req.body;
    let nav = await utilities.getNav();
    if (new_password.length < 8) {
      return res.render("./account/update", {
        title: "Update Account",
        nav,
        errors: [{ msg: "Password must be at least 8 characters long." }],
        accountData: req.body,
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password in the database
    await accountModel.updatePassword(account_id, hashedPassword);
    res.redirect("/account/manage");
  } catch (error) {
    console.error(error);
    res.render("./account/update", {
      title: "Update Account",
      nav,
      errors: [{ msg: "Error updating password." }],
      accountData: req.body,
    });
  }
}


// logout process
async function logout(req, res)  {
  res.clearCookie('jwt');
  req.flash('success', 'You have been logged out');
  res.redirect('/');
};

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagementView,
  getAccountView,
  updateAccount,
  updatePassword,
  logout
};