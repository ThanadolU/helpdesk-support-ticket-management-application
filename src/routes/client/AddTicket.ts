import axios from 'axios';
import { v4 as uuidv4} from 'uuid';
import { TicketStatus } from '../../interfaces/TicketStatus';

export async function addTicket(title: string, description: string, contactInfo: string, status: string) {
    const createdTimeStamp = new Date();
    console.log(title);
    console.log(description);
    console.log(contactInfo);
    const newTicket = {
        id: uuidv4(),
        title: title,
        description: description,
        contactInfo: contactInfo,
        status: status,
        createdTimeStamp: createdTimeStamp,
        latestUpdateTimeStamp: createdTimeStamp
    };
    
    await axios.post('http://localhost:8060/tickets/add', 
        newTicket
    ).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.error(error);
    })
    return newTicket;
}