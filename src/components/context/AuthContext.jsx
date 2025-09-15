import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [configData, setConfigData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = () => {
            const storedUser = localStorage.getItem("user");
            const storedConfig = localStorage.getItem("config-data");

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            if (storedConfig) {
                setConfigData(JSON.parse(storedConfig));
            }

            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (userData, additionalData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        if (additionalData?.configData) {
            localStorage.setItem("config-data", JSON.stringify(additionalData.configData));
            setConfigData(additionalData.configData);
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("config-data");
        // Remove other localStorage items as needed
        setUser(null);
        setConfigData(null);
    };

    const value = {
        user,
        configData,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};