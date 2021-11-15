const { Model, DataTypes } = require("sequelize");
const db = require("../../config/database");

// Extending Model and calling init(attributes, options)
class Country extends Model {
  // Class instances Method
  searchable() {
    return ["name", "nicename", "id"];
  }
}

Country.init(
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
    iso: {
      type: DataTypes.STRING(2),
    },
    nicename: {
      type: DataTypes.STRING,
    },
    iso3: {
      type: DataTypes.STRING(3),
    },
    numcode: {
      type: DataTypes.INTEGER,
    },
    phonecode: {
      type: DataTypes.INTEGER,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    // Other model options go here
    sequelize: db.sequelize,
    modelName: "Country",
    tableName: "Country",
  }
);

module.exports = Country;
