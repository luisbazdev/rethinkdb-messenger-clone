import React, { useEffect, useState } from "react";

import './Inbox.css';

import { socket } from '../ws';

import { useParams } from 'react-router-dom';

import axios from "axios";

export default function Inbox({session, inbox, selected}){
    const [lastMessage, setLastMessage] = useState('');

    let { userID } = useParams();

    function addLastMessage(message){
        let imgExt = ['jpg', 'png', 'jpeg', 'gif'];
        let videoExt = ['mp4', 'ogg', 'webm', 'wmv', 'avi', 'mpg', 'mpeg'];

        if(message){
            if(message.message){
                if(message.from == session.user_metadata.sub)
                    setLastMessage(`You: ${message.message}`);
                else
                    setLastMessage(message.data[0].message);
            }
            else{
                if(imgExt.findIndex(_ext => _ext == message.file_ext) != -1){
                    if(message.from == session.user_metadata.sub)
                        setLastMessage('You sent a photo.');
                    else
                        setLastMessage(`${inbox.user_name} sent a photo.`);
                }
                if(videoExt.findIndex(_ext => _ext == message.file_ext) != -1){
                    if(message.from == session.user_metadata.sub)
                        setLastMessage('You sent a video.');
                    else
                        setLastMessage(`${inbox.user_name} sent a video.`);
                }
            }
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