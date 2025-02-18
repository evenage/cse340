/* *********************************
 * Account Routes
 ********************************** */
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

// Route to deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to deliver registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Route to process registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Route to process login data
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to deliver account management view
router.get("/", utilities.handleErrors(accountController.buildManagementView));

// Route to deliver account update view
router.get(
  "/update/:account_id",
  utilities.handleErrors(accountController.getUpdateAccountView)
);

// Route to process account update
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Route to process password update
router.post(
  "/password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

// Route to handle logout
router.get("/logout", utilities.handleErrors(accountController.logout));


module.exports = router;

//login account
//router.get("/loginAccount", utilities.handleErrors (accountController.loginAccount))
 