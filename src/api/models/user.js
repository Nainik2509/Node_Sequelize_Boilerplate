const { Model, DataTypes } = require("sequelize");
const db = require("../../config/database");
const { AUTH_ROLES, USER_STATUS } = require("../../helpers/constants");
const roleModel = require("./role");

// Extending Model and calling init(attributes, options)
class User extends Model {
  // Class instances Method
  searchable() {
    return ["first_name", "last_name", "email"];
  }

  // Method to return FullName
  getFullName() {
    return [this.first_name, this.last_name].join(" ");
  }

  static associate(models) {
    //define associate here
    // User.hasOne(models.Role, {
    //   foreignKey: "userId",
    //   as: "role",
    // });
  }
}

User.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email is already registered",
      },
      isEmail: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.STRING,
      defaultValue: AUTH_ROLES[0],
      validate: {
        isIn: {
          args: [AUTH_ROLES],
          msg: "Invalid role! Role can be either admin or user",
        },
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: USER_STATUS[0],
      validate: {
        isIn: {
          args: [USER_STATUS],
          msg: "Invalid status! Status can be either active or deactive",
        },
      },
    },
  },
  {
    // Other model options go here
    sequelize: db.sequelize,
    modelName: "User",
    tableName: "user",

    getterMethods: {
      // Method to return FullName
      fullName() {
        return [this.first_name, this.last_name].join(" ");
      },
    },
  }
);

// Binding Relations references
// User.belongsTo(roleModel, {
//   foreignKey: "roleId",
//   as: "role",
// });

module.exports = User;
