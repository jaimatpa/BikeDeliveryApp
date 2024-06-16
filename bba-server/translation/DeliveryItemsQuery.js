const generateWhereString = require("./generateWhereString");

const Cols = [
  'reservation_id',
  'family_id',
  'display_name',
  'size',
  'price_group_id',
  'quantity',
  'price',
  'barcode',
  'status',
  'truck_id',
  'Active',
  'EquipmentTypeId',
  'Loaded'
]

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
      IF(\`status\` = 4, 1, NULL) AS checkPickup,
      truck_id AS TruckID,
      Active,
      EquipmentTypeId,
      Loaded
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
      barcode = '${item.serialbarcode}',
      \`status\` = ${status},
      updatedAt = '${currentDate}'
    WHERE 
      id = ${item.id};
    `;
  return query;
}

const updateProductItemStatusQuery = ({barcode, status}) =>{

  const query = `
      UPDATE
        product_products
      SET
        STATUS = ${status}
      WHERE barcode = '${barcode}';
    `;
  return query;
}

const inseretDeliveryItemByTranslation = (data) => {
  const item = {...data}

  if(item.deliveryID) item.reservation_id = item.deliveryID;
  if(item.item) item.display_name = item.item;
  if(item.serialbarcode) item.barcode = item.serialbarcode;
  if(item.TruckID) item.truck_id = item.TruckID;

  let status = null;
  if(item.checkPickup) status = 4;
  else if(item.checkedDelievery) status = 3;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  const currentDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

  item.createdAt = currentDate;
  item.removedAt = currentDate;

  const columns = [];
  const values = [];

  Cols.forEach(col => {
    if (item[col]) {
      if (col.includes('display_name') || col.includes('size') || col.includes('createdAt') || col.includes('updatedAt')) {
        columns.push(col);
        values.push(`'${item[col]}'`)
        console.log(col);
        console.log(parseFloat(item[col]));
      }else if (!isNaN(parseFloat(item[col]))) {
        columns.push(col);
        values.push(item[col]);
      } else if (typeof item[col] === 'boolean') {
        columns.push(col);
        values.push(item[col]);
      } else if (typeof item[col] === 'string') {
        columns.push(col);
        values.push(`'${item[col]}'`);
      }
    }
  });

  const columnsString = columns.join(', ');
  const valuesString = values.join(', ');

  const query = `
    INSERT INTO reservation_items 
    (${columnsString}) 
    VALUES 
    (${valuesString})
  `;
  return query;
}

module.exports = { translateDeliveryItems, updateDelieveryItemByTranslation, updateProductItemStatusQuery, inseretDeliveryItemByTranslation };