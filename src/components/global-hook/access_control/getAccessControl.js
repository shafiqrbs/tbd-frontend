import {useEffect, useState} from "react";



const getAccessControl = () => {
    const userRoleData = localStorage.getItem("user");
    if (!userRoleData) return [];
    try {
        const parsedUser = JSON.parse(userRoleData);

        if (!parsedUser.access_control_role) return [];

        if (Array.isArray(parsedUser.access_control_role)) {
            return parsedUser.access_control_role;
        }

        if (typeof parsedUser.access_control_role === 'string') {
            try {

                if (parsedUser.access_control_role.trim() === '') return [];
                return JSON.parse(parsedUser.access_control_role);
            } catch (parseError) {
                console.error("Error parsing access_control_role:", parseError);
                return [];
            }
        }

        return [];
    } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        return [];
    }
};

export default getAccessControl;
