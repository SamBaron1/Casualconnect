const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Correctly import sequelize instance


const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
  },
  salary: {
    type: DataTypes.STRING,
  },
  jobType: {
    type: DataTypes.ENUM('Full-Time', 'Part-Time', 'Contract', 'Freelance'),
  },
  requirements: {
    type: DataTypes.TEXT,
  },
  benefits: {
    type: DataTypes.TEXT,
  },
  employer_id: { // Use employer_id to match the column in the database
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  applicationCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'Jobs',
  timestamps: true,
});



module.exports = Job;
