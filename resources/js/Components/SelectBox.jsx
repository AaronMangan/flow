import React from 'react';
import Select from 'react-select';

export default function SelectBox({ options, defaultValue, selected, onChange, className, placement = 'auto', placeholder = 'Please select' }) {
  return (
    <Select
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      value={selected}
      menuPlacement={placement}
      defaultValue={defaultValue}
      className={
        'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 ' +
        className
      }
    />
  );
};
