import { toast } from 'react-toastify';

export const truncateText = (text, maxLength = 50) => {
    if (text == null || typeof text == 'undefined' || text == '') {
        return '';
    }
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// Format a date using Intl API
export const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(dateString));
};

// Debounce function (for search inputs)
export const debounce = (func, delay = 300) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};


/**
 * Removes key from object, typically for display. Used primarily for activity log because the updated at and by keys are not required to be displayed.
 * @param {any} object
 * @param {any} keys
 * @returns {any}
 */
// export const removeKeys = (obj, keysToRemove) => {
//     try {
//         if (typeof t !== "string") {
//             obj = JSON.stringify(obj); // Convert objects or arrays to a string first
//         }
//         // Try parsing once
//         const parsedOnce = JSON.parse(obj);

//         // If it's still a string, it was double-encoded
//         if (typeof parsedOnce === "string") {
//             return JSON.parse(parsedOnce); // Parse again to fix it
//         }

//         return parsedOnce; // It was correctly encoded, return as is
//     } catch (error) {
//         return obj; // Not a valid JSON string, return as is
//     }
// }
export const removeKeys = (obj, keysToRemove) => {
    try {
        // Convert to a JSON string before parsing
        let jsonString = JSON.stringify(filteredObj);

        // Try parsing once
        const parsedOnce = JSON.parse(jsonString);

        // If it's still a string, it was double-encoded
        if (typeof parsedOnce === "string") {
            return JSON.parse(parsedOnce); // Parse again to fix it
        }

        return parsedOnce; // It was correctly encoded, return as is
    } catch (error) {
        return obj; // If it's not valid JSON, return the original object
    }
}


/**
 * Display toast notifications. These are usually received from the backend in a response.
 * @param {object} messages An object, with toast notifications to be displayed and arranged by keys which become types. If the type is not valid, it defaults to info.
 * @returns {void}
 */
export const processMessages = (messages) => {    
    // These form the keys that we look for in the messages array/object. They also correspond with the toast types.
    const messageTypes = ['info', 'success', 'warning', 'error'];

    // Make sure there are messages to display.
    if (!messages || messages?.length <= 0 || typeof messages !== 'object') {
        return;
    }

    /**
     * Iterate over the messages object and display any messages. Each key (success, etc) can either be a string or an array with multiple entries. Multiple entries will show multiple messages of the same type.
     * @param {string} type The type of message, corresponding to the messageTypes array.
     * @returns {any}
     */
    Object.entries(messages || {}).forEach(([key, value]) => {
        // Convert everything to an array.
        const msgs = (value instanceof Array) ? value : [value]
        // After converting everything into an array, filter out any null or empty values.
        msgs.filter(m => m !== null || m !== '' || typeof m === 'string').forEach(msg => {
            if (messageTypes.includes(key)) {
                toast[key](msg);
            } else {
                toast.info(msg); // Default behavior for unknown keys
            }
        })
    });
}