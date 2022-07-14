const mysql = require("mysql")
const Sequelize = require("sequelize")
const path = require("path")

const dbPath = path.resolve(__dirname, 'chat.sql')

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to database");
});