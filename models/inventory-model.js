const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

const getVehicleById = async (id) => {
  const query = 'SELECT * FROM inventory WHERE id = $1';
  const result = await db.query(query, [id]);
  const vehicles = getAllVehicles();
  return vehicles.find(vehicle => vehicle.id === parseInt(id));

  return result.rows[0];
};

const fs = require('fs');
const path = require('path');

// Path to the vehicle data file
const filePath = path.join(__dirname, '../database/vehicle.json');

// Read all vehicle data
const getAllVehicles = () => {
  const vehicles = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return vehicles;
};



module.exports = { getClassifications, getInventoryByClassificationId, getAllVehicles, getVehicleById };
