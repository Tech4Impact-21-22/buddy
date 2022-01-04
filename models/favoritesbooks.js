'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FavoritesBooks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Book, {foreignKey: 'buku_id', onDelete: 'cascade'})
      this.belongsTo(models.Favorite, {foreignKey: 'favorite_id', onDelete: 'cascade'})
    }
  };
  FavoritesBooks.init({
    favorite_id: DataTypes.INTEGER,
    buku_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FavoritesBooks',
  });
  return FavoritesBooks;
};