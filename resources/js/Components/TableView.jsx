import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";

export default function TableView ({ columns, data, className, customStyles = {}, ...props }) {
    const [isDarkMode, setIsDarkMode] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
        // Listener to detect changes in system theme
        const handleChange = (e) => setIsDarkMode(e.matches);
    
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);
    
    // Define your custom dark theme
    createTheme("customDark", {
        text: {
            primary: "#E4E4E4", // Light text color
            secondary: "#B0B0B0", // Muted text color
        },
        background: {
            default: "#1E1E2E", // Dark background color
        },
        context: {
            background: "#2E2E3E", // Context menu background
            text: "#FFFFFF",
        },
        divider: {
            default: "#4A4A4A", // Divider color
        },
        action: {
            button: "rgba(255,255,255,0.54)", // Button color
            hover: "rgba(255,255,255,0.08)", // Button hover effect
            disabled: "rgba(255,255,255,0.12)", // Disabled button color
        },
    });

    return (
        <div {...props} className={`z-0 py-2 sm:rounded-lg text-gray-900 dark:text-gray-100 dark:bg-gray-900 ` + className}>
            <DataTable
                columns={columns}
                data={data}
                className='z-0'
                customStyles={customStyles}
                theme={isDarkMode ? "customDark" : "default"}
            />
        </div>
    );
}