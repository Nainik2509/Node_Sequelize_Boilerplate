const { Model, DataTypes } = require("sequelize");
const db = require("../../config/database");

// Extending Model and calling init(attributes, options)
class Role extends Model {
  // Class instances Method
  searchable() {
    return ["name"];
  }
}

Role.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    // Other model options go here
    sequelize: db.sequelize,
    modelName: "Role",
    tableName: "role",
  }
);

module.exports = Role;
