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

async function addInventoryItem(
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
) {
  try {
    const sql =
      "INSERT INTO public.inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    const data = await pool.query(sql, [
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
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
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
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
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

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data.rows;
  } catch (error) {
    console.error("deleteinventory error " + error);
    new Error("Delete inventory Error")
  }
}
module.exports = {
  addClassification,
  addInventoryItem,
  updateClassification,
  updateInventoryItem,
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  updateInventory,
  deleteInventory,
};
