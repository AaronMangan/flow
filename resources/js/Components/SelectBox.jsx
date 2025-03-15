import React from 'react';
import Select from 'react-select';

export default function SelectBox({ options, defaultValue, selected, onChange, className, isMulti = false, placement = 'auto', placeholder = 'Please select' }) {
  return (
    <Select
      isMulti={isMulti}
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      value={selected}
      menuPlacement={placement}
      menuPortalTarget={document.body}
      defaultValue={defaultValue}
      className={'z-99 rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-gray-600 dark:focus:ring-teal-600'}
    />
  );
};
