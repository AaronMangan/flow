import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import FormGen from '@/Components/FormGenerator/FormGen';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function DocumentCreateOrEdit ({ document, messages }) {
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: document?.name || null,
        document_number: document?.document_number || null,
        type_id: document?.type_id || null,
        discipline_id: document?.discipline_id || null,
        area_id: document?.area_id || null,
        revision_id: document?.revision_id || null,
        status_id: document?.document_status_id || null,
        is_placeholder: document?.is_placeholder || false,
        description: document?.description || null
    });
    const [disciplines, setDisciplines] = useState([]);
    const [types, setTypes] = useState([]);
    const [areas, setAreas] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [revisions, setRevisions] = useState([]);
    const [tags, setTags] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);

    /**
     * Update the form data with the data from the form generator
     * @param {object} values 
     */
    const updateFormData = (values) => {
      setData(values);
    }

    const resetForm = () => {
      reset();
      setData({});
    }

    /**
     * Make an API call to get disciplines.
     */
    const getDisciplines = () => {
      axios.get(route('api.disciplines'))
        .then(response => {
          const disciplines = response?.data?.data?.map(disc => ({
            value: disc.id, 
            label: disc.name || 'Unnamed',  // Handle cases where name might be null
            code: disc.code || null
          }));
          setDisciplines(disciplines);  // Update state with the disciplines
        })
        .catch(error => {
          console.error('Error fetching disciplines:', error); // Error handling
        });
    };

    /**
     * Make an API call to get types.
     */
    const getTypes = () => {
      axios.get(route('api.types')).then(response => {
        const typeOption = response?.data?.data?.map((type, index) => ({
          value: type?.id || index,
          label: type?.name || null,
          code: type?.code || null
        }));
        setTypes(typeOption);
      })
    }

    /**
     * Make an API call to get areas.
     */
    const getAreas = () => {
      axios.get(route('api.areas')).then(response => {
        const areaOption = response?.data?.data?.map((area, index) => ({
          value: area?.id || index,
          label: area?.name || null,
          code: area?.code || null
        }));
        setAreas(areaOption);
      })
    }

    /**
     * Make an API call to get statuses
     */
    const getStatuses = () => {
      axios.get(route('api.statuses')).then(response => {
        const statusOption = response?.data?.data?.map((status, index) => ({
          value: status?.id || index,
          label: status?.name || null,
          code: status?.code || null
        }));
        setStatuses(statusOption);
      })
    }

    /**
     * Make an API call to get revisions
     */
    const getRevisions = () => {
      axios.get(route('api.revisions')).then(response => {
        const revOption = response?.data?.data?.map((rev, index) => ({
          value: rev?.id || index,
          label: rev?.code || rev?.name || null,
          code: rev?.code || null
        }));
        setRevisions(revOption);
      })
    }

    /**
     * Make an api call to get tags.
     */
    const getTags = () => {
      axios.get(route('api.tags')).then(response => {
        const tagOption = response?.data?.data?.map((tag, index) => ({
          value: tag?.id || index,
          label: tag?.name || null
        }));
        setTags(tagOption);
      })
    }

    const submitForm = () => {
      if (!document || !document?.id) {
        post(route('document.create'), {
          onSuccess: (req) => {}
        });
      } else {
        post(route('document.update', document?.id), {
          onSuccess: (req) => {
            toast.success('Document updated successfully');
          }
        })
      }
    }

    const formObj = {
      id: isEditMode ? 'edit_document_form' : 'create_document_form',
      title: isEditMode ? 'Edit Document' : 'Create New Document',
      titleClass: 'text-gray-600 text-xl',
      contents: [  
        {
          id: 'document_number',
          type: 'label',
          label: 'Document Number',
          className: 'w-full',
          parentClassName: 'col-span-2 pr-2 w-full',
          placeholder: '',
          readonly: true,
          value: '',
        },
        {
          id: 'name',
          type: 'text',
          label: 'Title',
          className: 'w-full',
          parentClassName: 'col-span-2 pr-2 w-full',
          placeholder: 'Document Title'
        },
        {
          id: 'area_id',
          type: 'select',
          label: 'Area',
          className: 'w-full pr-2',
          data: areas || [],
          placeholder: 'Select an area...'
        },
        {
          id: 'discipline_id',
          type: 'select',
          label: 'Discipline',
          className: 'w-full pr-2',
          data: disciplines || [],
          placeholder: 'Please select a discipline...'
        },
        {
          id: 'type_id',
          type: 'select',
          label: 'Type',
          className: 'w-full pr-2',
          data: types || [],
          placeholder: 'Please select a type...'
        },
        {
          id: 'status_id',
          type: 'select',
          label: 'Status',
          className: 'w-full pr-2',
          data: statuses || [],
          placeholder: 'Please select a status...'
        },
        {
          id: 'revision_id',
          type: 'select',
          label: 'Revision',
          className: 'w-full pr-2',
          data: revisions || [],
          placeholder: 'Please select a revision...'
        },
        {
          id: 'is_placeholder',
          type: 'switch',
          label: 'Placeholder',
          className: 'w-[200px]',
          placeholder: null
        },
        {
          id: 'tags',
          type: 'multiselect',
          label: 'Tags',
          parentClassName: 'w-full col-span-2',
          className: 'w-full col-span-2',
          data: tags || [],
          placeholder: 'Please select tags...'
        },
        {
          id: 'description',
          type: 'textarea',
          label: 'Description / Notes',
          parentClassName: 'col-span-2 w-full',
          className: 'w-full',
          placeholder: 'Enter extra information here...'
        }
      ],
      // Buttons for the form!
      buttons: [
        {
          id: 'clear_button',
          label: 'Clear',
          onClick: () => {
            // 
          },
          type: 'danger'
        },
        {
          id: 'save_button',
          label: 'Save',
          onClick: (e) => submitForm(),
          type: 'primary'
        },
      ]
    };

    useEffect(() => {
      getDisciplines();  // Fetch disciplines when the component mounts
      getTypes();
      getAreas();
      getStatuses();
      getRevisions();
      getTags();
      setIsEditMode((document && document?.id) ? true : false);
      console.log(data)
    }, []);

    useEffect(() => {
        // 
    }, [reset]);

    useEffect(() => {
      if(messages && messages.success) {
        toast.success(messages.success)
      }
      if(messages && messages.warning) {
        toast.warning(messages.warning)
      }
      if(messages && messages.error) {
        toast.error(messages.error)
      }
    }, []);

    return (
      <AuthenticatedLayout>
        <Head title="Create Document" />
        <>
          <div className="py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                <div className="px-6 text-gray-900 dark:text-gray-200">
                  <FormGen
                    config={formObj}
                    className='grid grid-cols-2 gap-4 pb-4 dark:bg-gray-800 dark:text-gray-200'
                    valuesCallback={updateFormData}
                    values={data}
                    errors={errors}
                    reset={resetForm}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      </AuthenticatedLayout>
    );
}