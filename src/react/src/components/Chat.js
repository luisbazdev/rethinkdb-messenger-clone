import React, { useEffect, useState} from 'react';

import './Chat.css';

import { socket } from '../ws';

import axios from "axios";

import { useParams } from 'react-router-dom';

import Message from './Message';

import { ChatContext } from "../contexts/ChatContext";

export default function Chat({session}){
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const [status, setStatus] = useState(null);

    const { currentChat } = React.useContext(ChatContext)

    // The current open chat
    let { userID } = useParams();

    function sendMessage(){
        axios.post(`${process.env.REACT_APP_DOMAIN}/api/messages`, {
            from: session.user_metadata.sub,
            target: userID,
            message
        }).then(() => setMessage(''));
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
                <input type='text' value={message} onChange={(e) => setMessage(e.target.value)}/>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}