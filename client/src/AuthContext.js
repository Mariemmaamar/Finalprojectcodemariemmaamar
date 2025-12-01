import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Your backend URL
const API = "http://localhost:5000/api/auth";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Load user from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("nutriUser");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem("nutriUser");
            }
        }
    }, []);

    /* ==========================
          LOGIN (API call)
       ========================== */
    async function login(email, password) {
        try {
            const res = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) return false;

            const userData = await res.json();

            setUser(userData);
            localStorage.setItem("nutriUser", JSON.stringify(userData));

            return true;
        } catch (err) {
            console.error("Login error:", err);
            return false;
        }
    }

    /* ==========================
          SIGNUP (API call)
       ========================== */
    async function signup(name, email, password) {
        try {
            const res = await fetch(`${API}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            if (!res.ok) {
                return false;
            }

            return true; // success!
        } catch (err) {
            console.error("Signup error:", err);
            return false;
        }
    }

    /* ==========================
          LOGOUT
       ========================== */
    function logout() {
        setUser(null);
        localStorage.removeItem("nutriUser");
    }

    return ( <
        AuthContext.Provider value = {
            { user, login, signup, logout }
        } > { children } <
        /AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}