const { DataTypes } = require('sequelize');
const database = require('../config/database');

const ProductCategory = database.define('ProductCategory', {
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },

    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    tableName: 'product_category',
    timestamps: false,
    underscored: true
});

module.exports = ProductCategory;