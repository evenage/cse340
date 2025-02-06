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

async function getInventoryById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c 
      ON i.classification_id = c.classification_id
       WHERE i.inv_id = $1`,
      [inventory_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventorybyid error " + error);
  }
}

/* ***************************
 * Add new classification
 ************************** */
async function addClassification(classification_name) {
  try {
    const data = await pool.query(
      `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`,
      [classification_name]
    );
    return data.rows[0];
  } catch (error) {
    console.error("addclassification error " + error);
    return null;
  }
}

/* ***************************
 * Add new inventory item
 ************************** */
async function addInventoryItem(
  inv_make,
  inv_model,
  inv_year,
  classification_id
) {
  try {
    const data = await pool.query(
      `INSERT INTO public.inventory (inv_make, inv_model, inv_year, classification_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [inv_make, inv_model, inv_year, classification_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("addinventoryitem error " + error);
    return null;
  }
}

/* ***************************
 * Update classification
 ************************** */
async function updateClassification(classification_id, classification_name) {
  try {
    const data = await pool.query(
      `UPDATE public.classification SET classification_name = $1 WHERE classification_id = $2 RETURNING *`,
      [classification_name, classification_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("updateclassification error " + error);
    return null;
  }
}

/* ***************************
 * Update inventory item
 ************************** */
async function updateInventoryItem(
  inv_make,
  inv_model,
  inv_year,
  classification_id
) {
  try {
    const data = await pool.query(
      `UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, classification_id = $4 WHERE inv_id = $5 RETURNING *`,
      [inv_make, inv_model, inv_year, classification_id, inventory_id]
    );
    return data.rows;
  } catch (error) {
    console.error("updateinventoryitem error " + error);
    return null;
  }
}
module.exports = {
  addClassification,
  addInventoryItem,
  updateClassification,
  updateInventoryItem,
};
