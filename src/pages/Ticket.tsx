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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tickets = await getAllTickets();
                setAllTickets(tickets);
            } catch (error) {
                console.error('Error fetching tickets:', error);
                // Handle error appropriately, e.g., show a message to the user
            }
        };
        fetchData();
        console.log(allTickets);
    }, []);

    return (
        <>
            <div className='add-ticket'>
                <h1>Helpdesk Ticket Management</h1>
                <div className='ticket-board'>
                    <div className='column'>
                        <h3>
                            Pending
                            <Button className='add-item' 
                                onClick={() => {
                                    setIsAddTicketModalOpen(true); 
                                    setStatus(TicketStatus.PENDING);
                                    }} 
                                type='primary'>
                                    Add item
                            </Button>
                        </h3>
                        <div className='ticket-column pending'>
                            {
                                allTickets.map((ticket: TicketInterface) =>
                                    ticket['status'] == 'pending' && <TicketItem key={ticket['id']} ticket={ticket} onEdit={handleEditTicket} />
                                )
                            }
                        </div>
                    </div>
                    <div className='column'>
                        <h3>
                            Accepted
                            <Button className='add-item' 
                                onClick={() => {
                                    setIsAddTicketModalOpen(true); 
                                    setStatus(TicketStatus.ACCEPTED);
                                    }} 
                                type='primary'>
                                    Add item
                            </Button>
                        </h3>
                        <div className='ticket-column accepted'>
                            {
                                allTickets.map((ticket: TicketInterface) =>
                                    ticket['status'] == 'accepted' && <TicketItem key={ticket['id']} ticket={ticket} onEdit={handleEditTicket} />
                                )
                            }
                        </div>
                    </div>
                    <div className='column'>
                        <h3>
                            Resolved
                            <Button className='add-item' 
                                onClick={() => {
                                    setIsAddTicketModalOpen(true); 
                                    setStatus(TicketStatus.RESOLVED);
                                    }} 
                                type='primary'>
                                    Add item
                            </Button>
                        </h3>
                        <div className='ticket-column resolved'>
                            {
                                allTickets.map((ticket: TicketInterface) =>
                                    ticket['status'] == 'resolved' && <TicketItem key={ticket['id']} ticket={ticket} onEdit={handleEditTicket} />
                                )
                            }
                        </div>
                    </div>
                    <div className='column'>
                        <h3>
                            Rejected
                            <Button className='add-item' 
                                onClick={() => {
                                    setIsAddTicketModalOpen(true); 
                                    setStatus(TicketStatus.REJECTED);
                                    }} 
                                type='primary'>
                                    Add item
                            </Button>
                        </h3>
                        <div className='ticket-column rejected'>
                            {
                                allTickets.map((ticket: TicketInterface) =>
                                    ticket['status'] == 'rejected' && <TicketItem key={ticket['id']} ticket={ticket} onEdit={handleEditTicket} />
                                )
                            }
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
                {/* <Modal open={isAddTicketModalOpen} onOk={handleAddTicketSubmit} onCancel={handleAddTicketCancel} footer={null}>
                    <h1 className='title'>Add New Ticket</h1>
                    <div className='body'>
                        <label>
                            <span>Title:</span>
                            <Input
                                className='input'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </label>
                        <label>
                            <span>Description:</span>
                            <TextArea
                                className='input'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </label>
                        <label>
                            <span>Contact Information:</span>
                            <TextArea
                                className='input'
                                value={contactInformation}
                                onChange={(e) => setContactInformation(e.target.value)}
                            />
                        </label>
                    </div>
                </Modal> */}
                {/* <Modal open={isEditTicketModalOpen} onOk={handleEditTicketSubmit} onCancel={handleEditTicketCancel}>
                    <h1 className='title'>Edit Ticket</h1>
                    <div className='body'>
                        <label>
                            <span>Title:</span>
                            <Input
                                className='input'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </label>
                        <label>
                            <span>Description:</span>
                            <TextArea
                                className='input'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </label>
                        <label>
                            <span>Contact Information:</span>
                            <TextArea
                                className='input'
                                value={contactInformation}
                                onChange={(e) => setContactInformation(e.target.value)}
                            />
                        </label>
                        <label>
                            <span>Status</span>
                            <TextArea
                                className='input'
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            />
                        </label>
                    </div>
                </Modal> */}
            </div>
        </>
    )
}

export default Ticket