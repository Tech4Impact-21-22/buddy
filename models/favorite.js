'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {foreignKey: 'user_id', as: 'User', onDelete: 'cascade'})
      this.belongsToMany(models.Book, {through: 'FavoritesBooks', foreignKey: 'buku_id', as: 'buku', onDelete: 'cascade'})
    }
  };
  Favorite.init({
    user_id: DataTypes.INTEGER,
    nama_favorite: DataTypes.STRING,
    sampul_favorite: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};