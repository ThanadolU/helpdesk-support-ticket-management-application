import axios from 'axios';

export async function getAllTickets() {
    return await axios.get("http://localhost:8060/tickets").
    then((response) => {
        console.log(response);
        return response.data;
    }).catch((error) => {
        console.error(error);
    });
}