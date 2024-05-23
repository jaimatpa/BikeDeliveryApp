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
      NULL AS TruckID,
      NULL AS active,
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

module.exports = translateDeliveryItems;