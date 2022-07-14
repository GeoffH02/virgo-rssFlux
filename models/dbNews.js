const mysql = require("mysql")
const Sequelize = require("sequelize")
const path = require("path")

const newsModel = module.exports(Sequelize, DataTypes) => {
    return Sequelize.define("news", {
        name: Sequelize.STRING,
        message: Sequelize.STRING,
        room: Sequelize.STRING
    })
}