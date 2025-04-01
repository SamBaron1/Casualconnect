const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Adjust the path to your database configuration

class PushSubscription extends Model {}

PushSubscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Ensure the Users table exists and adjust this name if different
        key: "id",
      },
      onDelete: "CASCADE", // Deletes subscription if the associated user is deleted
    },
    endpoint: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    publicKey: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    authKey: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    sequelize, // Pass the Sequelize instance
    modelName: "PushSubscription",
    tableName: "pushsubscriptions", // Match the table name in your database
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = PushSubscription;