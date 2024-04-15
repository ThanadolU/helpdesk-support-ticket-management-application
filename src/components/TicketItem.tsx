import React, { useState } from 'react'
import { Button } from 'antd';
import { TicketInterface } from '../interfaces/Ticket';

function TicketItem({ ticket, status, onEdit, dropIndicator, setDropIndicator }: { ticket: TicketInterface, status: string, onEdit: (ticket: TicketInterface) => void, dropIndicator: string | null, setDropIndicator: React.Dispatch<React.SetStateAction<string | null>> }) {

    const getDate = (date: Date) => {
        return new Date(date);
    }

    function formatTime(unit:number) {
        return unit < 10 ? '0' + unit : unit;
    }

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('ticket', JSON.stringify(ticket));
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.clearData();
        setDropIndicator(null);
    };

    let createdTimeStamp = getDate(ticket['createdTimeStamp']);
    let latestUpdateTimeStamp = getDate(ticket['latestUpdateTimeStamp']);
    return (
        <div className='ticket' 
            draggable 
            onDragStart={(e) => {
                handleDragStart(e);
            }}
            onDragEnd={(e) => {
                handleDragEnd(e);
            }}
            style={{backgroundColor: dropIndicator === status ? "#90CAF9" : ""}}
        >
            <div className='ticket-header'>
                <h4>{ticket['title']}</h4>
                <Button className='edit-button' onClick={() => onEdit(ticket)}>Edit</Button>
            </div>
            <div className='ticket-body'>
                <p>Description: {ticket['description']}</p>
                <p>Contact Information: {ticket['contactInfo']}</p>
                <p>Status: {ticket['status']}</p>
                <p>
                    Created Date: {createdTimeStamp ? createdTimeStamp.toLocaleDateString() : ''}
                </p>
                <p>
                    Created Time: {formatTime(createdTimeStamp.getHours())}:{formatTime(createdTimeStamp.getMinutes())}:{formatTime(createdTimeStamp.getSeconds())}
                </p>
                <p>
                    Latest Update Date: {latestUpdateTimeStamp ? latestUpdateTimeStamp.toLocaleDateString() : ''}
                </p>
                <p>
                    Latest Update Time: {formatTime(latestUpdateTimeStamp.getHours())}:{formatTime(latestUpdateTimeStamp.getMinutes())}:{formatTime(latestUpdateTimeStamp.getSeconds())}
                </p>
            </div>
        </div>
    )
}

export default TicketItem