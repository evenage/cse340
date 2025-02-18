/* ****************************************
 * Account controller
 *************************************** */
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 * Deliver login view
 *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 * Deliver register view
 *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 * Process login request
 *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600 * 1000,
      });
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Invalid credentials. Please try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error(error);
    req.flash("notice", "An error occurred. Please try again.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
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
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", "Error processing registration.");
    return res.status(500).render("account/register", {
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
      `Congratulations, ${account_firstname}. Please log in.`
    );
    return res
      .status(201)
      .render("account/login", { title: "Login", nav, errors: null });
  } else {
    req.flash("notice", "Registration failed.");
    return res
      .status(501)
      .render("account/register", { title: "Registration", nav, errors: null });
  }
}

/* ****************************************
 * Account management view
 *************************************** */
async function buildManagementView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 * Get account information for update
 *************************************** */
async function getUpdateAccountView(req, res, next) {
  if (!req.user) return res.redirect("/account/login");
  let nav = await utilities.getNav();
  const accountData = req.user;
  res.render("./account/update", {
    title: "Update Account",
    nav,
    errors: null,
  });
}

/* ****************************************
 * Update account information
 *************************************** */
async function updateAccount(req, res, next) {
  try {
    const { account_id, account_firstname, account_lastname, account_email } =
      req.body;
    let nav = await utilities.getNav();
    const existingUser = await accountModel.getAccountByEmail(account_email);
    if (existingUser && existingUser.account_id !== parseInt(account_id)) {
      return res.render("./account/update", {
        title: "Update Account",
        nav,
        errors: [{ msg: "Email is already in use." }],
        accountData: req.body,
      });
    }

    // Update account details
    await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    res.redirect("/account/management");
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

/* ****************************************
 * Update password
 *************************************** */
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

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await accountModel.updatePassword(account_id, hashedPassword);

    res.redirect("/account/management");
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

/* ****************************************
 * Logout process
 *************************************** */
async function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("success", "You have been logged out");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagementView,
  getUpdateAccountView,
  updateAccount,
  updatePassword,
  logout,
};
 