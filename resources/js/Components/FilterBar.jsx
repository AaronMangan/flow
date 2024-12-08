import React, { useEffect, useState } from 'react';

export default function FilterBar({ className, config, valuesCallback, values, ...props }) {
  const [apiData, setApiData] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({})

  useEffect(() => {
    config && config.map((item) => {
        makeApisCallForData(item);
    });
  }, [config]);
  
  // Set a default state for the filters.
  useEffect(() => {
    let x = selectedFilters;
    config && config.map((item) => {
        x[item.id] = values[item.id] || item.default || ''
    });
    setSelectedFilters(x)
  }, []);

  useEffect(() => {
    setTimeout(() => {
        valuesCallback(selectedFilters);
    }, 500);
  }, [selectedFilters])
  /**
   * 
   */
  const makeApisCallForData = (filterObj) => {
    if(filterObj?.endpoint) {
        axios.get(filterObj.endpoint).then(response => {
            if (response?.data?.status && response?.data?.status == 'success') {
                const api = response?.data?.data.map(item => {
                    return item;
                })
                setApiData({...apiData, [filterObj.id]: api});
            }
        })
    };
  };

  const renderInput = (obj) => {
    switch (obj.type) {
        case 'select':
          return (
            <div key={obj.id} className="flex items-center px-2 space-x-2">
              <label htmlFor={obj.label} className="text-sm font-bold text-gray-600">{obj.label}</label>
              <select
                id={obj.id}
                value={selectedFilters[obj.id]}
                onChange={(e) => {
                  setSelectedFilters({...selectedFilters, [obj.id]: e.target.value || ''})
                }}
                className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ` + obj.className}
              >
                <option key='all' value="all">All</option>
                
                {/* Dynamically populate the options. */}
                {apiData && (
                  apiData[obj.id]?.map(x => {
                    return <option key={x.value} value={x.value}>{x.label}</option>;
                  })
                )}
              </select>
            </div>
          );
        case 'text':
          return (
            <div key={obj.id} className="flex items-center px-2 space-x-2">
              <label htmlFor={obj.label} className="text-sm font-bold text-gray-600">{obj.label}</label>
              <input
                type="text"
                id={obj.id}
                placeholder={obj.placeholder || null}
                name={obj?.name || obj.id}
                value={selectedFilters[obj.id] || ''}
                className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ` + obj.className}
                onChange={(e) => {
                  setSelectedFilters({...selectedFilters, [obj.id]: e.target.value || ''});
                }}
              />
            </div>
          );
        case 'date':
          return (
            <div key={obj.id} className="flex items-center px-2 space-x-2">
              <label htmlFor={obj.label} className="text-sm font-bold text-gray-600">{obj.label}</label>
              <input
                type="text"
                id={obj.id}
                placeholder={obj.placeholder || null}
                name={obj?.name || obj.id}
                className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ` + obj.className}
                onChange={(e) => {
                  setSelectedFilters({...selectedFilters, [obj.id]: e.target.value || ''})
                }}
              />
            </div>
          );
        case 'checkbox':
          return (
            <div key={obj.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={obj.id}
                checked={selectedFilters[obj.id] || false}
                onChange={(e) => {
                  setSelectedFilters({...selectedFilters, [obj.id]: e.target.checked || false})
                }}
                className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor={obj.id} className="text-sm font-medium text-gray-600">{obj.label}</label>
            </div>
          );
        default:
          break;
    }
  }

  return (
    <div className={`w-full flex flex-wrap items-center p-4 bg-white mr-auto rounded-lg shadow-md ` + className}>
      {config && config.map((c) => renderInput(c))}
    </div>
  );
};

/*
These are the possible options for the filter bar
const filterOptions = [
  {
      id: 'model',
      type: 'select',
      label: 'Model',
      endpoint: '/api/filters/models',
      className: 'w-[200px]'
  },
  {
      id: 'search',
      type: 'text',
      label: 'Search',
      className: 'w-[300px]',
      placeholder: 'Enter search'
  },
  {
      id: 'date',
      type: 'date',
      label: 'Date',
      className: 'w-[200px]',
      placeholder: 'dd/mm/yyyy'
  },
  {
      id: 'checkbox',
      type: 'checkbox',
      label: 'Hide Inactive',
      className: 'w-[200px]',
      placeholder: null
  }
];
*/