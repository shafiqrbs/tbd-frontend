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
            try {
                const storedUser = localStorage.getItem("user");
                const storedConfig = localStorage.getItem("config-data");

                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                if (storedConfig) {
                    setConfigData(JSON.parse(storedConfig));
                }
            } catch (error) {
                console.error("Error initializing auth:", error);
                // Clear corrupted data
                localStorage.removeItem("user");
                localStorage.removeItem("config-data");
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (userData, additionalData = {}) => {
        try {
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);

            if (additionalData.configData) {
                // Make sure we're storing the actual config data, not a wrapped object
                localStorage.setItem("config-data", JSON.stringify(additionalData.configData));
                setConfigData(additionalData.configData);
            }
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("config-data");
        localStorage.removeItem("accounting-transaction-mode");
        localStorage.removeItem("domain-config-data");
        localStorage.removeItem("temp-requisition-products");
        localStorage.removeItem("temp-sales-products");
        localStorage.removeItem("temp-purchase-products");
        localStorage.removeItem("order-process");
        localStorage.removeItem("core-customers");
        localStorage.removeItem("core-users");
        localStorage.removeItem("hospital-config");
        localStorage.removeItem("hospital-user");
        localStorage.removeItem("particularMode");
        localStorage.removeItem("core-products");
        localStorage.removeItem("core-vendors");
        localStorage.removeItem("i18nextLng");
        localStorage.removeItem("demo");

        // Remove other localStorage items as needed
        setUser(null);
        setConfigData(null);
    };

    const updateConfigData = (newConfigData) => {
        try {
            localStorage.setItem("config-data", JSON.stringify(newConfigData));
            setConfigData(newConfigData);
        } catch (error) {
            console.error("Error updating config data:", error);
        }
    };

    const value = {
        user,
        configData,
        isLoading,
        login,
        logout,
        updateConfigData
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};