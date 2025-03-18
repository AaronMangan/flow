import Select from 'react-select';
import React, { useEffect, useState } from "react";

export default function SelectBox({ options, defaultValue, selected, onChange, className, isMulti = false, placement = 'auto', placeholder = 'Please select' }) {
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
  
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <Select
      isMulti={isMulti}
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      value={selected}
      styles={isDarkMode ? darkStyles : lightStyles}
      menuPlacement={placement}
      menuPortalTarget={document.body}
      defaultValue={defaultValue}
      className={'z-99 rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-gray-600 dark:focus:ring-teal-600'}
    />
  );
};
