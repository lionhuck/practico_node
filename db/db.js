const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('crud_db', 'root', 'L4i0n_f4k3007', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize