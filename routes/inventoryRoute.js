// routes/inventory.js
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/inventory-validation");

// Route to view inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to view inventory by classification
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// Route to view inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to view inventory by classification
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// route to management view
router.get("/management", invController.getManagementView);

/* *************************************
 *Get inventory for ajax route
 *unit 5 select in items activity
 ****************************************/
router.get(
  "/getInventory/:classification_id",
  //utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
);

// route to add-inventory view
router.get("/add-inventory", invController.getAddInventoryView);

// route to add-classification view
router.get("/add-classification", invController.getAddClassificationView);

// Process inventory data
router.post(
  "/add-inventory",
  regValidate.newInventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Process the add classification data
router.post(
  "/add-classification",
  regValidate.classificationRules(),
  regValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to handle the edit inventory item request
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
);

// Route to handle the update inventory request
router.post(
  "/update/",
  regValidate.newInventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to handle the delete inventory item request
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteInventoryView)
);

// Route to handle the delete inv request
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

module.exports = router;
