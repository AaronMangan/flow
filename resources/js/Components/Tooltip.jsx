// Tooltip.js
import React, { useState } from 'react';

export default function Tooltip ({ text, children }) {
    const [visible, setVisible] = useState(false);

    const handleMouseEnter = () => {
        setVisible(true);
    };

    const handleMouseLeave = () => {
        setVisible(false);
    };

    return (
        <div 
            className="tooltip-container" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative', display: 'inline-block' }}
        >
            {children}
            {visible && (
                <div 
                    className="tooltip" 
                    style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#333',
                        color: '#fff',
                        padding: '8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        zIndex: 1100,
                        maxWidth: '1000px',
                        minWidth: '250px'
                    }}
                >
                    {text}
                </div>
            )}
        </div>
    );
};
