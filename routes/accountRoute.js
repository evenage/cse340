/* *********************************
 * Account routes
 * deliver login view activity
 ********************************** */
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

// route to Deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// route to Deliver register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// route to account management view
//router.get("/accountManagement", accountController.buildAccountManagementView);

router.get(
  "/",
  utilities.checkLogin,
  accountController.buildAccountManagementView
);

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login data
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

module.exports = router;
