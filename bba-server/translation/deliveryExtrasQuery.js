const generateWhereString = require("./generateWhereString");

const translateDeliveryExtras = (whereConditions = null) => {
  const query = `
    SELECT
      t1.id,
      t1.item_id,
      t1.extra_id,
      t3.id AS deliveryOrderId,
      t4.name AS extraName,
      t2.createdAt,
      t2.updatedAt
    FROM
      reservation_items_extras as t1
      left join reservation_items as t2
        on t1.item_id = t2.id
      left join reservations as t3
        on t2.reservation_id = t3.id
      left join settings_extras as t4
        on t1.extra_id = t4.id
  `;

  const whereClause = whereConditions ? generateWhereString(whereConditions) : '';
  if(whereClause) {
    return `SELECT * FROM (${query}) AS sub WHERE ${whereClause}`
  }

  return query;
};

module.exports = translateDeliveryExtras;