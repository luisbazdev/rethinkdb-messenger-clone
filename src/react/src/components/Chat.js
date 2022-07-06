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
    const [writing, setWriting] = useState(false);

    const { currentChat } = React.useContext(ChatContext);

    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const filePicker = useRef(null);

    // The current open chat
    let { userID } = useParams();

    function addFile(e){    

        const reader = new FileReader();

        reader.readAsDataURL(e.target.files[0]);

        setFiles((_files) => [..._files, e.target.files[0]]);

        reader.onload = (e) => {
            setPreviews((_previews) => [..._previews, e.target.result]);
        }
    }

    function onMessageChange(e){
        if(e.target.value != '')
            // Sent 'user writing' event to target
            socket.emit('user writing', session.user_metadata.sub, userID);

        setMessage(e.target.value);
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

        if(files.length > 0){
            files.forEach( async (_file) => {
                try {
                    const random_id = uniqid();

                    const fileExt = _file.name.substring(_file.name.lastIndexOf(".") + 1);
                    const contentType = _file.type;
        
                    const { data, error } = await supabase.storage
                    .from('files')
                    .upload(`${random_id}.${fileExt}`, _file, {
                        contentType
                    })
        
                    axios.post(`${process.env.REACT_APP_DOMAIN}/api/messages`, {
                        from: session.user_metadata.sub,
                        target: userID,
                        file_path: `${random_id}.${fileExt}`,
                        file_ext: fileExt
                    })
                } catch (error) {
                    console.log(error)
                }
            });

            setFiles([]);
            setPreviews([]);
        }
    }

    useEffect(() => {
        if(userID){
            axios.get(`${process.env.REACT_APP_DOMAIN}/api/messages?from=${session.user_metadata.sub}&target=${userID}&orderBy=asc`)
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
            if(_message.new_val.from == session.user_metadata.sub || _message.new_val.from == userID){
                setMessages((_messages) => [..._messages, _message.new_val]);
                setWriting(false);
            }
        })        

        socket.on('user writing', (_from) => {
            if(userID == _from){
                setWriting(true);
                
                setTimeout(() => {
                    setWriting(false);
                }, 5000)
            }
        })

        return () => {
            socket.off();

            setFiles([]);
            setPreviews([]);
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
                {writing && <Message key={'writing'} message={{message: '...'}} own={false}/>}
            </div>
            <div className='chat_submit'>
                <input type='file' ref={filePicker} 
                onChange={addFile} 
                onClick={(e) => e.target.value = null}
                hidden/>
                <BsImage className='icon' onClick={() => filePicker.current.click()}/>
                    <div className='chat_container'>
                        <div className='chat_files'>
                            { previews.length > 0 && previews.map((_pre) => {
                                return <img className='selected_file' src={_pre}/>
                            })}
                        </div>

                        <input type='text' placeholder='Aa' value={message} onChange={onMessageChange}/>
                    </div>
                <MdSend className='icon' onClick={sendMessage}/>
            </div>
        </div>
    )
}