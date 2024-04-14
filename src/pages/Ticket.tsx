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
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

function Ticket() {
    const [isAddTicketModalOpen, setIsAddTicketModalOpen] = useState<boolean>(false);
    const [isEditTicketModalOpen, setIsEditTicketModalOpen] = useState<boolean>(false);
    const [allTickets, setAllTickets] = useState<TicketInterface[]>([]);
    const [pendingTickets, setPendingTickets] = useState<TicketInterface[]>([]);
    const [acceptedTickets, setAcceptedTickets] = useState<TicketInterface[]>([]);
    const [resolvedTickets, setResolvedTickets] = useState<TicketInterface[]>([]);
    const [rejectedTickets, setRejectedTickets] = useState<TicketInterface[]>([]);
    const [id, setId] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [contactInformation, setContactInformation] = useState<string>("");
    const [status, setStatus] = useState<string>("");

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
            const newTicket = await addTicket(title, description, contactInformation, status);
            Swal.fire({
                title: "Add success",
                text: "Adding new ticket successful",
                icon: "success"
            })
            switch (status) {
                case TicketStatus.PENDING:
                    setPendingTickets([...pendingTickets, newTicket]);
                    break;
                case TicketStatus.ACCEPTED:
                    setAcceptedTickets([...acceptedTickets, newTicket]);
                    break;
                case TicketStatus.RESOLVED:
                    setResolvedTickets([...resolvedTickets, newTicket]);
                    break;
                case TicketStatus.REJECTED:
                    setRejectedTickets([...rejectedTickets, newTicket]);
                    break;
                default:
                    break;
            }
            console.log(pendingTickets)
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

    function handleOnDragOver(e: React.DragEvent) {
        e.preventDefault();
    }

    function handleOnDrop(e: React.DragEvent, status: string) {
        e.preventDefault()

        const droppedTicket = JSON.parse(e.dataTransfer.getData('ticket'));
        // Update the status of the dropped ticket
        const updatedTickets = sortedTickets.filter((ticket) => ticket.id !== droppedTicket.id);

        // Update the status of the dropped ticket
        droppedTicket['status'] = status;
      
        // Update the state with the new set of tickets
        setAllTickets([...updatedTickets, droppedTicket]);

        switch (status) {
            case TicketStatus.PENDING:
                setPendingTickets([...pendingTickets, droppedTicket]);
                break;
            case TicketStatus.ACCEPTED:
                setAcceptedTickets([...acceptedTickets, droppedTicket]);
                break;
            case TicketStatus.RESOLVED:
                setResolvedTickets([...resolvedTickets, droppedTicket]);
                break;
            case TicketStatus.REJECTED:
                setRejectedTickets([...rejectedTickets, droppedTicket]);
                break;
            default:
                break;
        }

        editTicket(droppedTicket.id, droppedTicket.title, droppedTicket.description, droppedTicket.contactInfo, status)
    }

    // const onDragEnd = (result) => {
    //     if (!result.destination) {
    //         return;
    //     }
        
    //     const { source, destination } = result;
    //     const draggedTicket = allTickets[source.index];
    //     const updatedTickets = [...allTickets];
    //     updatedTickets.splice(source.index, 1);
    //     updatedTickets.splice(destination.index, 0, draggedTicket);
        
    //     // Update ticket status based on column ID
    //     let status = TicketStatus.PENDING;
    //     switch (destination.droppableId) {
    //         case 'accepted':
    //             status = TicketStatus.ACCEPTED;
    //             break;
    //         case 'resolved':
    //             status = TicketStatus.RESOLVED;
    //             break;
    //         case 'rejected':
    //             status = TicketStatus.REJECTED;
    //             break;
    //         default:
    //             status = TicketStatus.PENDING;
    //     }

    //     // Update ticket status in the backend
    //     editTicket(draggedTicket.id, draggedTicket.title, draggedTicket.description, draggedTicket.contactInfo, status);

    //     setAllTickets(updatedTickets);
    // };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tickets = await getAllTickets();
                setAllTickets(tickets);
                setPendingTickets(sortedTickets.filter((ticket: TicketInterface) => ticket['status'] == 'pending'));
                setAcceptedTickets(sortedTickets.filter((ticket: TicketInterface) => ticket['status'] == 'accepted'));
                setResolvedTickets(sortedTickets.filter((ticket: TicketInterface) => ticket['status'] == 'resolved'));
                setRejectedTickets(sortedTickets.filter((ticket: TicketInterface) => ticket['status'] == 'rejected'));
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };
        fetchData();
    });

    return (
        <>
            <div className='add-ticket'>
                <h1>Helpdesk Ticket Management</h1>
                <div className='ticket-board'>
                    <div className='column'>
                        {/* <DragDropContext onDragEnd={onDragEnd}> */}
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
                            >
                            {/* <Droppable droppableId="all-tickets" direction="horizontal">
                                {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}> */}
                                {
                                    pendingTickets
                                        // .filter((ticket: TicketInterface) => ticket['status'] == TicketStatus.PENDING)
                                        .map((ticket: TicketInterface,  index: number) =>
                                            // <Draggable key={ticket['id']} draggableId={ticket['id']} index={index}>
                                            // {(provided) => (
                                            //     <div
                                            //         ref={provided.innerRef}
                                            //         {...provided.draggableProps}
                                            //         {...provided.dragHandleProps}
                                            //     >
                                                    <TicketItem key={ticket.id} ticket={ticket} onEdit={handleEditTicket} />
                                            //     </div>
                                            // )}
                                            // </Draggable>
                                    )
                                }
                            </div>
                                {/* )}
                            </Droppable>
                        </DragDropContext> */}
                    </div>
                    <div className='column'>
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
                        >
                            {
                                acceptedTickets
                                    // .filter((ticket: TicketInterface) => ticket['status'] == TicketStatus.ACCEPTED)
                                    .map((ticket: TicketInterface) =>
                                        <TicketItem key={ticket['id']} ticket={ticket} onEdit={handleEditTicket} />
                                )
                            }
                        </div>
                    </div>
                    <div className='column'>
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
                        >
                            {
                                resolvedTickets
                                    // .filter((ticket: TicketInterface) => ticket['status'] == TicketStatus.RESOLVED)
                                    .map((ticket: TicketInterface) =>
                                        <TicketItem key={ticket['id']} ticket={ticket} onEdit={handleEditTicket} />
                                )
                            }
                        </div>
                    </div>
                    <div className='column'>
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
                        >
                            {
                                rejectedTickets
                                    // .filter((ticket: TicketInterface) => ticket['status'] == TicketStatus.REJECTED)
                                    .map((ticket: TicketInterface) =>
                                        <TicketItem key={ticket['id']} ticket={ticket} onEdit={handleEditTicket} />
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