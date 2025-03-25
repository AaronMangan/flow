import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import FormGen from '@/Components/FormGenerator/FormGen';
import TableView from '@/Components/TableView';
import FloatingButton from '@/Components/FloatingButton';
import Modal from '@/Components/Modal';
import { toast } from 'react-toastify';
import DangerButton from '@/Components/DangerButton';
import axios from 'axios';
import { router } from '@inertiajs/react';
import Tooltip from '@/Components/Tooltip';

export default function ViewTypes({ types }) {
  const [showCreateType, setShowCreateType] = useState(false);
  const { data, setData, post, processing, reset, errors, clearErrors } = useForm({ name: '', code: '', description: '' });
  const [activeType, setActiveType] = useState({ data });
  
  /**
   * Type Table Columns
   */
  const typeColumns = [
    {
      name: '#',
      selector: row => row.id,
      width: '5pc'
    },
    {
      name: 'Name',
      selector: row => row.name ?? null,
      width: '10pc'
    },
    {
      name: 'Code',
      cell: (row) => {
        return (
          <Tooltip text='Used when generating Document Numbers'>
            <strong>{row?.code || 'N/A'}</strong>
          </Tooltip>
        );
      },
      width: '10pc',
    },
    {
      name: 'Description',
      selector: row => row.description,
      width: 'full',
    },
    {
      name: 'Actions',
      cell: (row) => {
        return (
          <>
            <PrimaryButton
                id={'edit_' + row?.id}
                onClick={(e) => {
                    setActiveType(null);
                    setActiveType({...row, ...{draft: row.draft == 'Yes' ? true : false}})
                    setShowCreateType(true);
                }}
                className='mr-2'
            >Edit</PrimaryButton>
            <DangerButton
              id={'delete_' + row?.id}
              onClick={(e) => {
                e.preventDefault();
                setActiveType(null);
                setActiveType(row);
                deleteType(row.id);
              }}
            >Delete</DangerButton>
          </>
        );
      },
      width: '20pc'
    }
  ];

  /**
   * Custom Styles for the table headers
   */
  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#fff',
        background: '#1f2937'
      }
    }
  };

  const formObj = {
    id: 'types_form',
    title: activeType && activeType?.id > 0 ? 'Edit ' + activeType?.name : 'Add New Type',
    titleClass: 'text-gray-600 text-xl',
    contents: [
      {
        id: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'Please enter a name',
        className: 'w-full',
        parentClassName: 'col-span-2 pr-2 w-full',
      },
      {
        id: 'code',
        type: 'text',
        label: 'Code',
        placeholder: 'Please enter a code',
        className: 'w-full',
        parentClassName: 'col-span-2 pr-2 w-full',
      },
      {
        id: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: '[Optional] Description...',
        className: 'w-full',
        parentClassName: 'col-span-2 pr-2 w-full',
        rows: 5
      }
    ],
    buttons: [
      {
        id: 'close_button',
        label: 'Close',
        onClick: () => {
          setShowCreateType(false);
        },
        type: 'danger'
      },
      {
        id: 'save_button',
        label: 'Save',
        onClick: (e) => postType(e),
        type: 'primary'
      },
    ]
  };

  /**
   * Update the form data with the data from the form generator
   * @param {object} values 
   */
  const updateFormData = (values) => {
    setData(null);
    setData(values);
  }

  /**
   * Reloads the data without reloading the page.
   */
  const refreshData = () => {
    router.visit(route('types'), {
      only: ['types'],
      preserveState: true,
    })
  }

  /**
   * Close Modal
   */
  const closeModal = () => {
    setActiveType(null);
    setActiveType({ name: '', code: '', description: '' })
    setShowCreateType(false);
  }

  /**
   * Save the type
   * @param {*} e 
   */
  const postType = (e) => {
    if(activeType?.id) {
        post(route('type.update', {type: activeType}), {
            onSuccess: () => {
              toast.success('Type updated successfully');
              setShowCreateType(false);
              setActiveType({ name: '', code: '', description: '' });
              refreshData();
            },
            onError: () => {
              toast.error('An error occurred, please contact your administrator');
            },
        });
    } else {
      post(route('type.create'), {
        onSuccess: () => {
          toast.success('Type created successfully!');
          setActiveType({ name: '', code: '', description: '' })
          setShowCreateType(false);
          refreshData();
        },
        onError: () => {
            toast.error('An error occurred, please contact your administrator for assistance');
        }
      })
    }
  }

  const deleteType = (id) => {
    axios.delete(route('type.destroy', {type: id})).then((response) => {
        if(response?.status == 200) {
            toast.success('Type deleted successfully');
            reset();
            refreshData();
        } else {
            toast.error('Unable to delete the type. Please check you have access or contact your administrator');
        }
    })
  }

  return (
    <AuthenticatedLayout>
    <Head title="Types" />
      <>
        <div className="py-12">
          <div className="w-full mx-auto sm:px-6 lg:px-8">
            <div className="overflow-hidden sm:rounded-lg dark:bg-gray-800">
              {types && (
                <TableView
                  data={types}
                  columns={typeColumns}
                  customStyles={customStyles}
                  className='rounded-lg'
                />
              )}
            </div>
          </div>
        </div>

        {/* Lets users add a new setting */}
        <FloatingButton className="bg-gray-800" onClick={
            () => {
              setActiveType({});
              setShowCreateType(true);
            }
        }/>
      </>

      {/* Create a new setting modal */}
      <Modal show={showCreateType} onClose={closeModal}>
        <FormGen
          config={formObj}
          className='grid grid-cols-2 gap-1 px-4 py-2 dark:bg-gray-800 dark:text-gray-200'
          valuesCallback={updateFormData}
          values={activeType}
          errors={errors}
          reset={reset}
        />
      </Modal>
    </AuthenticatedLayout>
  );
}