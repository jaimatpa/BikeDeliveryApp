const generateWhereString = require("./generateWhereString");

const Cols = [
  'order_number',
  'customer_id',
  'brand_id',
  'start_date',
  'end_date',
  'promo_code',
  'stage',
  'note',
  'subtotal',
  'discount_amount',
  'tax_rate',
  'tax_amount',
  'total_price',
  'paid',
  'price_table_id',
  'color_id',
  'address_id',
  'use_manual',
  'manual_address',
  'email',
  'phone_number',
  'driver_tip',
  'createdAt',
  'updatedAt',
  'rack',
  'barcode',
  'lane',
  'PickedUp',
  'PickupNotes',
  'truckID',
  'textSent',
  'picturesSent',
  'customerPickedUp',
  'readyForDriverPickup',
  'driverDeliveredBy',
  'driverPickedUpBy',
  'TruckId1',
  'StopNumber',
  'tripID1',
  'tripID2',
  'tripPriority1',
  'tripPriority2',
  'extrasDelivered',
  'extrasDeliveredReason',
  'extrasPickedUp',
  'extrasPickedUpReason',
  'swapOrder',
  'swapOrderDeliveryId',
  'stripe_cus_id',
  'printed',
];

const translateDeliveryOrder = (whereConditions = null) => {
  const query = `
    SELECT
      t1.*,
      t1.start_date AS "date",
      CONCAT(t2.first_name, ' ', t2.last_name) AS "name",
      IF(use_manual = 1, manual_address, CONCAT(t3.number, ' ', (IF(t3.street = '', t3.property_name, t3.street)), ', ', t3.plantation)) as location,
      t1.order_number as orderid,
      t4.color_key AS color,
      t4.combination,
      t4.lock_id AS "lock",
      t1.phone_number AS mobileNo,
      CAST(
        CASE t1.stage
          WHEN 0 THEN -1
          WHEN 1 THEN -1
          WHEN 2 THEN 0
          WHEN 3 THEN 1
          WHEN 4 THEN 1
          ELSE t1.stage
        END
        AS SIGNED
      ) AS status,
      t3.plantation AS "area",
      t1.end_date AS "endDate"
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

const updateDeliveryOrderByTranslation = (order) => {
  let stage = null;
  if(order.status == 0) stage = 2;
  else if(order.status >= 1) stage = 3;

  const query = `
    UPDATE reservations
    SET 
      ${order.note ? `note = '${order.note}',`: ''}
      ${order.email ? `email = '${order.email}',`: ''}
      ${stage ? `stage = ${stage},` : ''}
      ${order.color_id ? `color_id = ${order.color_id},`: ''}
      ${order.endDate ? `end_date = '${order.endDate}',`: ''}
      ${order.rack ? `rack = '${order.rack}',`: ''}
      ${order.barcode ? `barcode = '${order.barcode}',`: ''}
      ${order.lane ? `lane = '${order.lane}',`: ''}
      ${order.PickedUp ? `PickedUp = ${order.PickedUp?1:0},`: ''}
      ${order.PickupNotes ? `PickupNotes = '${order.PickupNotes}',`: ''}
      ${order.truckID ? `truckID = ${order.truckID},`: ''}
      ${order.textSent ? `textSent = ${order.textSent},`: ''}
      ${order.picturesSent ? `picturesSent = ${order.picturesSent},`: ''}
      ${order.customerPickedUp ? `customerPickedUp = ${order.customerPickedUp},`: ''}
      ${order.readyForDriverPickup ? `readyForDriverPickup = ${order.readyForDriverPickup},`: ''}
      ${order.driverDeliveredBy ? `driverDeliveredBy = '${order.driverDeliveredBy}',`: ''}
      ${order.driverPickedUpBy ? `driverPickedUpBy = '${order.driverPickedUpBy}',`: ''}
      ${order.TruckId1 ? `TruckId1 = ${order.TruckId1},`: ''}
      ${order.StopNumber ? `StopNumber = ${order.StopNumber},`: ''}
      ${order.tripID1 ? `tripID1 = ${order.tripID1},`: ''}
      ${order.tripID2 ? `tripID2 = ${order.tripID2},`: ''}
      ${order.tripPriority1 ? `tripPriority1 = ${order.tripPriority1},`: ''}
      ${order.tripPriority2 ? `tripPriority2 = ${order.tripPriority2},`: ''}
      ${order.extrasDelivered ? `extrasDelivered = ${order.extrasDelivered},`: ''}
      ${order.extrasDeliveredReason ? `extrasDeliveredReason = '${order.extrasDeliveredReason}',`: ''}
      ${order.extrasPickedUp ? `extrasPickedUp = ${order.extrasPickedUp},`: ''}
      ${order.extrasPickedUpReason ? `extrasPickedUpReason = '${order.extrasPickedUpReason}',`: ''}
      ${order.swapOrder ? `swapOrder = ${order.swapOrder},`: ''}
      ${order.swapOrderDeliveryId ? `swapOrderDeliveryId = ${order.swapOrderDeliveryId},`: ''}
      id = ${order.id}
    WHERE 
      id = ${order.id};
    `;
  return query;
}

const inseretDeliveryOrderByTranslation = (data) => {
  const order = {...data}

  if(order.status == 0) order.stage = 2;
  else if(order.status >= 1) order.stage = 3;

  if(order.endDate) order.end_date = order.endDate;
  if(order.date) order.start_date = order.date;
  if(order.mobileNo) order.phone_number = order.mobileNo;
  if(order.orderid) order.order_number = order.orderid;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  const currentDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

  order.createdAt = currentDate;
  order.updatedAt = currentDate;
  console.log();

  const columns = [];
  const values = [];

  Cols.forEach(col => {
    if (order[col]) {
      if (col.includes('date') || col.includes('number') || col.includes('manual_address')  || col.includes('createdAt') || col.includes('updatedAt')) {
        columns.push(col);
        values.push(`'${order[col]}'`)
      }else if (!isNaN(parseFloat(order[col]))) {
        columns.push(col);
        values.push(order[col]);
      } else if (typeof order[col] === 'boolean') {
        columns.push(col);
        values.push(order[col]);
      } else if (typeof order[col] === 'string') {
        columns.push(col);
        values.push(`'${order[col]}'`);
      }
    }
  });

  const columnsString = columns.join(', ');
  const valuesString = values.join(', ');

  const query = `
    INSERT INTO reservations 
    (${columnsString}) 
    VALUES 
    (${valuesString})
  `;
  return query;
}

module.exports = { translateDeliveryOrder, updateDeliveryOrderByTranslation, inseretDeliveryOrderByTranslation };