/* *********************************
 * Account routes
 * deliver login view activity
 ********************************** */
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

/****************
 * unit4 deliver l
 * route to Deliver login view
 * **************************/
router.get("/login", utilities.handleErrors(accountController.buildLogin));

/*********************
 * 
 * route to Deliver register view
***************************/
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

//login account
router.get("/loginAccount", utilities.handleErrors (accountController.loginAccount))

// route to checklogin view
//router.get("/",utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView));

//management
router.get("/management",utilities.handleErrors (accountController.buildManagementView))

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

// // update account get view
router.get(
  "/update/:account_id",
  utilities.handleErrors(accountController.getUpdateAccountView)
);

// //update account
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

//update password
router.post(
  "/password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

//logout proces
router.get("/logout", utilities.handleErrors(accountController.logout));

// delete account
//router.get(
 // "/delete/:account_id",
  //-utilities.handleErrors(accountController.deleteAccount)
//);




module.exports = router;


