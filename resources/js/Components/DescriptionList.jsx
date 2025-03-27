import React, { useEffect, useState } from "react";

const DescriptionList = ({ data, metadata }) => {
  const [mapped, setMapped] = useState(data);

  if (!data || typeof data !== "object") {
    return <p className="text-red-500">Invalid data provided</p>;
  }
  const mapTo = {
    discipline_id: {
      name: 'disciplines',
      key: 'id'
    },
    revision_id: {
      name: 'revisions',
      key: 'id'
    },
    area_id: {
      name: 'areas',
      key: 'id'
    },
    document_status_id: {
      name: 'document_statuses',
      key: 'id'
    },
    area_id: {
      name: 'areas',
      key: 'id'
    },
    type_id: {
      name: 'types',
      key: 'id'
    }
  };

  useEffect(() => {
    const updatedData = { ...data }; // Make a copy of data to ensure immutability
  
    // Iterate over the entries of data
    Object.entries(updatedData)?.map(([key, value]) => {
      if (mapTo[key]) {
        const dict = mapTo[key];
        const categoryName = dict.name;
        const keyName = dict.key;
  
        // Find the matching item in the metadata for that category
        const matchedItem = metadata[categoryName]?.find(x => x[keyName] === value);
  
        // Update the value with the name from metadata if found, otherwise keep the original value
        updatedData[key] = matchedItem ? matchedItem : value;
      }
    });
  
    // Optionally set the updated data to a state or perform further actions
    setMapped(updatedData);
  }, [])

  return (
    <dl className="grid grid-cols-1 text-sm sm:grid-cols-2 gap-x-6 gap-y-4">
      {Object.entries(mapped).map(([key, value]) => (
         <div key={key}>
          <dt className="font-bold text-gray-900 capitalize">{key.replace('_id', '').replace('_', ' ')}</dt>
          <dd className="text-gray-600">{String(value?.name || value)}</dd>
        </div>
      ))}
    </dl>
  );
};

export default DescriptionList;
