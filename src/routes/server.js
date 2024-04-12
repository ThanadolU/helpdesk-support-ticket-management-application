"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
// import cors from "cors";
var database_service_1 = require("../services/database.service");
var ticket_1 = require("./api/ticket");
var app = express();
var port = 8060;
// const corsOptions = {
//     origin: 'http://localhost:5173',
//     credentails: true
// };
(0, database_service_1.connectToDatabase)()
    .then(function () {
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });
    // app.use(cors(corsOptions));
    app.use("/tickets", ticket_1.ticketRouter);
    app.listen(port, function () {
        console.log("Server started at http://localhost:".concat(port));
    });
})
    .catch(function (error) {
    console.error("Database connection failed", error);
    process.exit();
});
