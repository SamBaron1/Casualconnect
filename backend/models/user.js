const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Use the configured instance



const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('jobseeker', 'employer'),
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING,
  },
  position: {
    type: DataTypes.STRING,
  },
  companySize: {
    type: DataTypes.STRING,
  },
  desiredJob: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'users',
  timestamps: true, // Use automatic timestamps
});


// Custom findByEmail method
User.findByEmail = async function(email) {
  console.log(`Finding user with email: ${email}`); // Debugging line
  return await this.findOne({ where: { email } });
};

module.exports = User;
