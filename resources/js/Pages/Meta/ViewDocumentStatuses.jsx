import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import FormGenerator from '@/Components/FormGenerator';
import SecondaryButton from '@/Components/SecondaryButton';
import TableView from '@/Components/TableView';
import FloatingButton from '@/Components/FloatingButton';
import Modal from '@/Components/Modal';
import { toast } from 'react-toastify';
import DangerButton from '@/Components/DangerButton';
import axios from 'axios';
import { router } from '@inertiajs/react'

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
      width: '10pc'
    },
    {
      name: 'Code',
      selector: row => row.code,
      width: '10pc',
    },
    {
      name: 'Description',
      selector: row => row.description,
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

  const formObj = [
    {
      id: 'name',
      type: 'text',
      label: 'Name',
      placeholder: 'Please enter a name',
      className: 'w-full m-2'
    },
    {
      id: 'code',
      type: 'text',
      label: 'Code',
      placeholder: 'Please enter a code',
      className: 'w-full m-2'
    },
    {
      id: 'description',
      type: 'textarea',
      label: 'Description',
      placeholder: '[Optional] Description...',
      className: 'w-full m-2',
      rows: 5
    },
    {
      id: 'draft',
      type: 'checkbox',
      label: 'Draft Status',
      className: 'w-1/2 mx-2 rounded',
      placeholder: null
    }
  ];

  /**
   * Update the form data with the data from the form generator
   * @param {object} values 
   */
  const updateFormData = (values) => {
    setData(null);
    setData(values);
  }

  /**
   * Close Modal
   */
  const closeModal = () => {
    setShowCreateStatus(false);
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
            setActiveStatus(null);
            router.visit(route('statuses'), {
              only: ['statuses'],
              preserveState: true,
            })
          },
          onError: () => {
            toast.error('An error occurred, please contact your administrator');
          },
        });
    } else {
      post(route('status.create'), {
        onSuccess: () => {
          toast.success('Document Status created successfully!');
          setActiveStatus(null);
          setShowCreateStatus(false);
          router.visit(route('statuses'), {
            only: ['statuses'],
            preserveState: true,
          })
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

      {/* Create a new setting modal */}
      <Modal show={showCreateStatus} onClose={closeModal}>
        <form onSubmit={(e) => {postStatus(e)}} className="p-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Add New Status
          </h2>
          <FormGenerator
            className='w-full'
            config={formObj}
            valuesCallback={updateFormData}
            values={activeStatus}
            errors={errors}
          />

          {/* Buttons to handle saving or cancelling */}
          <div className="flex justify-end mt-6">
            {/* Save the changes to the user */}
            <PrimaryButton className="mr-2" disabled={processing}>
              Save
            </PrimaryButton>
            
            {/* Cancel */}
            <SecondaryButton onClick={closeModal}>
              Cancel
            </SecondaryButton>
          </div>
        </form>
      </Modal>
    </AuthenticatedLayout>
  );
}