/**
 * [FORM GENERATOR]
 * 
 * Generates a form using a JSON object.
 * Properties:
 * @property {className} string The class of the parent container for the form object.
 * @property {config} object JSON config object, see the end of file for example.
 * @property {valuesCallback} callback Called when the values update.
 * @property {values} object Any current or default values for the form object.
 * @property {errors} object Provided by the parent component, any errors to be displayed in the form.
 * @property {...props} mixed Any other properties to be included in the form.
 * @author Aaron Mangan
 * @version 2.0
 */

import { useRef, useState, useEffect } from 'react';
import SelectBox from '../SelectBox';
import InputError from '../InputError';
import TextInput from '../TextInput';
import LoadingSpinner from '../LoadingSpinner';
import PrimaryButton from '../PrimaryButton';
import DangerButton from '../DangerButton';
import ButtonList from '../ButtonList';
import UserSelector from '../UserSelector';

export default function FormGen({ className, config, valuesCallback, values, errors, reset, ...props }){
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(values);
  
  const getSelectedItem = (options, id) => {
    return options.filter(x => x?.value === id)[0];
  }

  /**
   * Render the JSON config into a form.
   * @param {*} obj The config object (JSON)
   * @param {*} index Current index when iterating through the config object. Used to provide unique keys.
   * @returns A form that is injected.
   */
  const renderInput = (obj, index) => {
    switch (obj.type) {
      case 'select':
        return (
          <div key={obj.id + '-parent'} className={obj.parentClassName}>
            <label key={obj.id + '_label'} htmlFor={obj.label} className="text-sm font-bold text-gray-600">{obj.label}</label>
            <SelectBox
              key={obj.id + '_' + index}
              id={obj.id}
              value={formData[obj.id]}
              selected={getSelectedItem(obj.data, formData[obj.id])}
              onChange={(e) => {
                setFormData({...formData, [obj.id]: e.value || ''})
              }}
              isMulti={false}
              options={obj.data || []}
              placeholder={obj.placeholder || 'Please select an option'}
              className={obj.className}
            />
            {errors[obj?.id] && <p className="text-sm text-red-500">{errors[obj?.id]}</p>}
          </div>
          
        );
      case 'multiselect':
        return (
          <div key={obj.id + '-parent'} className={obj.parentClassName}>
            <label key={obj.id + '_label'} htmlFor={obj.label} className="text-sm font-bold text-gray-600">{obj.label}</label>
            <SelectBox
              isMulti={true}
              name={obj.id}
              options={obj.data || []}
              value={formData[obj.id]}
              onChange={(e) => {
                setFormData({...formData})
              }}
              className={'react-select-container ' + obj.className}
              classNamePrefix='react-select'
            />
            <InputError className="px-2" message={errors[obj.id]} />
          </div>
        );
        case 'text':
          return (
            <div key={obj.id} className={obj.parentClassName}>
              <label key={obj.id + '_label'} htmlFor={obj.label} className="text-sm font-bold text-gray-600">{obj.label}</label>
              <TextInput
                type="text"
                id={obj.id}
                placeholder={obj.placeholder || null}
                name={obj?.name || obj.id}
                value={formData[obj.id] || ''}
                className={`border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ` + obj.className}
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
              <label key={obj.id + '_label'} htmlFor={obj.label} className="text-sm font-bold text-gray-600">{obj.label}</label>
              <span>: {formData[obj.id] || obj.value || ''}</span>
              <InputError className="px-2" message={errors[obj.id]} />
            </div>
          );
        case 'textarea':
          return (
            <div key={obj.id} className={obj.parentClassName}>
              <label key={obj.id + '_label'} htmlFor={obj.label} className="text-sm font-bold text-gray-600">{obj.label}</label>
              <textarea
                id={obj.id}
                name={obj.name}
                placeholder={obj.placeholder || null}
                className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ` + obj.className}
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
              <label key={obj.id + '_label'} htmlFor={obj.label} className="text-sm font-bold text-gray-600">{obj.label}</label>
              <input
                type="text"
                id={obj.id}
                placeholder={obj.placeholder || null}
                name={obj?.name || obj.id}
                className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ` + obj.className}
                onChange={(e) => {
                  setFormData({...formData, [obj.id]: e.target.value || ''})
                }}
                checked={formData[obj.id] || false}
              />
              <InputError className="px-2" message={errors[obj.id]} />
            </div>
          );
        case 'button_list':
          return (
            <div key={obj.id} className={obj.parentClassName}>
              <label key={obj.id + '_label'} htmlFor={obj.label} className="text-sm font-bold text-gray-600">{obj.label}</label>
              <ButtonList
                id={obj.id}
                name={obj.name}
                placeholder={obj.placeholder || null}
                className={`py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ` + obj.className}
                rows={obj.rows || 3}
                value={formData[obj.id] || []}
                valuesCallback={(updatedValues) => {
                  setFormData((prev) => ({
                      ...prev,
                      [obj.id]: updatedValues[obj.id] // Ensure documents persist
                  }));
                }}
              />
              <InputError className="px-2" message={errors[obj.id]} />
            </div>
          );
        case 'user_list':
          return (
            <div key={obj.id} className={obj.parentClassName}>
              <label key={obj.id + '_label'} htmlFor={obj.label} className="text-sm font-bold text-gray-600">{obj.label}</label>
              <UserSelector
                value={formData[obj.id] || []}
                className={`py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ` + obj.className}
                onChange={(updatedValues) => {
                  setFormData((prev) => ({
                    ...prev,
                    [obj.id]: updatedValues // Ensure documents persist
                  }));
                }}                
              />
              <InputError className="px-2" message={errors[obj.id]} />
            </div>
          );
        case 'checkbox':
          return (
            <div key={obj.id + '_' + obj.type} className="flex items-center justify-start">
              <label key={obj.id + '_label'} htmlFor={obj.label} className="pr-3 text-sm font-bold text-gray-600">{obj.label}</label>
              <label htmlFor="switch" className="flex items-center cursor-pointer">
                <div className="relative">
                  {/* Background */}
                  <input
                    id="switch"
                    type="checkbox"
                    value={formData[obj.id] || false}
                    checked={formData[obj.id] || false}
                    onChange={(e) => {
                      setFormData({...formData, [obj.id]: e.target.checked || ''})
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-12 h-6 rounded-full ${formData[obj.id] ? 'bg-teal-500' : 'bg-gray-300'} transition-colors`}
                  ></div>
                  {/* Knob */}
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      formData[obj.id] ? 'transform translate-x-6' : ''
                    }`}
                  ></div>
                </div>
                <span className="ml-3 text-xs font-medium text-gray-700">{formData[obj.id] ? 'On' : 'Off'}</span>
              </label>
              <InputError className="px-2" message={errors[obj.id]} />
            </div>
          );
        default:
          break;
    }
  }

  /**
   * Once rendered, perform any logic here.
   */
  useEffect(() => {
    // Set loading to false as the page has rendered.
    setLoading(false);
  }, [])

  useEffect(() => {
    valuesCallback(formData)
  }, [formData])

  return (
    <div className={className}>
      {/* Once the page has loaded, the form can be rendered. */}
      {!loading && config && (
        <>
          {/* Start with the title block */}
          <div className="py-2 mt-2 font-bold text-gray-900 dark:text-gray-100">
            <h2 className={config.titleClass || ''}>{config.title}</h2>
          </div>

          {/* Then, the contents block */}
          {config?.contents?.map((c) => renderInput(c))}

          {/* Finally, any buttons */}
          <div className="inline-flex justify-between w-full col-span-2 py-3 pb-4 text-gray-900 dark:text-gray-100">
            {config?.buttons?.map((buttonObj) => {
              switch (buttonObj?.type) {
              case 'primary':
                  return (
                    <PrimaryButton
                      key={buttonObj.id}
                      id={buttonObj.id}
                      onClick={() => buttonObj.onClick()}
                      className={buttonObj.className}
                    >{buttonObj.label}</PrimaryButton>
                  );
              case 'danger':
                return (
                  <DangerButton
                    key={buttonObj.id}
                    id={buttonObj.id}
                    onClick={() => {}}
                    className={buttonObj.className}
                  >{buttonObj.label}</DangerButton>
                );
              default:
                return null; // or some default button if needed
              }
            })}
          </div>
        </>)
      }

      {/* If the form is loading, show the loading spinner */}
      {loading && (
        <div className='flex justify-center col-span-2 w-100 align-center'>
          <LoadingSpinner
            text='Hold on! We are loading your form!'
          />
        </div>
      )}
    </div>
  );
}