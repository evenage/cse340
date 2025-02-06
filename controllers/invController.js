const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const bcrypt = require("bcryptjs");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId; // Get the classification ID from the URL
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    ); // Fetch data from the model

    // Handle case where no data is found
    if (!data || data.length === 0) {
      return next({
        status: 404,
        message: "No inventory found for this classification.",
      });
    }

    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;

    // Render the view with data
    res.render("./inventory/classification", {
      title: `${className} vehicles`, // Title for the page
      nav, // Navigation bar
      grid, // The inventory grid
    });
  } catch (error) {
    // Handle errors and pass to the error handler
    next({
      status: 500,
      message: "An error occurred while processing your request.",
      error: error.message,
    });
  }
};

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  console.log(inventory_id);
  const data = await invModel.getInventoryById(inventory_id);
  console.log(data);
  const grid = await utilities.buildInventoryGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].inventory_name;
  res.render("./inventory/vehicle-details", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ****************************************
 * management view
 *************************************** */
invCont.getManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  });
};

/* ****************************************
  * Deliver add inventory view
/  *************************************** */
invCont.getAddInventoryView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors,
    });
  } catch (error) {
    console.error("Errors loading add classification view:", error);
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav: null,
      classifications: [],
      errors: [{ msg: "Failed to load data. Please try again later." }],
    });
  }
};

/* ****************************************
 * Deliver add classification view
 ********************************* */
invCont.getAddClassificationView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-classification", {
      title: "Add classification",
      nav,
      classificationList,
      errors,
    });
  } catch (error) {
    console.error("Errors loading add classification view:", error);
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav: null,
      classifications: [],
      errors: [{ msg: "Failed to load data. Please try again later." }],
    });
  }
};

/****************************************
 * Process add classification
 *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const classificationResult = await inventoryModel.addClassification(
    classification_name
  );
  if (classificationResult) {
    req.flash("notice", `Classification added successfully.`);
    res
      .status(201)
      .render("inventory/management", { title: "Inventory Management", nav });
  } else {
    req.flash("notice", "Sorry, the classification addition failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: "Failed to add classification. Please try again.",
    });
  }
};

/* ****************************************
 * Process add inventory
 *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const { inv_make, inv_model, inv_year, classification_id } = req.body;
  const inventoryResult = await inventoryModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    classification_id
  );

  if (inventoryResult) {
    req.flash("notice", `Inventory added successfully.`);
    res
      .status(201)
      .render("inventory/management", { title: "Inventory Management", nav });
  } else {
    req.flash("notice", "Sorry, the inventory addition failed.");

    // Ensure classification list remains available
    const classificationList = await utilities.buildClassificationList(
      classification_id
    );

    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors, // "Failed to add inventory. Please check your inputs and try again.",
    });
  }
};

module.exports = invCont;
