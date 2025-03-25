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
import { truncateText } from '@/Utils/helpers';

export default function ViewDocumentStatuses({ statuses }) {
  const [showCreateStatus, setShowCreateStatus] = useState(false);
  /**
   * Construct a form object.
   */
  const { data, setData, post, processing, reset, errors, clearErrors } = useForm({ name: '', code: '', description: '', draft: false });
  const [activeStatus, setActiveStatus] = useState({ data });
  
  /**
   * Status Table Columns
   */
  const statusColumns = [
    {
      name: '#',
      selector: row => row.id,
      width: '5pc'
    },
    {
      name: 'Name',
      selector: row => row.name ?? null,
      width: '15pc'
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
      selector: row => truncateText(row.description, 100),
      width: 'full',
    },
    {
      name: 'For Drafts',
      selector: row => row.draft ? 'Yes' : 'No',
      width: '15pc'
    },
    {
      name: 'Actions',
      cell: (row) => {
          return (
              <>
              <PrimaryButton
                  id={'edit_' + row?.id}
                  onClick={(e) => {
                      setActiveStatus(null);
                      setActiveStatus(row)
                      setShowCreateStatus(true);
                  }}
                  className='mr-2'
              >Edit</PrimaryButton>
              <DangerButton
                id={'delete_' + row?.id}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveStatus(null);
                  setActiveStatus(row);
                  deleteStatus(row.id);
                }}
              >Delete</DangerButton>
              </>
          );
      },
      width: '15pc'
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

  /**
   * Controls what form is displayed to the user.
   */
  const formObj = {
    id: 'Status Form',
    title: activeStatus && activeStatus?.id > 0 ? 'Edit ' + activeStatus?.name : 'Add New Status',
    titleClass: 'text-gray-600 text-xl',
    contents: [
      {
        id: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'Please enter a name',
        className: 'w-full',
        parentClassName: 'col-span-2 w-full',
      },
      {
        id: 'code',
        type: 'text',
        label: 'Code',
        placeholder: 'Please enter a code',
        className: 'w-full',
        parentClassName: 'col-span-2 w-full',
      },
      {
        id: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: '[Optional] Description...',
        className: 'w-full',
        parentClassName: 'col-span-2 w-full',
        rows: 5
      },
      {
        id: 'draft',
        type: 'switch',
        label: 'Draft Status',
        className: 'pl-2',
        placeholder: null,
        parentClassName: 'col-span-1 pt-2',
      }
    ],
    buttons: [
      {
        id: 'close_button',
        label: 'Close',
        onClick: () => {
          setShowCreateStatus(false);
        },
        type: 'danger'
      },
      {
        id: 'save_button',
        label: 'Save',
        onClick: (e) => postStatus(e),
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
    router.visit(route('statuses'), {
      only: ['statuses'],
      preserveState: true,
    })
  }

  /**
   * Close Modal
   */
  const closeModal = () => {
    setShowCreateStatus(false);
    setActiveStatus({});
    setActiveStatus({ name: '', code: '', description: '', draft: false });
  }

  /**
   * Save the status
   * @param {*} e 
   */
  const postStatus = (e) => {
    e.preventDefault();
    if(activeStatus?.id) {
        post(route('status.update', {status: activeStatus?.id}), {
          onSuccess: () => {
            toast.success('Document Status updated successfully');
            setShowCreateStatus(false);
            setActiveStatus({});
            refreshData();
          },
          onError: () => {
            toast.error('An error occurred, please contact your administrator');
          },
        });
    } else {
      post(route('status.create'), {
        onSuccess: () => {
          toast.success('Document Status created successfully!');
          setActiveStatus({ name: '', code: '', description: '', draft: false });
          setShowCreateStatus(false);
          refreshData();
        },
        onError: () => {
          toast.error('An error occurred, please contact your administrator for assistance');
        }
      })
    }
    
    reset();
  }

  const deleteStatus = (id) => {
    axios.delete(route('status.destroy', {status: id})).then((response) => {
        if(response?.status == 200) {
          toast.success('Document Status deleted successfully');
          reset();
          router.visit(route('statuses'), {
            only: ['statuses'],
            preserveState: true,
          })
        } else {
          toast.error('Unable to delete the revision. Please check you have access or contact your administrator');
        }
    })
  }

  return (
    <AuthenticatedLayout>
    <Head title="Configuration Settings" />
      <>
        <div className="py-12">
          <div className="w-full mx-auto sm:px-6 lg:px-8">
            <div className="overflow-hidden sm:rounded-lg dark:bg-gray-800">
              {statuses && (
                <TableView
                  data={statuses}
                  columns={statusColumns}
                  customStyles={customStyles}
                  className='rounded-lg'
                />
              )}
            </div>
          </div>
        </div>

        {/* Lets users add a new setting */}
        <FloatingButton className="bg-gray-800" onClick={
            () => {setShowCreateStatus(true)}
        }/>
      </>
      <Modal show={showCreateStatus} onClose={closeModal}>
        <FormGen
          config={formObj}
          className='grid grid-cols-2 gap-1 px-4 py-2 mb-2 dark:bg-gray-800 dark:text-gray-200'
          valuesCallback={updateFormData}
          values={activeStatus}
          errors={errors}
          reset={reset}
        />
      </Modal>
    </AuthenticatedLayout>
  );
}