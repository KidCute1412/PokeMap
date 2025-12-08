import {useContext, createContext, useState, useEffect} from "react";









const AuthContext = createContext();

export default function ProtectedRouter({children}) {
    const [user, setUser] = useState(null);
    useEffect (() => {
        fetch("http://localhost:10000/api/auth/me", {
            credentials: "include"
        })
        .then (res => {
            if (!res.ok) {
                throw new Error (res.json().message || "Failed to fetch user data");
            }
            return res.json();
        })
        .then (data => {
            if (data.success){
                setUser(data.user);
            } else {
                
                setUser(null);
            }
        })
        .catch (err => {
            console.error("Error fetching user data:", err);    
            setUser(null);
        });
    }, [])

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}
export function useAuth() {
    return useContext(AuthContext);
}