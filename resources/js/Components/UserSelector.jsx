import Select from 'react-select';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function UserSelector({ value, className = '', children, options, onChange, ...props }) {
    const [userOptions, setUserOptions] = useState(options || []);
    const [selectedValues, setSelectedValues] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    const darkStyles = {
        control: (base) => ({
          ...base,
          backgroundColor: "#1E1E2E", // Dark background
          borderColor: "#4A4A4A", // Darker border
          color: "#E4E4E4", // Light text
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "#2E2E3E", // Dropdown menu background
        }),
        singleValue: (base) => ({
          ...base,
          color: "#E4E4E4", // Selected item color
        }),
        option: (base, { isFocused, isSelected }) => ({
          ...base,
          backgroundColor: isSelected ? "#4A4A4A" : isFocused ? "#3A3A4A" : "#2E2E3E",
          color: "#FFFFFF",
        }),
        placeholder: (base) => ({
          ...base,
          color: "#B0B0B0", // Placeholder text color
        }),
    };
      
    const lightStyles = {
        control: (base) => ({
            ...base,
            backgroundColor: "#FFFFFF",
            borderColor: "#CCCCCC",
            color: "#000000",
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: "#FFFFFF",
        }),
        singleValue: (base) => ({
            ...base,
            color: "#000000",
        }),
        option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected ? "#DDD" : isFocused ? "#EEE" : "#FFF",
            color: "#000",
        }),
        placeholder: (base) => ({
            ...base,
            color: "#777",
        }),
    };
    
    // Email validation function
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleChange = (selected) => {
        setSelectedValues(selected);
        onChange(selected);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === "Tab") {
            event.preventDefault();
            const inputValue = event.target.value.trim();
            
            if (inputValue && validateEmail(inputValue)) {
                const newOption = { value: inputValue, label: inputValue, type: "email" };
                setSelectedValues([...selectedValues, newOption]);
                onChange([...selectedValues, newOption]);
            } else {
                toast.error("Invalid email format.");
            }
            event.target.value = ""; // Clear input
        }
    };

    useEffect(() => {
        axios.get(route('api.user-select')).then(res => {
            const options = res?.data?.data?.map((user) => ({
                value: user?.id,
                label: user?.name,
                type: "user" // To differentiate from custom emails
            }));
            setUserOptions(options);
        }).catch(ex => {
            toast.error('An error occurred getting list of selectable users, please contact your administrator for assistance');
        })
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e) => setIsDarkMode(e.matches);
    
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    {/* Return the component */}
    return (
        <div className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ` + className}>
            <Select
                {...props}
                options={userOptions}
                value={selectedValues}
                isMulti
                placeholder="Select users or add emails..."
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                isClearable
                styles={isDarkMode ? darkStyles : lightStyles}
                className="w-full dark:text-gray-200"
            />
        </div>
    );
}
