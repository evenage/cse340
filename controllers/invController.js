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
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
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
  * Deliver add inventory view
/  *************************************** */
invCont.getAddInventoryView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      errors: null,
    });
  } catch (error) {
    console.error("Errors loading add classification view:", error);
    const classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add Classification",
      nav: null,
      classificationSelect: [],
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
      errors: null,
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
  const classificationResult = await invModel.addClassification(
    classification_name
  );
  if (classificationResult) {
    req.flash("notice", `Classification added successfully.`);
    res.redirect("/inv/management");
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
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const inventoryResult = await invModel.addInventoryItem(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  // Ensure classification list remains available
  const classificationSelect = await utilities.buildClassificationList(
    classification_id
  );
  if (inventoryResult) {
    req.flash("notice", `Inventory added successfully.`);
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the inventory addition failed.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      errors, // "Failed to add inventory. Please check your inputs and try again.",
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/*  ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const items = await invModel.getInventoryById(inv_id);
  const itemData = items[0];
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

module.exports = invCont;
