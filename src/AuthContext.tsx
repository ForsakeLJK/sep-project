import React, { createContext, useState, useContext, ReactNode } from 'react';
import { postData } from './apiService';

interface AuthContextType {
    userRole: string | null;
    logname: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [logname, setLogname] = useState<string | null>(null);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await postData('login', { username, password });
            if (response.loginSuccess) {
                setUserRole(response.userRole);
                setLogname(response.username);
                return true;
            }
            return false;
        } catch(error) {
            return false;
        }
    };

    const logout = () => {
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ userRole, logname, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
