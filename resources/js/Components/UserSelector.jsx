import Select from 'react-select';
import { useEffect, useRef, useState } from "react";
import { TrashIcon, PlusIcon, CubeTransparentIcon, EyeIcon } from "@heroicons/react/24/solid";
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";
import Modal from "./Modal";
import TextInput from "./TextInput";
import axios from "axios";
import { toast } from "react-toastify";
import TableView from "./TableView";
import Checkbox from "./Checkbox";
import PrimaryButton from "./PrimaryButton";

export default function UserSelector({ value, className = '', children, options, onChange, ...props }) {
    const [userOptions, setUserOptions] = useState(options || []);
    const [selectedValues, setSelectedValues] = useState([]);
    
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
    }, []);

    {/* Return the component */}
    return (
        <div className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ` + className}>
            <Select
                {...props}
                options={userOptions}
                value={selectedValues}
                isMulti
                placeholder="Select users or add emails..."
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                isClearable
                className="w-full"
            />
        </div>
    );
}
