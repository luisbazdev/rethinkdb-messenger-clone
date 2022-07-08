import React, { useEffect, useState } from "react";

const ChatContext = React.createContext(null)

const ChatProvider = ({children}) => {

    const [currentChat, setCurrentChat] = useState(null)

    const data = {
        currentChat,
        setCurrentChat
    }

    return (
        <ChatContext.Provider value={data}>
            {children}
        </ChatContext.Provider>
    )
}

export { ChatContext, ChatProvider }
