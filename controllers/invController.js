const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;  // Get the classification ID from the URL
    const data = await invModel.getInventoryByClassificationId(classification_id);  // Fetch data from the model

    // Handle case where no data is found
    if (!data || data.length === 0) {
      return next({ status: 404, message: "No inventory found for this classification." });
    }

    const grid = await utilities.buildClassificationGrid(data);  // Process data for grid view
    let nav = await utilities.getNav();  // Fetch navigation data
    const className = data[0].classification_name;  // Get the classification name from the data

    // Render the view with data
    res.render("./inventory/classification", {
      title: `${className} vehicles`,  // Title for the page
      nav,  // Navigation bar
      grid,  // The inventory grid
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


  if (!vehicle) {
    // Handle vehicle not found
    return res.status(404).render('error', { message: 'Vehicle not found' });
  }

  // Render the detail view with the vehicle data
  res.render('inventory/vehicleDetail', { vehicle });
};



module.exports = invCont, getVehicleDetail;

