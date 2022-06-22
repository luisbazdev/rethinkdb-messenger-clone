import React, { useState } from "react";

const AuthContext = React.createContext(null)

const AuthProvider = ({children}) => {
    const [session, setSession] = useState(null)

    const data = { session, setSession }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }

