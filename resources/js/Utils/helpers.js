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
export const removeKeys = (obj, keysToRemove) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
    );
}