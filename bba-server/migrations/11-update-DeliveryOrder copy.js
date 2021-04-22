'use strict';
const tableName = 'DeliveryOrders';
const columnName = 'status'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]){
          return queryInterface.addColumn(
            tableName, 
            columnName, 
            {
              type: Sequelize.INTEGER,
              defaultValue: 0,
              after: "barcode"
            },
          );
      } else {
          return Promise.resolve(true);
      }
    });

  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      tableName,
      columnName
    );
  },
};
