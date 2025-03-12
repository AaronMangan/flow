import React, { useEffect, useState } from 'react';
import InputError from './InputError';

export default function FormGenerator({ className, config, valuesCallback, values, errors, ...props }) {
  const [formData, setFormData] = useState({})
  
  // Set a default state for the form, or if there are values (e.g. editing a resource then populate those)
  useEffect(() => {
    let formValues = formData || null;
    formData && config && config.map((item) => {
        if(item.type == 'checkbox') {
          formValues[item.id] = values[item.id] || item.default || false
        } else {
          formValues[item.id] = values[item.id] || item.default || ''
        }
    });
    setFormData(formValues)
  }, []);

  useEffect(() => {
    setTimeout(() => {
        valuesCallback(formData);
    }, 500);
  }, [formData])

  const renderInput = (obj, index) => {
    switch (obj.type) {
        case 'select':
            console.log(obj.data)
          return (
            <div key={obj.id + '-parent'} className={obj.parentClassName}>
              <label key={obj.id + '_label'} htmlFor={obj.label} className="text-sm font-bold text-gray-600">{obj.label}</label>
              <select
                key={obj.id + '_' + index}
                id={obj.id}
                value={formData[obj.id]}
                onChange={(e) => {
                  setFormData({...formData, [obj.id]: e.target.value || ''})
                }}
                className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ` + obj.className}
              >
                <option key={'all_' + obj.id} value="all">All</option>
                
                {/* Dynamically populate the options. */}
                {/* {obj.data && (
                  obj.data?.forEach(x => {
                    return <option key={obj.id + '_' + x.value} value={x.value}>{x.label}</option>;
                  })
                )} */}
              </select>
            </div>
          );
        case 'text':
          return (
            <div key={obj.id} className={obj.parentClassName}>
              <label htmlFor={obj.label} className="pl-2 text-sm font-bold text-gray-600">{obj.label}</label>
              <input
                type="text"
                id={obj.id}
                placeholder={obj.placeholder || null}
                name={obj?.name || obj.id}
                value={formData[obj.id] || ''}
                className={`border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ` + obj.className}
                onChange={(e) => {
                  setFormData({...formData, [obj.id]: e.target.value || ''});
                }}
              />
              <InputError className="px-2" message={errors[obj.id]} />
            </div>
          );
        case 'label':
          return (
            <div key={obj.id} className={obj.parentClassName}>
              <label htmlFor={obj.label} className="pl-2 text-sm font-bold text-gray-600">{obj.label}</label>
              <span>{obj.value || ''}</span>
              <InputError className="px-2" message={errors[obj.id]} />
            </div>
          );
        case 'textarea':
          return (
            <div key={obj.id} className="w-full pt-1 pr-4">
              <label htmlFor={obj.label} className="pl-2 text-sm font-bold text-gray-600">{obj.label}</label>
              <textarea
                id={obj.id}
                name={obj.name}
                placeholder={obj.placeholder || null}
                className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ` + obj.className}
                onChange={(e) => {
                    setFormData({...formData, [obj.id]: e.target.value || ''});
                }}
                rows={obj.rows || 3}
                value={formData[obj.id] || ''}
              ></textarea>
              <InputError className="px-2" message={errors[obj.id]} />
            </div>
          );
        case 'date':
          return (
            <div key={obj.id} className="w-full pt-1 pr-4">
              <label htmlFor={obj.label} className="pl-1 text-sm font-bold text-gray-600">{obj.label}</label>
              <input
                type="text"
                id={obj.id}
                placeholder={obj.placeholder || null}
                name={obj?.name || obj.id}
                className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ` + obj.className}
                onChange={(e) => {
                  setFormData({...formData, [obj.id]: e.target.value || ''})
                }}
                checked={formData[obj.id] || false}
              />
              <InputError className="px-2" message={errors[obj.id]} />
            </div>
          );
        case 'checkbox':
          return (
            <div key={obj.id} className="w-full pt-1 pr-4">
              <input
                type="checkbox"
                id={obj.id}
                checked={formData[obj.id] || false}
                onChange={(e) => {
                  setFormData({...formData, [obj.id]: e.target.checked || false})
                }}
                className={`w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-500` + obj.className}
              />
              <label htmlFor={obj.id} className="text-sm font-medium text-gray-600">{obj.label}</label>
              <InputError className="px-2" message={errors[obj.id]} />
            </div>
          );
        default:
          break;
    }
  }

  return (
    <div className={className}>
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
    id: 'notes',
    type: 'textarea',
    label: 'notes',
    className: '',
    placeholder: 'Enter Notes'
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