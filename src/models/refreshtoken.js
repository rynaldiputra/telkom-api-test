'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.RefreshToken.belongsTo(models.User)
    }
  };
  RefreshToken.init({
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    expires: DataTypes.DATE,
    created: {
      type: DataTypes.DATE,
      allowNull: false, defaultValue: DataTypes.NOW
    },
    createdByIp: DataTypes.STRING,
    revoked: DataTypes.DATE,
    revokedByIp: DataTypes.DATE,
    replacedByToken: DataTypes.STRING,
    isExpired: {
      type: DataTypes.VIRTUAL,
      get() { return Date.now() >= this.expires; }
    },
    isActive: {
      type: DataTypes.VIRTUAL,
      get() { return !this.revoked && !this.isExpired; }
    }
  }, {
    sequelize,
    modelName: 'RefreshToken',
  });
  return RefreshToken;
};