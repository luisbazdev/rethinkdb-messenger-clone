import React, { useEffect, useState, useRef } from 'react';

import './Chat.css';

import { socket } from '../ws';

import axios from "axios";

import { useParams } from 'react-router-dom';

import Message from './Message';

import { ChatContext } from "../contexts/ChatContext";

import { supabase } from '../supabase';

import uniqid from 'uniqid'

import { MdSend } from 'react-icons/md';
import { BsImage } from 'react-icons/bs';

export default function Chat({session}){
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const [status, setStatus] = useState(null);

    const { currentChat } = React.useContext(ChatContext);

    const [file, setFile] = useState(null);

    const filePicker = useRef(null);

    // The current open chat
    let { userID } = useParams();

    function addFile(e){    
        console.log(e.target.files[0])

        const reader = new FileReader();

        reader.readAsDataURL(e.target.files[0]);

        setFile(e.target.files[0]);
    }

    async function sendMessage(){
        // Send the message and the file separately
        if(message != ''){
            axios.post(`${process.env.REACT_APP_DOMAIN}/api/messages`, {
                from: session.user_metadata.sub,
                target: userID,
                message,
            }).then(() => setMessage(''));
        }

        /**
        * The file doesn't change after being
        * sent, also let users to add multiple
        * files and send them at the same time
        */
        if(file != null){
            const random_id = uniqid();

            const fileExt = file.name.substring(file.name.lastIndexOf(".") + 1);
            const contentType = file.type;

            const { data, error } = await supabase.storage
            .from('files')
            .upload(`${random_id}.${fileExt}`, file, {
                contentType
            })

            axios.post(`${process.env.REACT_APP_DOMAIN}/api/messages`, {
                from: session.user_metadata.sub,
                target: userID,
                file_path: `${random_id}.${fileExt}`,
                file_ext: fileExt
            })
        }
    }

    useEffect(() => {
        if(userID){
            axios.get(`${process.env.REACT_APP_DOMAIN}/api/messages?from=${session.user_metadata.sub}&target=${userID}`)
            .then((_messages) => setMessages(_messages.data));
        }
    }, [userID])

    useEffect(() => {
        socket.on('received message', (_message) => {
            /**
             * 'messages' state gets updated in the following cases:
             * 
             * 1. The user is the sender
             * 2. The user is the receiver and they're on the
             * same chat as the sender
             */
            if(_message.new_val.from == session.user_metadata.sub || _message.new_val.from == userID)
                setMessages((_messages) => [..._messages, _message.new_val]);
        })        

        return () => {
            socket.off();
        }
    }, [userID])

    return (
        <div className='chat'>
            <div className='chat_header'>
                <img id='chat_profile' src={currentChat.avatar_url}/>
                <div className='chat_user_info'>
                    <p>{currentChat.user_name}</p>
                    <p id='chat_status'>{status}</p>
                </div>
            </div>
            <div className='chat_messages'>
                {messages.map((msg) => <Message key={msg.id} message={msg} own={msg.from == session.user_metadata.sub}/>)}
            </div>
            <div className='chat_submit'>
                <input type='file' ref={filePicker} onChange={addFile} hidden/>
                <BsImage className='icon' onClick={() => filePicker.current.click()}/>
                <input type='text' placeholder='Aa' value={message} onChange={(e) => setMessage(e.target.value)}/>
                <MdSend className='icon' onClick={sendMessage}/>
            </div>
        </div>
    )
}