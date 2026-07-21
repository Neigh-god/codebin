import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('codebin-token')
        if (token) {
            fetchUser(token)
        } else {
            setLoading(false)
        }
    }, [])

    const fetchUser = async (token) => {
        try {
            const res = await fetch(`http://localhost:8000/api/auth/me?token=${token}`)
            if (res.ok) {
                const data = await res.json()
                setUser(data)
            } else {
                logout()
            }
        } catch {
            logout()
        } finally {
            setLoading(false)
        }
    }

    const login = (token, userData) => {
        localStorage.setItem('codebin-token', token)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('codebin-token')
        setUser(null)
    }

    const getToken = () => localStorage.getItem('codebin-token')

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, getToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}