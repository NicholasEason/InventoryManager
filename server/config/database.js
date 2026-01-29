require("dotenv").config();
const mongoose = require("mongoose");

let connectToDB = async () => {
    try{
        const connection_string = `mongodb://${process.env.DB_USERNAME}:`
                                    + `${process.env.DB_PASSWORD}@`
                                    + `${process.env.DB_HOST}:`
                                    + `${process.env.DB_PORT}/`
                                    + `${process.env.DB_NAME}`
        await mongoose.connect(connection_string);
        console.log(`Connected to DB ${process.env.DB_NAME} at`
                    + ` ${process.env.DB_HOST}:${process.env.DB_PORT}`)
    } catch (error) {
        console.log(`Failed to connect to database. Error:\n${error}`);
    }
}

module.exports = {connectToDB};