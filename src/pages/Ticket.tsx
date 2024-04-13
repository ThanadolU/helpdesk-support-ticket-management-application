import React, { useEffect, useState } from 'react';
import Input from 'antd/es/input/Input';
import TextArea from 'antd/es/input/TextArea';
import { Button, Modal } from 'antd';
import { addTicket } from '../routes/client/AddTicket';
import '../styles/ManageTicketPage.css';
import Swal from 'sweetalert2';
import { TicketInterface } from '../interfaces/Ticket';
import { getAllTickets } from '../routes/client/GetTickets';
import { editTicket } from '../routes/client/EditTicket';

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

    const handleAddTicket = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (title !== "" && description !== "" && contactInformation !== "") {
            await addTicket(title, description, contactInformation);
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

    const handleEditTicket = async (e: React.MouseEvent<HTMLButtonElement>) => {
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

    const getDate = (date: Date) => {
        return new Date(date);
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
                        <h3>Pending</h3>
                        <div className='ticket-column pending'>
                            {
                                allTickets.map((ticket: TicketInterface) => {
                                    if (ticket['status'] == 'pending') {
                                        let createdTimeStamp = getDate(ticket['createdTimeStamp']);
                                        let latestUpdateTimeStamp = getDate(ticket['latestUpdateTimeStamp']);
                                        return (
                                            <div key={ticket['id']} className='ticket'>
                                                <h4>
                                                    {ticket['title']}
                                                    <Button className='edit-button' onClick={() => {
                                                        showEditTicketModal();
                                                        setId(ticket['id']);
                                                        setTitle(ticket['title']);
                                                        setDescription(ticket['description']);
                                                        setContactInformation(ticket['contactInfo']);
                                                        setStatus(ticket['status']);
                                                        console.log(id)
                                                    }}
                                                    >
                                                        Edit
                                                    </Button>
                                                </h4>
                                                <p>Description: {ticket['description']}</p>
                                                <p>Contact Information: {ticket['contactInfo']}</p>
                                                <p>Status: {ticket['status']}</p>
                                                <p>
                                                    Created Date: {ticket['createdTimeStamp'] ? createdTimeStamp.toLocaleDateString() : ''}
                                                </p>
                                                <p>
                                                    Created Time: {createdTimeStamp.getHours()}:{createdTimeStamp.getMinutes()}:{createdTimeStamp.getSeconds()}
                                                </p>
                                                <p>
                                                    Latest Update Date: {ticket['latestUpdateTimeStamp'] ? latestUpdateTimeStamp.toLocaleDateString() : ''}
                                                </p>
                                                <p>
                                                    Latest Update Time: {latestUpdateTimeStamp.getHours()}:{latestUpdateTimeStamp.getMinutes()}:{latestUpdateTimeStamp.getSeconds()}
                                                </p>
                                                <Modal open={isEditTicketModalOpen} onOk={handleEditTicket} onCancel={handleEditTicketCancel}>
                                                    {

                                                    }
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
                                                </Modal>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <>
                                            </>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                    <div className='column'>
                        <h3>Accepted</h3>
                        <div className='ticket-column accepted'>
                            {
                                allTickets.map((ticket: TicketInterface) => {
                                    if (ticket['status'] == 'accepted') {
                                        let createdTimeStamp = getDate(ticket['createdTimeStamp']);
                                        let latestUpdateTimeStamp = getDate(ticket['latestUpdateTimeStamp']);
                                        return (
                                            <div key={ticket['id']} className='ticket'>
                                                <h4>
                                                    {ticket['title']}
                                                    <Button className='edit-button' onClick={() => {
                                                        showEditTicketModal();
                                                        setId(ticket['id']);
                                                        setTitle(ticket['title']);
                                                        setDescription(ticket['description']);
                                                        setContactInformation(ticket['contactInfo']);
                                                        setStatus(ticket['status']);
                                                        console.log(id)
                                                    }}>
                                                        Edit
                                                    </Button>
                                                </h4>
                                                <p>Description: {ticket['description']}</p>
                                                <p>Contact Information: {ticket['contactInfo']}</p>
                                                <p>Status: {ticket['status']}</p>
                                                <p>
                                                    Created Date: {ticket['createdTimeStamp'] ? createdTimeStamp.toLocaleDateString() : ''}
                                                </p>
                                                <p>
                                                    Created Time: {createdTimeStamp.getHours()}:{createdTimeStamp.getMinutes()}:{createdTimeStamp.getSeconds()}
                                                </p>
                                                <p>
                                                    Latest Update Date: {ticket['latestUpdateTimeStamp'] ? latestUpdateTimeStamp.toLocaleDateString() : ''}
                                                </p>
                                                <p>
                                                    Latest Update Time: {latestUpdateTimeStamp.getHours()}:{latestUpdateTimeStamp.getMinutes()}:{latestUpdateTimeStamp.getSeconds()}
                                                </p>
                                                <Modal open={isEditTicketModalOpen} onOk={handleEditTicket} onCancel={handleEditTicketCancel}>
                                                    {

                                                    }
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
                                                </Modal>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <>
                                            </>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                    <div className='column'>
                        <h3>Resolved</h3>
                        <div className='ticket-column resolved'>
                            {
                                allTickets.map((ticket: TicketInterface) => {
                                    if (ticket['status'] == 'resolved') {
                                        let createdTimeStamp = getDate(ticket['createdTimeStamp']);
                                        let latestUpdateTimeStamp = getDate(ticket['latestUpdateTimeStamp']);
                                        return (
                                            <div key={ticket['id']} className='ticket'>
                                                <h4>
                                                    {ticket['title']}
                                                    <Button className='edit-button' onClick={() => {
                                                        showEditTicketModal();
                                                        setId(ticket['id']);
                                                        setTitle(ticket['title']);
                                                        setDescription(ticket['description']);
                                                        setContactInformation(ticket['contactInfo']);
                                                        setStatus(ticket['status']);
                                                        console.log(id)
                                                    }}
                                                    >
                                                        Edit
                                                    </Button>
                                                </h4>
                                                <p>Description: {ticket['description']}</p>
                                                <p>Contact Information: {ticket['contactInfo']}</p>
                                                <p>Status: {ticket['status']}</p>
                                                <p>
                                                    Created Date: {ticket['createdTimeStamp'] ? createdTimeStamp.toLocaleDateString() : ''}
                                                </p>
                                                <p>
                                                    Created Time: {createdTimeStamp.getHours()}:{createdTimeStamp.getMinutes()}:{createdTimeStamp.getSeconds()}
                                                </p>
                                                <p>
                                                    Latest Update Date: {ticket['latestUpdateTimeStamp'] ? latestUpdateTimeStamp.toLocaleDateString() : ''}
                                                </p>
                                                <p>
                                                    Latest Update Time: {latestUpdateTimeStamp.getHours()}:{latestUpdateTimeStamp.getMinutes()}:{latestUpdateTimeStamp.getSeconds()}
                                                </p>
                                                <Modal open={isEditTicketModalOpen} onOk={handleEditTicket} onCancel={handleEditTicketCancel}>
                                                    {

                                                    }
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
                                                </Modal>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <>
                                            </>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                    <div className='column'>
                        <h3>Rejected</h3>
                        <div className='ticket-column rejected'>
                            {
                                allTickets.map((ticket: TicketInterface) => {
                                    if (ticket['status'] == 'rejected') {
                                        let createdTimeStamp = getDate(ticket['createdTimeStamp']);
                                        let latestUpdateTimeStamp = getDate(ticket['latestUpdateTimeStamp']);
                                        return (
                                            <div key={ticket['id']} className='ticket'>
                                                <h4>
                                                    {ticket['title']}
                                                    <Button className='edit-button' onClick={() => {
                                                        showEditTicketModal();
                                                        setId(ticket['id']);
                                                        setTitle(ticket['title']);
                                                        setDescription(ticket['description']);
                                                        setContactInformation(ticket['contactInfo']);
                                                        setStatus(ticket['status']);
                                                        console.log(id)
                                                    }}
                                                    >
                                                        Edit
                                                    </Button>
                                                </h4>
                                                <p>Description: {ticket['description']}</p>
                                                <p>Contact Information: {ticket['contactInfo']}</p>
                                                <p>Status: {ticket['status']}</p>
                                                <p>
                                                    Created Date: {ticket['createdTimeStamp'] ? createdTimeStamp.toLocaleDateString() : ''}
                                                </p>
                                                <p>
                                                    Created Time: {createdTimeStamp.getHours()}:{createdTimeStamp.getMinutes()}:{createdTimeStamp.getSeconds()}
                                                </p>
                                                <p>
                                                    Latest Update Date: {ticket['latestUpdateTimeStamp'] ? latestUpdateTimeStamp.toLocaleDateString() : ''}
                                                </p>
                                                <p>
                                                    Latest Update Time: {latestUpdateTimeStamp.getHours()}:{latestUpdateTimeStamp.getMinutes()}:{latestUpdateTimeStamp.getSeconds()}
                                                </p>
                                                <Modal open={isEditTicketModalOpen} onOk={handleEditTicket} onCancel={handleEditTicketCancel}>
                                                    {

                                                    }
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
                                                </Modal>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <>
                                            </>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>
                <Button className='add-ticket-button' onClick={showAddTicketModal}>Add Ticket</Button>
                <Modal open={isAddTicketModalOpen} onOk={handleAddTicket} onCancel={handleAddTicketCancel}>
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
                </Modal>
            </div>
        </>
    )
}

export default Ticket