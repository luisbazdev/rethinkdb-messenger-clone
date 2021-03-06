import React, { useState, useEffect } from "react";

import { supabase } from "../supabase";

const AuthContext = React.createContext(null)

/**
 * Work on this, the user should
 * get redirected to '/t' after
 * logging in, which doesn't happen
 * right now.
 */
const AuthProvider = ({children}) => {

    const [ session, setSession ] = useState(null);

    async function checkUser() {
        const user = supabase.auth.user();
        setSession(user);
    }

    useEffect(() => {
        checkUser();
    }, [])

    const data = {
        session,
        setSession
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }

