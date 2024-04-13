import * as express from 'express';
import { Request, Response } from 'express';
// import { ObjectId } from 'mongodb';
import { collections } from '../../services/database.service';
import { TicketInterface } from '../../interfaces/Ticket';

export const ticketRouter = express.Router();

ticketRouter.use(express.json())

ticketRouter.get('/', async (req: Request, res: Response) => {
    try {
        const allTickets = await collections.tickets?.find({}).toArray()
        // console.log(allTickets)
        allTickets
            ? res.status(201).send(allTickets)
            : res.status(500).send("Fail to get all tickets.");
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
})

ticketRouter.post('/add', async (req: Request, res: Response) => {
    try {
        // const timeStamp = new Date();
        console.log(req.body.title);
        console.log(req.body.description);
        console.log(req.body.contactInfo);
        // if (req.body.title == "" || req.body.description == "" || req.body.contactInfo == "") {
        //     res.status(400).send("You should fill in three things of ticket.")
        // }
        const newTicket = {
            "id": req.body.id,
            "title": req.body.title,
            "description": req.body.description,
            "contactInfo": req.body.contactInfo,
            "status": req.body.status,
            "createdTimeStamp": req.body.createdTimeStamp,
            "latestUpdateTimeStamp": req.body.latestUpdateTimeStamp
        } as TicketInterface
        const result = await collections.tickets?.insertOne(newTicket);

        result 
            ? res.status(201).send(`Successfully created a new ticket with id ${result.insertedId}.`)
            : res.status(500).send("Fail to create a new ticket.");
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }

})

ticketRouter.put('/edit/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const filter = {id: id};
        const updated = {
            "title": req.body.title,
            "description": req.body.description,
            "contactInfo": req.body.contactInfo,
            "status": req.body.status,
            "latestUpdateTimeStamp": req.body.latestUpdateTimeStamp
        };
        const ticket = await collections.tickets?.findOneAndUpdate(filter, { $set: updated });
        ticket
            ? res.status(200).send(`Successfully updated game with id ${id}`)
            : res.status(304).send(`Game with id: ${id} not updated`);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
})
