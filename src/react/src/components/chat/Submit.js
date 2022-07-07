import React, { useEffect, useState, useRef } from 'react';

import { MdSend } from 'react-icons/md';
import { BsImage } from 'react-icons/bs';

import { socket } from '../../ws';

import axios from "axios";

import { useParams } from 'react-router-dom';

import { supabase } from '../../supabase';

import uniqid from 'uniqid'

import { AuthContext } from "../../contexts/AuthContext";

import Preview from './Preview';
import { extractExtension } from '../../utils/extensions';

export default function Submit(){

    // The current open chat
    const { userID } = useParams()

    const { session } = React.useContext(AuthContext);

    const [message, setMessage] = useState('');

    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const filePicker = useRef(null);;

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

                    const fileExt = extractExtension(_file.name)
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

    function onMessageChange(e){
        if(e.target.value != '')
            // Sent 'user writing' event to target
            socket.emit('user writing', session.user_metadata.sub, userID);

        setMessage(e.target.value);
    }

    function addFile(e){    

        const reader = new FileReader();

        reader.readAsDataURL(e.target.files[0]);

        setFiles((_files) => [..._files, e.target.files[0]]);

        reader.onload = (e) => {
            setPreviews((_previews) => [..._previews, e.target.result]);
        }
    }

    useEffect(() => {
        return () => {
            socket.off();

            setFiles([]);
            setPreviews([]);
        }
    }, [userID])

    return (
        <div className='chat_submit'>
            <input type='file' ref={filePicker} 
            onChange={addFile} 
            onClick={(e) => e.target.value = null}
            hidden/>
            <BsImage className='icon' onClick={() => filePicker.current.click()}/>
            <div className='chat_container'>
                <div className='chat_files'>
                    { previews.length > 0 && previews.map((_preview, index) => <Preview file={files[index]} preview={_preview}/>)}
                </div>
                <input type='text' placeholder='Aa' value={message} onChange={onMessageChange}/>
            </div>
            <MdSend className='icon' onClick={sendMessage}/>
    </div>
    )
}