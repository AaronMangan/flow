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

export default function ViewRevisions({ revisions }) {
  const [showCreateRevision, setShowCreateRevision] = useState(false);
  /**
   * Construct a form object.
   */
  const { data, setData, post, processing, reset, errors, clearErrors } = useForm({ name: '', code: '', description: '', draft: false });
  const [activeRevision, setActiveRevision] = useState({ data });
  
  /**
   * Revision Table Columns
   */
  const revisionColumns = [
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
                        setActiveRevision(null);
                        setActiveRevision({...row, ...{draft: row.draft == 'Yes' ? true : false}})
                        setShowCreateRevision(true);
                    }}
                    className='mr-2'
                >Edit</PrimaryButton>
                <DangerButton
                  id={'delete_' + row?.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveRevision(null);
                    setActiveRevision(row);
                    deleteRevision(row.id);
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
      label: 'Draft Revision',
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
     * Reloads the data without reloading the page.
     */
    const refreshData = () => {
      router.visit(route('revisions'), {
        only: ['revisions'],
        preserveState: true,
      })
    }

  /**
   * Close Modal
   */
  const closeModal = () => {
    setShowCreateRevision(false);
    setActiveRevision(null);
    setActiveRevision({ name: '', code: '', description: '', draft: false })
  }

  /**
   * Save the revision
   * @param {*} e 
   */
  const postRevision = (e) => {
    e.preventDefault();
    if(activeRevision?.id) {
        post(route('revision.update', {revision: activeRevision}), {
            onSuccess: () => {
              toast.success('Revision updated successfully');
              setShowCreateRevision(false);
              setActiveRevision(null);
              refreshData();
            },
            onError: () => {
              toast.error('An error occurred, please contact your administrator');
            },
        });
    } else {
      post(route('revision.create'), {
        onSuccess: () => {
          toast.success('Revision created successfully!');
          setActiveRevision(null);
          setShowCreateRevision(false);
          refreshData();
        },
        onError: () => {
          toast.error('An error occurred, please contact your administrator for assistance');
        }
      })
    }
  }

  const deleteRevision = (id) => {
    axios.delete(route('revision.destroy', {revision: id})).then((response) => {
        if(response?.status == 200) {
          toast.success('Revision deleted successfully');
          reset();
          refreshData();
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
              {revisions && (
                <TableView
                  data={revisions}
                  columns={revisionColumns}
                  customStyles={customStyles}
                  className='rounded-lg'
                />
              )}
            </div>
          </div>
        </div>

        {/* Lets users add a new setting */}
        <FloatingButton className="bg-gray-800" onClick={
            () => {setShowCreateRevision(true)}
        }/>
      </>

      {/* Create a new setting modal */}
      <Modal show={showCreateRevision} onClose={closeModal}>
        <form onSubmit={(e) => {postRevision(e)}} className="p-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {activeRevision && activeRevision?.id > 0 ? 'Edit ' + activeRevision?.name : 'Add New Revision'}
          </h2>
          <FormGenerator
            className='w-full'
            config={formObj}
            valuesCallback={updateFormData}
            values={activeRevision}
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