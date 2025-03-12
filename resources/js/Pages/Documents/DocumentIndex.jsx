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
import { router } from '@inertiajs/react';
import Tooltip from '@/Components/Tooltip';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function ViewDocuments({ documents }) {
  const [showCreateDocument, setShowCreateDocument] = useState(false);
  /**
   * Construct a form object.
   */
  const { data, setData, post, processing, reset, errors, clearErrors } = useForm({ name: '', code: '', description: '' });
  const [activeDocument, setActiveDocument] = useState({ data });
  
  /**
   * Document Table Columns
   */
  const areaColumns = [
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
                    setActiveDocument(null);
                    setActiveDocument({...row, ...{draft: row.draft == 'Yes' ? true : false}})
                    setShowCreateDocument(true);
                }}
                className='mr-2'
            >Edit</PrimaryButton>
            <DangerButton
              id={'delete_' + row?.id}
              onClick={(e) => {
                e.preventDefault();
                setActiveDocument(null);
                setActiveDocument(row);
                deleteDocument(row.id);
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
    setActiveDocument(null);
    setActiveDocument({ name: '', code: '', description: '' })
    setShowCreateDocument(false);
  }

  /**
   * Reloads the data without reloading the page.
   */
  const refreshData = () => {
    router.visit(route('documents'), {
      only: ['documents'],
    })
  }

  /**
   * Save the area
   * @param {*} e 
   */
  const postDocument = (e) => {
    e.preventDefault();
    if(activeDocument?.id) {
        post(route('area.update', {area: activeDocument}), {
            onSuccess: () => {
                toast.success('Document updated successfully');
                setShowCreateDocument(false);
                setActiveDocument(null);
                refreshData();
            },
            onError: () => {
                toast.error('An error occurred, please contact your administrator');
            },
        });
    } else {
      post(route('area.create'), {
        onSuccess: () => {
          toast.success('Document created successfully!');
          setActiveDocument(null);
          setShowCreateDocument(false);
          refreshData();
        },
        onError: () => {
            toast.error('An error occurred, please contact your administrator for assistance');
        }
      })
    }
  }

  const deleteDocument = (id) => {
    axios.delete(route('area.destroy', {area: id})).then((response) => {
        if(response?.status == 200) {
            toast.success('Document deleted successfully');
            reset();
            refreshData();
        } else {
            toast.error('Unable to delete the area. Please check you have access or contact your administrator');
        }
    })
  }

  return (
    <AuthenticatedLayout>
    <Head title="Documents" />
      <>
        <div className="py-12">
          <div className="w-full mx-auto sm:px-6 lg:px-8">
            <div className="overflow-hidden sm:rounded-lg dark:bg-gray-800">
            {(!documents || documents.length <= 0) && (
                <>
                  <ExclamationCircleIcon className="w-16 h-16 mx-auto text-center text-gray-500" />
                  <div className='text-3xl text-center text-gray-500'>No Documents</div>
                  <div className='text-xs text-center text-gray-500'>You can add some with the + button below</div>
                </>
              )}
              {documents && documents.length > 0 && (
                <TableView
                  data={documents}
                  columns={areaColumns}
                  customStyles={customStyles}
                  className='rounded-lg'
                />
              )}
            </div>
          </div>
        </div>

        {/* Lets users add a new setting */}
        <FloatingButton className="bg-gray-800" onClick={
            () => {setShowCreateDocument(true)}
        }/>
      </>

      {/* Create a new setting modal */}
      <Modal show={showCreateDocument} onClose={closeModal}>
        <form onSubmit={(e) => {postDocument(e)}} className="p-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {activeDocument && activeDocument?.id > 0 ? 'Edit ' + activeDocument?.name : 'Add New Document'}
          </h2>
          <FormGenerator
            className='w-full'
            config={formObj}
            valuesCallback={updateFormData}
            values={activeDocument}
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