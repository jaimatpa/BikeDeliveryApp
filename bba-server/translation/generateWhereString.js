const generateWhereString = (whereConditions) => {
  let whereString = '';

  const processConditions = (conditions, operator) => {
    return Object.keys(conditions).map((field) => {
      if (typeof conditions[field] === 'object') {
        return Object.keys(conditions[field]).map((operation) => {
          return `\`${field}\` ${operation} '${conditions[field][operation]}'`;
        }).join(' AND ');
      } else {
        return `${field} = '${conditions[field]}'`;
      }
    }).join(` ${operator} `);
  };

  const orConditions = whereConditions?.or ? processConditions(whereConditions.or, 'OR') : '';
  const andConditions = whereConditions?.and ? processConditions(whereConditions.and, 'AND') : '';

  if (orConditions && andConditions) {
    whereString = `${orConditions} OR ${andConditions}`;
  } else {
    whereString = orConditions || andConditions;
  }

  return whereString;
};

module.exports = generateWhereString;