import React from "react"

import { ChatContext } from "../../contexts/ChatContext";

export default function Header(){
    
    const { currentChat } = React.useContext(ChatContext);

    return (
        <div className='chat_header'>
            <img id='chat_profile' src={currentChat.avatar_url}/>
            <div className='chat_user_info'>
                <p>{currentChat.user_name}</p>
            </div>
        </div>
    )
}