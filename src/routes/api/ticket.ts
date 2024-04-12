import * as express from 'express';
import { Request, Response } from 'express';
// import { ObjectId } from 'mongodb';
import { collections } from '../../services/database.service';
import { Ticket } from '../../interfaces/Ticket';

export const ticketRouter = express.Router();

ticketRouter.use(express.json())

ticketRouter.post('/add', async (req: Request, res: Response) => {
    try {
        // const timeStamp = new Date();
        console.log(req.body.title);
        console.log(req.body.description);
        console.log(req.body.contactInfo);
        if (req.body.title == "" || req.body.description == "" || req.body.contactInfo == "") {
            res.status(400).send("You should fill in three things of ticket")
        }
        const newTicket = {
            "id": req.body.id,
            "title": req.body.title,
            "description": req.body.description,
            "contactInfo": req.body.contactInfo,
            "status": req.body.status,
            "createdTimeStamp": req.body.createdTimeStamp,
            "latestUpdateTimeStamp": req.body.latestUpdateTimeStamp
        } as Ticket
        const result = await collections.tickets?.insertOne(newTicket);

        result 
            ? res.status(201).send(`Successfully created a new ticket with id ${result.insertedId}`)
            : res.status(500).send("Fail to create a new ticket.");
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }

})

