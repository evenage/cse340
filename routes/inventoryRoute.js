// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)
// Define your inventory routes
//router.get('/', (req, res) => {
 //   res.send('Inventory Home');
 // })

module.exports = router;
