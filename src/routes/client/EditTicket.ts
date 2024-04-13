import axios from 'axios';

export const editTicket = async (id: string, title: string, description: string, contactInfo: string, status: string) => {
    const updatedTimeStamp = new Date();

    await axios.put(`http://localhost:8060/tickets/edit/${id}`, 
        {
            title: title,
            description: description,
            contactInfo: contactInfo,
            status: status,
            latestUpdateTimeStamp: updatedTimeStamp
        }
    ).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.error(error);
    })
}