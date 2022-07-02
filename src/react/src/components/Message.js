import React from "react"

import './Message.css'

export default function Message({message, own}){
    return (
        <div className={`message ${own ? 'own' : ''}`}>
            <p className='message_content'>{message.message}</p>
        </div>
    )
}