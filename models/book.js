'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Category, {foreignKey: 'kategori_id', as: 'Category', onDelete: 'cascade'})
      this.belongsToMany(models.Favorite, {through: 'FavoritesBooks', foreignKey: 'favorite_id', as: 'Books', onDelete: 'cascade'})
    }
  };
  Book.init({
    kategori_id: DataTypes.INTEGER,
    judul: DataTypes.STRING,
    deskripsi: DataTypes.STRING,
    penulis: DataTypes.STRING,
    isi: DataTypes.TEXT,
    sampul: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};