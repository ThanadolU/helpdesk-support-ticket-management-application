import React, { useState } from 'react'
import Input from 'antd/es/input/Input'
import TextArea from 'antd/es/input/TextArea'
import { Button } from 'antd'
import { addTicket } from '../routes/client/AddTicket'
import '../styles/AddTicket.css'

function Ticket() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [contactInformation, setContactInformation] = useState<string>("");

    const handleSubmitEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        addTicket(title, description, contactInformation);
    }

    return (
        <>
            <div className='add-ticket'>
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
                <Button className='add-ticket-button' onClick={handleSubmitEvent}>Add Ticket</Button>
            </div>
        </>
    )
}

export default Ticket