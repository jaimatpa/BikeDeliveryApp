'use strict';
const tableName = 'Locks';
const columnName = 'orderid'
module.exports = {
  down: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]){
          return queryInterface.addColumn(
            tableName, 
            columnName, 
            {
              type: Sequelize.INTEGER,
              defaultValue: 0,
              after: "id"
            },
          );
      } else {
          return Promise.resolve(true);
      }
    });

  },
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      tableName,
      columnName
    );
  },
};
