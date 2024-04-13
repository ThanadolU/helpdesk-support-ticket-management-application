import React from 'react';
import { Modal,  Input, Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';

interface AddTicketModelProps {
    open: boolean;
    onCancel: () => void;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    contactInfo: string;
    setContactInfo: React.Dispatch<React.SetStateAction<string>>;
    handleAddSubmit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
};

function AddTicketModal({open, onCancel, title, setTitle, description, setDescription, contactInfo, setContactInfo, handleAddSubmit}: AddTicketModelProps) {
    return (
        <Modal open={open} onCancel={onCancel} footer={null}>
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
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                    />
                </label>
                <Button onClick={handleAddSubmit} type='primary'>Add</Button>
            </div>
        </Modal>
    )
}

export default AddTicketModal