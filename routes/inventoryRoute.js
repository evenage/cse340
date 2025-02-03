// routes/inventory.js
const express = require("express");
const router = express.Router(); 
const invController = require("../controllers/invController");


// Route to view inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to view inventory by classification
router.get("/detail/:inventoryId", invController.buildByInventoryId);


module.exports = router;
