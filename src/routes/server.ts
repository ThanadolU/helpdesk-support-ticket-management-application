import * as express from "express";
// import cors from "cors";
import { Request, Response } from 'express';
import { connectToDatabase } from "../services/database.service";
import { ticketRouter } from "./api/ticket";

const app = express();
const port = 8060;

// const corsOptions = {
//     origin: 'http://localhost:5173',
//     credentails: true
// };

connectToDatabase()
    .then(() => {
        app.use((req: Request, res: Response, next) => {
            console.log(req.url);
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });

        // app.use(cors(corsOptions));
        
        app.use("/tickets", ticketRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });