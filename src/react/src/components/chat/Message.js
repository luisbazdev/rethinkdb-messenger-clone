import React from "react"

import '../styles/Message.css'

import { getExtensions } from "../../utils/extensions";
import { formatDate } from "../../libs/string";

import { ChatContext } from "../../contexts/ChatContext";

export default function Message({message, own}){
    // let date = formatDate(message.createdAt);

    let path = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/files/${message.file_path}`;

    let extensions = getExtensions();

    var { currentChat } = React.useContext(ChatContext)

    return (
        <div className={`message_box ${own ? 'own' : ''}`}>
            {/* <div className='message_date'>
                <p>{date}</p>
            </div> */}
            <div className='message'>
                {!own && <img src={currentChat.avatar_url} className='message_user_avatar'/>}
                {message.message && <div className='message_content'>
                    <p>{message.message}</p>
                </div>}

                {extensions.image.find(_ext => _ext == message.file_ext) 
                && <img className='message_file' src={path}/>}

                {extensions.video.find(_ext => _ext == message.file_ext) 
                && <video controls 
                className='message_file' 
                src={path}/>
                }
            </div>

        </div>
    )
}