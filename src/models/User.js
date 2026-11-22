const { DataTypes } = require('sequelize');
const database = require('../config/database');

const User = database.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    firstname: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    surname: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true
});

module.exports = User;