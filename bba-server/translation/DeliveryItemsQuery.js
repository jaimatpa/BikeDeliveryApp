const generateWhereString = require("./generateWhereString");

const translateDeliveryItems = (whereConditions = null) => {
  const query = `
    SELECT
      id,
      reservation_id AS deliveryID,
      family_id,
      display_name AS item,
      size,
      price_group_id,
      quantity,
      price,
      barcode AS serialbarcode,
      \`status\`,
      createdAt,
      updatedAt,
      IF(\`status\` >= 3, 1, NULL) AS checkedDelievery,
      IF(\`status\` = 3, 1, NULL) AS checkPickup,
      truck_id AS TruckID,
      1 AS active,
      NULL AS EquipmentTypeId,
      NULL AS Loaded
    FROM
      reservation_items
  `;

  const whereClause = whereConditions ? generateWhereString(whereConditions) : '';
  if(whereClause) {
    return `SELECT * FROM (${query}) AS sub WHERE ${whereClause}`
  }

  return query;
};

const updateDelieveryItemByTranslation = (item) => {

  let status = null;
  if(item.checkPickup) status = 4;
  else if(item.checkedDelievery) status = 3;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const currentDate = `${year}-${month}-${day}`;

  const query = `
    UPDATE reservation_items 
    SET 
      barcode = ${item.serialbarcode},
      \`status\` = ${status},
      updatedAt = '${currentDate}'
    WHERE 
      id = ${item.id};
    `;
  return query;
}

module.exports = { translateDeliveryItems, updateDelieveryItemByTranslation };