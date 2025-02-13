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

/* ******************************
 * Check inventory data and return errors to be directed back to edit view
 ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationSelect(
      req.body.classification_id
    );
    const classificationList = await utilities.buildClassificationList(
      req.body.classification_id
    ); // Ensure sticky classification selection
    res.render("inventory/edit-inventory", {
      errors: errors.array(), // Extract error messages
      title: "Edit" + +req.body.inv_make + " " + req.body.inv_model,
      nav,
      inv_id: req.body.inv_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      classification_id: req.body.classification_id, // Sticky selection
      classificationList,
      classificationSelect,
    });
    return;
  }
  next();
};

/* ***************************
 *new inventory vaLIDATION RUELS
 *
 ****************************/

validate.newInventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .isInt({
        no_symbols: true,
      })
      .withMessage("The vehicle's classification is required."),

    body("inv_make")
      .trim()
      .escape()
      .isLength({
        min: 3,
      })
      .withMessage("A vehicle make is required."),

    body("inv_model")
      .trim()
      .escape()
      .isLength({
        min: 3,
      })
      .withMessage("A vehicle model is required."),

    body("inv_description")
      .trim()
      .escape()
      .isLength({
        min: 3,
      })
      .withMessage("A vehicle description is required."),

    body("inv_image")
      .trim()
      .isLength({
        min: 6,
      })
      .matches(/\.(jpg|jpeg|png|webp)$/)
      .withMessage("A vehicle image path is required and must be an image."),

    body("inv_thumbnail")
      .trim()
      .isLength({
        min: 6,
      })
      .matches(/\.(jpg|jpeg|png|webp)$/)
      .withMessage(
        "A vehicle thumbnail path is required and must be an image."
      ),

    body("inv_price")
      .trim()
      .isDecimal()
      .withMessage("A vehicle price is required."),

    body("inv_year")
      .trim()
      .isInt({
        min: 1900,
        max: 2099,
      })
      .withMessage("A vehicle year is required."),

    body("inv_miles")
      .trim()
      .isInt({
        no_symbols: true,
      })
      .withMessage("The vehicle's miles is required."),

    body("inv_color")
      .trim()
      .escape()
      .isLength({
        min: 3,
      })
      .withMessage("The vehicle's color is required."),
  ];
};

module.exports = validate;
