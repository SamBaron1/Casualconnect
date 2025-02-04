const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Correctly import sequelize instance

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  jobId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Jobs',
      key: 'id',
    },
  },
}, {
  tableName: 'notifications',
  timestamps: true, // Use automatic timestamps
});

module.exports = Notification;
