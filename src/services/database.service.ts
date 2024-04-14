import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { tickets?: mongoDB.Collection } = {}

export async function connectToDatabase() {
    dotenv.config();

    // Ensure process.env variables are defined
    if (!process.env.DB_CONN_STRING || !process.env.TICKETS_COLLECTION_NAME) {
        throw new Error('Environment variables are not properly configured.');
    }

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);

    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    const ticketsCollection: mongoDB.Collection = db.collection(process.env.TICKETS_COLLECTION_NAME)

    collections.tickets = ticketsCollection;

    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${ticketsCollection.collectionName}`)
}