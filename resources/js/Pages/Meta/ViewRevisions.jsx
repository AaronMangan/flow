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

export default function ViewRevisions({ revisions }) {
  const [showCreateRevision, setShowCreateRevision] = useState(false);
  /**
   * Construct a form object.
   */
  const { data, setData, post, processing, reset, errors, clearErrors } = useForm({ name: '', code: '', description: '', draft: false, weight: null });
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
    },
    {
      name: 'Weight',
      cell: (row) => {
        return (row?.weight === null || typeof row?.weight === 'undefined') ? '-' : row?.weight
      }
    },
    {
      name: 'For Drafts',
      selector: row => row.draft ? 'Yes' : 'No',
    },
    {
      name: 'Description',
      selector: row => row.description ? truncateText(row?.description, 100) : '-',
      width: '40pc'
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
                    setActiveRevision({...row, ...{draft: row.draft}})
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
    id: 'Revision Form',
    title: activeRevision && activeRevision?.id > 0 ? 'Edit ' + activeRevision?.name : 'Add New Revision',
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
        label: 'Draft Revision',
        className: 'pl-2',
        placeholder: null,
        parentClassName: 'col-span-1 pt-2',
      },
      {
        id: 'weight',
        type: 'number',
        label: 'Weight',
        className: 'w-full',
        placeholder: null,
        parentClassName: 'col-span-1 w-full',
      }
    ],
    buttons: [
      {
        id: 'close_button',
        label: 'Close',
        onClick: () => {
          setShowCreateRevision(false);
        },
        type: 'danger'
      },
      {
        id: 'save_button',
        label: 'Save',
        onClick: (e) => postRevision(e),
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
    setActiveRevision({ name: '', code: '', description: '', draft: false, weight: null })
  }

  /**
   * Save the revision
   * @param {*} e 
   */
  const postRevision = (e) => {
    if(activeRevision?.id) {
        post(route('revision.update', {revision: activeRevision}), {
            onSuccess: () => {
              toast.success('Revision updated successfully');
              setShowCreateRevision(false);
              setActiveRevision({ name: '', code: '', description: '', draft: false, weight: null })
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
          setActiveRevision({ name: '', code: '', description: '', draft: false, weight: null })
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

  useEffect(() => {
    // When mounted...
  }, []);

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
        <FormGen
          config={formObj}
          className='grid grid-cols-2 gap-1 px-4 py-2 mb-2 dark:bg-gray-800 dark:text-gray-200'
          valuesCallback={updateFormData}
          values={activeRevision}
          errors={errors}
          reset={reset}
        />
      </Modal>
    </AuthenticatedLayout>
  );
}