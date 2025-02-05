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

// route to management view
router.get("/management", inventoryController.getManagementView);

// route to add-inventory view
router.get("/add-inventory", inventoryController.getAddInventoryView);

// route to add-classification view
router.get("/add-classification", inventoryController.getAddClassificationView);

// Process inventory data
router.post(
  "/add-inventory",
  regValidate.inventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(inventoryController.addInventory)
);

// Process the add classification data
router.post(
  "/add-classification",
  regValidate.classificationRules(),
  regValidate.checkClassificationData,
  utilities.handleErrors(inventoryController.addClassification)
);

module.exports = router;
