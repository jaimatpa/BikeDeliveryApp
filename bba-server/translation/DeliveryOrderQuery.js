const generateWhereString = require("./generateWhereString");

const translateDeliveryOrder = (whereConditions = null) => {
  const query = `
    SELECT
      t1.id,
      t1.start_date AS "date",
      CONCAT(t2.first_name, ' ', t2.last_name) AS "name",
      CONCAT(t3.number, ' ', t3.street, ' ', t3.plantation) as location,
      t1.order_number as orderid,
      '' AS rack,
      t4.color_key AS color,
      t4.combination,
      t1.color_id AS "lock",
      t1.phone_number AS mobileNo,
      '' AS barcode,
      t1.createdAt,
      t1.updatedAt,
      t1.note,
      t1.email,
      t1.stage,
      CASE t1.stage
          WHEN 0 THEN -1
          WHEN 1 THEN -1
          WHEN 2 THEN 0
          WHEN 3 THEN 1
          WHEN 4 THEN 1
          ELSE t1.stage
      END AS status,
      t3.plantation AS "area",
      '' AS lane,
      t1.end_date AS "endDate",
      NULL As PickedUp,
      NULL As PickupNotes,
      NULL As truckID,
      NULL As textSent,
      NULL As picturesSent,
      NULL As customerPickedUp,
      NULL As readyForDriverPickup,
      NULL As driverDeliveredBylongtext,
      NULL As driverPickedUpBylongtext,
      NULL As TruckId1,
      NULL As StopNumber,
      NULL As tripID1,
      NULL As tripID2,
      NULL As tripPriority1,
      NULL As tripPriority2,
      NULL As extrasDelivered,
      NULL As extrasDeliveredReason,
      NULL As extrasPickedUp,
      NULL As extrasPickedUpReason,
      NULL As swapOrder,
      NULL As swapOrderDeliveryId
    FROM
      reservations AS t1
      LEFT JOIN customer_customers AS t2 ON t1.customer_id = t2.id
      LEFT JOIN all_addresses AS t3 ON t1.address_id = t3.id
      LEFT JOIN settings_colorcombinations AS t4 ON t1.color_id = t4.id
  `;

  const whereClause = whereConditions ? generateWhereString(whereConditions) : '';
  if(whereClause) {
    return `SELECT * FROM (${query}) AS sub WHERE ${whereClause}`
  }

  return query;
};

module.exports = {translateDeliveryOrder};