import React from "react";

import './Inbox.css';

export default function Inbox({inbox}){
    return (
        <div className="inbox">
            <img id='inbox_profile' src={inbox.avatar_url}/>
            <p>{inbox.user_name}</p>
        </div>
    )
}