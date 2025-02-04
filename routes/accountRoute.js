/* *********************************
 *Account routes
 *deliver login view activity
 * ********************************** */
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

//route to Deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//route to Deliver register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);


(module.exports = router), accountController, utilities;
