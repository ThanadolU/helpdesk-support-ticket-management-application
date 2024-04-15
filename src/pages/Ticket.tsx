import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { addTicket } from '../routes/client/AddTicket';
import Swal from 'sweetalert2';
import { TicketInterface } from '../interfaces/Ticket';
import { getAllTickets } from '../routes/client/GetTickets';
import { editTicket } from '../routes/client/EditTicket';
import TicketItem from '../components/TicketItem';
import AddTicketModal from '../components/AddTicketModal';
import EditTicketModal from '../components/EditTicketModal';
import '../styles/ManageTicketPage.css';
import { TicketStatus } from '../interfaces/TicketStatus';

function Ticket() {
    const [isAddTicketModalOpen, setIsAddTicketModalOpen] = useState<boolean>(false);
    const [isEditTicketModalOpen, setIsEditTicketModalOpen] = useState<boolean>(false);
    const [allTickets, setAllTickets] = useState<TicketInterface[]>([]);
    const [id, setId] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [contactInformation, setContactInformation] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [dropIndicator, setDropIndicator] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const tickets = await getAllTickets();
            setAllTickets(tickets);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    useEffect(() => {
        fetchData();

        const interval = setInterval(() => {
            fetchData(); // Fetch data periodically
        }, 100); // Fetch data every 1 minute (adjust this interval as needed)
    
        return () => clearInterval(interval); // Clean up interval on component unmount
    }, []);

    const sortedTickets = allTickets.sort((a:TicketInterface, b:TicketInterface) => {
        const dateA = new Date(a.latestUpdateTimeStamp).getTime();
        const dateB = new Date(b.latestUpdateTimeStamp).getTime();
        return dateB - dateA; // Compare dates in descending order
    })

    const showAddTicketModal = () => {
        setIsAddTicketModalOpen(true);
    };

    const handleAddTicketSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (title !== "" && description !== "" && contactInformation !== "") {
            await addTicket(title, description, contactInformation, status);
            Swal.fire({
                title: "Add success",
                text: "Adding new ticket successful",
                icon: "success"
            })
            fetchData();
        } else {
            Swal.fire({
                title: "Error add new ticket",
                text: "You have to fill in all information for adding new ticket",
                icon: "error"
            })
        }
        setTitle("");
        setDescription("");
        setContactInformation("");
        setIsAddTicketModalOpen(false);
    };

    const handleAddTicketCancel = () => {
        setIsAddTicketModalOpen(false);
    };

    const showEditTicketModal = () => {
        setIsEditTicketModalOpen(true);
    };

    const handleEditTicketSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (title !== "" && description !== "" && contactInformation !== "" && status !== "") {
            await editTicket(id, title, description, contactInformation, status);
            Swal.fire({
                title: "Update success",
                text: "Updating ticket successful",
                icon: "success"
            })
            fetchData();
        } else {
            Swal.fire({
                title: "Error update ticket",
                text: "You have to fill in all information for updating ticket",
                icon: "error"
            })
        }
        setId("")
        setTitle("");
        setDescription("");
        setContactInformation("");
        setStatus("");
        setIsEditTicketModalOpen(false);
    };

    const handleEditTicketCancel = () => {
        setIsEditTicketModalOpen(false);
    };

    const handleEditTicket = (ticket: TicketInterface) => {
        showEditTicketModal();
        setId(ticket['id']);
        setTitle(ticket['title']);
        setDescription(ticket['description']);
        setContactInformation(ticket['contactInfo']);
        setStatus(ticket['status'])
    }

    function handleOnDragOver(e: React.DragEvent) {
        e.preventDefault();
        setDropIndicator(e.currentTarget.id);
    }

    function handleOnDrop(e: React.DragEvent, status: string) {
        e.preventDefault()

        const droppedTicket = JSON.parse(e.dataTransfer.getData('ticket'));
        // Update the status of the dropped ticket
        const updatedTickets = sortedTickets.filter((ticket) => ticket.id !== droppedTicket.id);

        // Update the status of the dropped ticket
        droppedTicket['status'] = status;
      
        editTicket(droppedTicket.id, droppedTicket.title, droppedTicket.description, droppedTicket.contactInfo, status)

        // Update the state with the new set of tickets
        setAllTickets([...updatedTickets, droppedTicket]);

        // setAllTickets((prevTickets) =>
        //     prevTickets?.map((_ticket) => (_ticket['id'] == droppedTicket['id'] ? droppedTicket : _ticket))
        // )
        setDropIndicator(null);
    }

    const renderTickets = (status: string) => {
        return sortedTickets
            .filter((ticket: TicketInterface) => ticket['status'] == status)
            .map((ticket: TicketInterface) =>
                <TicketItem 
                    key={ticket['id']} 
                    ticket={ticket}
                    status={status}
                    onEdit={handleEditTicket} 
                    dropIndicator={dropIndicator} 
                    setDropIndicator={setDropIndicator}
                />
            );
    };

    return (
        <>
            <div className='add-ticket'>
                <h1>Helpdesk Ticket Management</h1>
                <div className='ticket-board'>
                    <div className='column'>
                        <div className='color-bar pending'></div>
                        <div className='column-header'>
                            <h3>Pending</h3>
                            <Button className='add-item' 
                                onClick={() => {
                                    setIsAddTicketModalOpen(true); 
                                    setStatus(TicketStatus.PENDING);
                                    }} 
                                type='primary'>
                                    Add item
                            </Button>
                        </div>
                        <div className='ticket-column pending' 
                            onDragOver={(e) => handleOnDragOver(e)} 
                            onDrop={(e) => handleOnDrop(e, TicketStatus.PENDING)}
                            style={{backgroundColor: dropIndicator === status ? "#ebf8ff" : ""}}
                        >
                            {renderTickets(TicketStatus.PENDING)}
                        </div>
                    </div>
                    <div className='column'>
                        <div className='color-bar accepted'></div>
                        <div className='column-header'>
                            <h3>Accepted</h3>
                            <Button className='add-item' 
                                onClick={() => {
                                    setIsAddTicketModalOpen(true); 
                                    setStatus(TicketStatus.ACCEPTED);
                                    }} 
                                type='primary'>
                                    Add item
                            </Button>
                        </div>
                        <div className='ticket-column accepted'
                            onDragOver={(e) => handleOnDragOver(e)}
                            onDrop={(e) => handleOnDrop(e, TicketStatus.ACCEPTED)}
                            style={{backgroundColor: dropIndicator === status ? "#ebf8ff" : ""}}
                        >
                            {renderTickets(TicketStatus.ACCEPTED)}
                        </div>
                    </div>
                    <div className='column'>
                        <div className='color-bar resolved'></div>
                        <div className='column-header'>
                            <h3>Resolved</h3>
                            <Button className='add-item' 
                                onClick={() => {
                                    setIsAddTicketModalOpen(true); 
                                    setStatus(TicketStatus.RESOLVED);
                                    }} 
                                type='primary'>
                                    Add item
                            </Button>
                        </div>
                        <div className='ticket-column resolved'
                            onDragOver={(e) => handleOnDragOver(e)}
                            onDrop={(e) => handleOnDrop(e, TicketStatus.RESOLVED)}
                            style={{backgroundColor: dropIndicator === status ? "#ebf8ff" : ""}}
                        >
                            {renderTickets(TicketStatus.RESOLVED)}
                        </div>
                    </div>
                    <div className='column'>
                        <div className='color-bar rejected'></div>
                        <div className='column-header'>
                            <h3>Rejected</h3>
                            <Button className='add-item' 
                                onClick={() => {
                                    setIsAddTicketModalOpen(true); 
                                    setStatus(TicketStatus.REJECTED);
                                    }} 
                                type='primary'>
                                    Add item
                            </Button>
                        </div>
                        <div className='ticket-column rejected'
                            onDragOver={(e) => handleOnDragOver(e)}
                            onDrop={(e) => handleOnDrop(e, TicketStatus.REJECTED)}
                            style={{backgroundColor: dropIndicator === status ? "#ebf8ff" : ""}}
                        >
                            {renderTickets(TicketStatus.REJECTED)}
                        </div>
                    </div>
                </div>
                <Button className='add-ticket-button' onClick={showAddTicketModal} type='primary'>Add Ticket</Button>
                <AddTicketModal 
                    open={isAddTicketModalOpen}
                    onCancel={handleAddTicketCancel}
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    contactInfo={contactInformation}
                    setContactInfo={setContactInformation}
                    handleAddSubmit={handleAddTicketSubmit}
                />
                <EditTicketModal
                    open={isEditTicketModalOpen}
                    onCancel={handleEditTicketCancel}
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    contactInfo={contactInformation}
                    setContactInfo={setContactInformation}
                    status={status}
                    setStatus={setStatus}
                    handleEditSubmit={handleEditTicketSubmit}
                />
            </div>
        </>
    )
}

export default Ticket