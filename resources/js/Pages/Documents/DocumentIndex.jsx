import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import TableView from '@/Components/TableView';
import FloatingButton from '@/Components/FloatingButton';
// import Modal from '@/Components/Modal';
import { toast } from 'react-toastify';
import DangerButton from '@/Components/DangerButton';
import axios from 'axios';
import { router } from '@inertiajs/react';
import FilterBar from '@/Components/FilterBar';
import { ExclamationCircleIcon, DocumentTextIcon, TrashIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid'

export default function ViewDocuments({ documents, messages }) {
  let debounceTimer;
  const [showDocumentDetails, setShowDocumentDetails] = useState(false);
  
  const [activeDocument, setActiveDocument] = useState({});
  const [filters, setFilters] = useState([]);

  /**
   * Document Table Columns
   */
  const documentColumns = [
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
      name: 'Rev.',
      selector: row => row?.revision?.code || row?.revision_id,
      width: '5pc',
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
    {
      id: 'discipline',
      type: 'select',
      label: 'Discipline',
      className: 'w-[300px]',
      placeholder: 'Filter by discipline...',
      endpoint: route('api.disciplines')
    },
  ];

  // Runs when filters change.
  useEffect(() => {
    if(typeof filters.search !== 'undefined') {
      router.visit('documents?search=' + filters?.search || '', {
        preserveState: true,
        only: ['documents'],
        replace: true
      })
    }
  }, [filters]);

  // Runs when the component is mounted.
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
        <div className="py-12 dark:bg-gray-900">
          <div className="w-full mx-auto sm:px-6 lg:px-8">
            <div className="overflow-hidden dark:text-gray-100 dark:bg-gray-900">
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
                      columns={documentColumns}
                      customStyles={customStyles}
                      className=''
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Allows users add a new document */}
        <FloatingButton className="bg-gray-800" onClick={
          () => {
            router.visit(route('documents.create'))
          }
        }/>
      </>
    </AuthenticatedLayout>
  );
}