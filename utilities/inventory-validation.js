const utilities = require("../utilities/");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");

const validate = {};

/* **********************************
 * Classification Data Validation Rules
 ********************************* */
validate.classificationRules = () => {
  return [
    // classification name is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a classification name.")
      .isLength({ min: 1 })
      .withMessage("Classification name must have at least one character."),
  ];
};

/* ******************************
 * Check classification data and return errors or continue to add classification
 ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors: errors.array(), // Ensure errors are passed correctly
      title: "Add Classification",
      nav,
      classification_name: req.body.classification_name, // Sticky input
    });
    return;
  }
  next();
};

/* **********************************
 * Inventory Data Validation Rules
 ********************************* */
validate.inventoryRules = () => {
  return [
    // make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a make."),
// model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a model."),
    // year is required and must be number
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Please provide a year."),
    // classification id is required and must be number
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please select a classification.")
      .isInt()
      .withMessage("Invalid classification ID."),
  ];
};

/* ******************************
 * Check inventory data and return errors or continue to add inventory
 ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(
      req.body.classification_id
    ); // Ensure sticky classification selection
    res.render("inventory/add-inventory", {
      errors: errors.array(), // Extract error messages
      title: "Add Inventory",
      nav,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      classification_id: req.body.classification_id, // Sticky selection
      classificationList,
    });
    return;
  }
  next();
};

module.exports = validate;
