import React, { useState } from "react";

const ModalContext = React.createContext(null)

const ModalProvider = ({children}) => {

    const [seeRemoveMessageModal, setSeeRemoveMessageModal] = useState(false)
    const [messageToRemove, setMessageToRemove] = useState(null)

    const data = {
        messageToRemove,
        setMessageToRemove,
        seeRemoveMessageModal,
        setSeeRemoveMessageModal
    }

    return (
        <ModalContext.Provider value={data}>
            {children}
        </ModalContext.Provider>
    )
}

export { ModalContext, ModalProvider }
