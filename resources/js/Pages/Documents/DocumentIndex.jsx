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
import FilterBar from '@/Components/FilterBar';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon, TrashIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid'

export default function ViewDocuments({ documents, messages }) {
  let debounceTimer;
  const [showDocumentDetails, setShowDocumentDetails] = useState(false);
  
  const [activeDocument, setActiveDocument] = useState({});
  const [filters, setFilters] = useState([]);

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
      name: 'Document Number',
      selector: row => row.document_number,
      width: '15pc',
    },
    {
      name: 'Name',
      selector: row => row.name ?? null,
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
                    router.get(route('document.edit', row?.id))
                }}
                className='mr-2'
            >
              <PencilIcon className="w-3 h-3 mr-2"/>Edit
            </PrimaryButton>
            <DangerButton
              id={'delete_' + row?.id}
              onClick={(e) => {
                e.preventDefault();
                setActiveDocument(null);
                setActiveDocument(row);
                deleteDocument(row.id);
              }}
              className='mr-2'
            >
              <TrashIcon className="w-3 h-3 mr-2"/>
              Delete
            </DangerButton>
            <PrimaryButton className="flex-start" onClick={() => {
                setActiveDocument(row)
                setShowDocumentDetails(true)
              }}>
              <DocumentTextIcon className="w-3 h-3 mr-2"/>
              Details
            </PrimaryButton>
          </>
        );
      },
      width: '25pc'
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
   * Close Modal
   */
  const closeModal = () => {
    setActiveDocument(null);
    setActiveDocument({ name: '', code: '', description: '' })
    setShowDocumentDetails(false);
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
                setShowDocumentDetails(false);
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
          setShowDocumentDetails(false);
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

  const valuesCallback = (newFilters) => {
    // Clear previous timeout
    clearTimeout(debounceTimer);

    // Set a new timeout
    debounceTimer = setTimeout(() => {
      setFilters(newFilters)
    }, 500); // 500ms delay
  }
  const filterOptions = [
    {
      id: 'search',
      type: 'text',
      label: 'Search',
      className: 'w-[300px]',
      placeholder: 'Enter search'
    },
  ];

  useEffect(() => {
    if(typeof filters.search !== 'undefined') {
      router.visit('documents?search=' + filters?.search || '', {
        preserveState: true,
        only: ['documents'],
        replace: true
      })
    }
  }, [filters]);

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
                <div>
                  <div>
                    <FilterBar valuesCallback={valuesCallback} config={filterOptions} values={filters} className="inline-flex w-full my-2" />
                  </div>
                  <div>
                    <TableView
                      data={documents}
                      columns={areaColumns}
                      customStyles={customStyles}
                      className='rounded-lg'
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lets users add a new setting */}
        <FloatingButton className="bg-gray-800" onClick={
            () => {setShowDocumentDetails(true)}
        }/>
      </>

      {/* Create a new setting modal */}
      <Modal show={showDocumentDetails} onClose={closeModal} maxWidth={'2xl'} >
        <div className='px-4 py-4 overflow-y'>
          <dl class="grid grid-cols-1 gap-x-8 gap-y-4">
            <div>
              <dt class="font-bold text-gray-900">Document Number</dt>
              <dd class="text-gray-600">{activeDocument?.document_number || 'N/A'}</dd>
            </div>
            <div>
              <dt class="font-bold text-gray-900">Title</dt>
              <dd class="text-gray-600">{activeDocument.name}</dd>
            </div>
            <div>
              <dt class="font-bold text-gray-900">Area</dt>
              <dd class="text-gray-600">{activeDocument?.area?.name}</dd>
            </div>
            <div>
              <dt class="font-bold text-gray-900">Discipline</dt>
              <dd class="text-gray-600">{activeDocument.discipline?.name}</dd>
            </div>
            <div>
              <dt class="font-bold text-gray-900">Type</dt>
              <dd class="text-gray-600">{activeDocument?.type?.name}</dd>
            </div>
            <div>
              <dt class="font-bold text-gray-900">Revision</dt>
              <dd class="text-gray-600">{activeDocument?.revision?.code}</dd>
            </div>
            <div>
              <dt class="font-bold text-gray-900">Status</dt>
              <dd class="text-gray-600">{activeDocument?.document_status?.name}</dd>
            </div>
            <div className='text-right'>
              <PrimaryButton className="" onClick={closeModal}>
                <XMarkIcon className="w-3 h-3 mr-2"/>
                Close
              </PrimaryButton>
            </div>
          </dl>
        </div>
      </Modal>
    </AuthenticatedLayout>
  );
}