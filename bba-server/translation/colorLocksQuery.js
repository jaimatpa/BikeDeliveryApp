const generateWhereString = require("./generateWhereString");

const translateColorLocks = (whereConditions = null) => {
  const query = `
    SELECT
      id,
      lock_id AS lockId,
      color_key AS color,
      combination,
      color AS ColorValue 
    FROM
      settings_colorcombinations
  `;

  const whereClause = whereConditions ? generateWhereString(whereConditions) : '';
  if(whereClause) {
    return `SELECT * FROM (${query}) AS sub WHERE ${whereClause}`
  }

  return query;
};

module.exports = {translateColorLocks};