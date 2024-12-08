import React from 'react';

export default function DataView ({ data }) {
  const renderItem = (key, value) => {
    console.log(`key: ${key} is ` + typeof key + ` value: ${value} is ` + typeof value);
    try {
      if (typeof value === 'object' && value !== null) {
        // If value is an object (nested JSON), recursively render it
        return (
          <div style={{ marginLeft: '20px' }}>
            <strong>{key}:</strong>
            <DataView data={value} />
          </div>
        );
      } else if (Array.isArray(value)) {
        // If value is an array, loop through it
        return (
          <div style={{ marginLeft: '20px' }}>
            <strong>{key}:</strong>
            <ul>
              {value.map((item, index) => (
                <li key={index}>{renderItem(index, item)}</li>
              ))}
            </ul>
          </div>
        );
      } else {
        // If it's a primitive type (string, number, etc.), just display the value
        return (
          <div style={{ marginLeft: '20px' }}>
            <strong>{key}:</strong> {value}
          </div>
        );
      }
    }
    catch (error) {
        return <p>Sorry, the object data was not able to be parsed.</p>
    }
  };

  return (
    <div>
      <ul>
        {Object.entries(data).map(([key, value]) => (
          <li key={key}>{renderItem(key, value)}</li>
        ))}
      </ul>
    </div>
  );
};
