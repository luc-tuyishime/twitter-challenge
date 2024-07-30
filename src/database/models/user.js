import { comparePassword, hashPassword } from "../../utils/password";

import { Model, DataTypes } from "sequelize";

module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Tweet, { foreignKey: "user_id", as: "tweets" });
    }
  }
  User.init(
    {
      id_str: {
        type: new DataTypes.STRING(),
        primaryKey: true,
      },
      screen_name: {
        type: new DataTypes.STRING(),
      },
      name: {
        type: new DataTypes.STRING(),
      },

      description: {
        type: new DataTypes.TEXT(),
      },
      location: {
        type: new DataTypes.STRING(),
      },
      followers_count: {
        type: new DataTypes.INTEGER(),
      },
      friends_count: {
        type: new DataTypes.INTEGER(),
      },
      listed_count: {
        type: new DataTypes.INTEGER(),
      },
      favourites_count: {
        type: new DataTypes.INTEGER(),
      },
      statuses_count: {
        type: new DataTypes.INTEGER(),
      },
      lang: {
        type: new DataTypes.STRING(),
      },

      createdAt: {
        allowNull: false,
        type: new DataTypes.DATE(),
      },
      updatedAt: {
        allowNull: false,
        type: new DataTypes.DATE(),
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: "User",
      tableName: "users",
    }
  );

  User.beforeCreate(async (_user) => {
    const user = _user;
    if (user.password) {
      user.password = await hashPassword(user.password);
    }
  });

  User.beforeBulkUpdate(async (_user) => {
    const { attributes } = _user;
    if (attributes.password) {
      attributes.password = await hashPassword(attributes.password);
    }
  });

  User.prototype.comparePassword = async function compareUserPassword(
    password
  ) {
    return comparePassword(password, this.get().password);
  };

  return User;
};
