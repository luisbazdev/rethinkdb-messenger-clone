import React from "react"

export default function Message({message}){
    return (
        <div>
            <p>{message.message}</p>
        </div>
    )
}