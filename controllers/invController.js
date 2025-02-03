const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

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

    module.exports = invCont;

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

  // try {
  //   const classification_id = req.params.classificationId;  // Get the classification ID from the URL
  //   const data = await invModel.getInventoryByClassificationId(classification_id);  // Fetch data from the model

  //   // Handle case where no data is found
  //   if (!data || data.length === 0) {
  //     return next({ status: 404, message: "No inventory found for this classification." });
  //   }

  //   const grid = await utilities.buildClassificationGrid(data);  // Process data for grid view
  //   let nav = await utilities.getNav();  // Fetch navigation data
  //   const className = data[0].classification_name;  // Get the classification name from the data

  //   // Render the view with data
  //   res.render("./inventory/classification", {
  //     title: `${className} vehicles`,  // Title for the page
  //     nav,  // Navigation bar
  //     grid,  // The inventory grid
  //   });
  // } catch (error) {
  //   // Handle errors and pass to the error handler
  //   next({
  //     status: 500,
  //     message: "An error occurred while processing your request.",
  //     error: error.message,
  //   });
  // }
};

// //const getVehicleDetail = (req, res, next) => {
//   const vehicleId = req.params.id; // Get the ID from the URL
//   const vehicle = inventoryModel.getVehicleById(vehicleId); // Fetch vehicle details from the model

//   if (!vehicle) {
//     // Handle vehicle not found
//     return res.status(404).render('error', { message: 'Vehicle not found' });
//   }

//   // Render the detail view with the vehicle data
//   res.render('inventory/vehicleDetail', { vehicle });
// };

module.exports = invCont;
