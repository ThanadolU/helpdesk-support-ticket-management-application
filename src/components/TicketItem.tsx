import React, { useState } from 'react'
import { Button } from 'antd';
import { TicketInterface } from '../interfaces/Ticket';

function TicketItem({ ticket, onEdit }: { ticket: TicketInterface, onEdit: (ticket: TicketInterface) => void }) {

    const getDate = (date: Date) => {
        return new Date(date);
    }

    // function handleOnDrag(e: React.DragEvent, name: string) {
    //     e.dataTransfer.setData("name", name);
    // }
    const handleDragStart = (e: React.DragEvent) => {
        // e.preventDefault()
        e.dataTransfer.setData('ticket', JSON.stringify(ticket));
    };

    let createdTimeStamp = getDate(ticket['createdTimeStamp']);
    let latestUpdateTimeStamp = getDate(ticket['latestUpdateTimeStamp']);
    return (
        <div className='ticket' 
            draggable 
            onDragStart={(e) => {
                handleDragStart(e);
            }}
        >
            <h4>
                {ticket['title']}
                <Button className='edit-button' onClick={() => onEdit(ticket)}>Edit</Button>
            </h4>
            <p>Description: {ticket['description']}</p>
            <p>Contact Information: {ticket['contactInfo']}</p>
            <p>Status: {ticket['status']}</p>
            <p>
                Created Date: {createdTimeStamp ? createdTimeStamp.toLocaleDateString() : ''}
            </p>
            <p>
                Created Time: {createdTimeStamp.getHours()}:{createdTimeStamp.getMinutes()}:{createdTimeStamp.getSeconds()}
            </p>
            <p>
                Latest Update Date: {latestUpdateTimeStamp ? latestUpdateTimeStamp.toLocaleDateString() : ''}
            </p>
            <p>
                Latest Update Time: {latestUpdateTimeStamp.getHours()}:{latestUpdateTimeStamp.getMinutes()}:{latestUpdateTimeStamp.getSeconds()}
            </p>
        </div>
    )
}

export default TicketItem