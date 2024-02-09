const bcrypt = require("bcryptjs")
module.exports.hashKey = bcrypt.hashSync("Adna@2022**-",10)