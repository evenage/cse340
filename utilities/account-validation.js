const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

/* **********************************
 * Registration Data Validation Rules
 ********************************* */
validate.registrationRules = () => {
  return [
    // First name is required and must be a string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // Last name is required and must be a string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // Valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error(
            "Email exists. Please log in or use a different email."
          );
        }
      }),

    // Password is required and must be a strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors: errors.array(),
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* **********************************
 * Login Data Validation Rules
 ********************************* */
validate.loginRules = () => {
  return [
    // Valid email is required
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // Password is required
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required"),
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors: errors.array(),
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

/*******************************
 * Update Account Rules
 **************************/
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("First name is required"),

    body("account_lastname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Last name is required"),

    body("account_email")
      .trim()
      .escape()
      .isEmail()
      .withMessage("Invalid email address")
      .custom(async (email, { req }) => {
        const account = await accountModel.getAccountByEmail(email);
        if (account && account.account_id !== req.body.account_id) {
          throw new Error("Email address already exists");
        }
      }),
  ];
};

/****************************
 * Check update rules
 *********************/
validate.checkUpdateData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("account/update", { errors: errors.array() });
  }
  next();
};

/**************************
 * Password Rules
 ******************/
validate.passwordRules = () => {
  return [
    body("new_password")
      .trim()
      .escape()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/
      )
      .withMessage(
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      ),

    body("confirm_password")
      .trim()
      .escape()
      .isLength({ min: 8 })
      .withMessage("Confirm password must be at least 8 characters long")
      .custom((confirmPassword, { req }) => {
        if (confirmPassword !== req.body.new_password) {
          throw new Error("Passwords do not match");
        }
      }),
  ];
};

/*****************
 * Check password data
 *********************/
validate.checkPasswordData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("account/update", { errors: errors.array() });
  }
  next();
};

module.exports = validate;
