import React from "react"

import '../styles/Message.css'

import { getExtensions } from "../../utils/extensions";

export default function Message({message, own}){
    let path = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/files/${message.file_path}`;

    let extensions = getExtensions();

    return (
        <div className={`message ${own ? 'own' : ''}`}>
            { message.message && 
            <p className='message_content'>{message.message}</p>}

            {extensions.image.find(_ext => _ext == message.file_ext) 
            && <img className='message_file' src={path}/>}

            {extensions.video.find(_ext => _ext == message.file_ext) 
            && <video controls 
            className='message_file' 
            src={path}/>
            }

        </div>
    )
}