// Notification.js
import React, { useState } from 'react';
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const Notification = ({ type = 'success', message, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    // Notification types and their respective colors
    const notificationStyles = {
        success: 'bg-green-100 border-l-4 border-green-500 text-green-700',
        error: 'bg-red-100 border-l-4 border-red-500 text-red-700',
        info: 'bg-blue-100 border-l-4 border-blue-500 text-blue-700',
        warning: 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700',
    };

    const closeNotification = () => {
        setIsVisible(false);
        if (onClose) {
            onClose(); // Call the onClose callback if passed
        }
    };

    if (!isVisible) return null; // Do not render if the notification is not visible

    return (
        <div
            className={`flex items-center p-4 mb-4 rounded-lg shadow-md ${notificationStyles[type]}`}
            role="alert"
        >
            <div className="flex-shrink-0">
                {type === 'info' && (
                    <InformationCircleIcon className='w-7 h-7'/>
                )}
                {type === 'success' && (
                    <CheckCircleIcon className='w-7 h-7'/>
                )}
                {type === 'warning' && (
                    <ExclamationTriangleIcon className='w-7 h-7'/>
                )}
                {type === 'danger' && (
                    <ExclamationTriangleIcon className='w-7 h-7'/>
                )}
            </div>
            <div className="ml-3">
                <p className="text-sm font-medium">{message}</p>
            </div>
            <button
                onClick={closeNotification}
                className="ml-auto text-gray-500 hover:text-gray-700 focus:outline-none"
            >
                <span className="sr-only">Close</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Notification;
