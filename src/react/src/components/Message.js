import React from "react"

import './Message.css'

export default function Message({message, own}){

    const full_path = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/files/${message.file_path}`;

    const imgExt = ['jpg', 'png', 'jpeg', 'gif'];
    const videoExt = ['mp4', 'ogg', 'webm', 'wmv', 'avi', 'mpg', 'mpeg'];

    return (
        <div className={`message ${own ? 'own' : ''}`}>
            { message.message && 
            <p className='message_content'>{message.message}</p>}

            {imgExt.find(_ext => _ext == message.file_ext) 
            && <img className='message_file' src={full_path}/>}

            {videoExt.find(_ext => _ext == message.file_ext) 
            && <video controls 
            className='message_file' 
            src={full_path}/>}

        </div>
    )
}