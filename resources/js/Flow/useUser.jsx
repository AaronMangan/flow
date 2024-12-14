// src/hooks/useUser.js
import { useState, useEffect } from 'react';

// Custom hook to check if the user has a certain role
export const useUser = (user) => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        if (user) {
            setRoles(user.roles || []);
        }
    }, [user]);

    const userHasRole = (name) => {
        return roles.map((role) => role.name).includes(name);
    };

    return { userHasRole };
};
