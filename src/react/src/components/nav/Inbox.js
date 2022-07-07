import React, { useEffect, useState } from "react";

import '../styles/Inbox.css';

import { socket } from '../../ws';

import { useParams } from 'react-router-dom';

import axios from "axios";

import { formatMessage } from "../../libs/format";

export default function Inbox({session, inbox, selected}){
    const [lastMessage, setLastMessage] = useState('');

    const { userID } = useParams();

    function addLastMessage(message){
        if(message){
            const _formattedMessage = formatMessage(session.user_metadata.uid, message, inbox.user_name);
            setLastMessage(_formattedMessage);
        }
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_DOMAIN}/api/messages?from=${session.user_metadata.sub}&target=${inbox.user_id}&orderBy=desc&limit=1`)
        .then((_lastMessage) => {
            addLastMessage(_lastMessage.data[0])
        });
    }, [])

    useEffect(() => {
        socket.on('received message', (_message) => {
            if((_message.new_val.target == inbox.user_id) || (_message.new_val.from == inbox.user_id))
                addLastMessage(_message.new_val);
        })    

        return () => {
            socket.off();
        }
    }, [userID])

    return (
        <div className='inbox' id={selected ? 'selected' : ''}>
            <img id='inbox_profile' src={inbox.avatar_url}/>
            <div className='details'>
                <p>{inbox.user_name}</p>
                <p className='inbox_last_message'>{lastMessage}</p>
            </div>
        </div>
    )
}