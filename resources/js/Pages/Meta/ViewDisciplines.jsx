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

export default function ViewDisciplines({ disciplines }) {
  const [showCreateDiscipline, setShowCreateDiscipline] = useState(false);
  /**
   * Construct a form object.
   */
  const { data, setData, post, processing, reset, errors, clearErrors } = useForm({ name: '', code: '', description: '' });
  const [activeDiscipline, setActiveDiscipline] = useState({ data });
  
  /**
   * Discipline Table Columns
   */
  const disciplineColumns = [
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
                  setActiveDiscipline({ name: '', code: '', description: '' });
                  setActiveDiscipline({...row, ...{draft: row.draft == 'Yes' ? true : false}})
                  setShowCreateDiscipline(true);
                }}
                className='mr-2'
            >Edit</PrimaryButton>
            <DangerButton
              id={'delete_' + row?.id}
              onClick={(e) => {
                e.preventDefault();
                setActiveDiscipline({ name: '', code: '', description: '' });
                setActiveDiscipline(row);
                deleteDiscipline(row.id);
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
    id: 'discipline-form',
    title: activeDiscipline && activeDiscipline?.id > 0 ? 'Edit ' + activeDiscipline?.name : 'Add New Discipline',
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
      }
    ],
    buttons: [
      {
        id: 'close_button',
        label: 'Close',
        onClick: () => {
          closeModal();
        },
        type: 'danger'
      },
      {
        id: 'save_button',
        label: 'Save',
        onClick: (e) => {
          postDiscipline(e);
        },
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
   * Close Modal
   */
  const closeModal = () => {
    setShowCreateDiscipline(false);
    setActiveDiscipline({ name: '', code: '', description: '' });
  }

  /**
   * Reloads the data without reloading the page.
   */
  const refreshData = () => {
    router.visit(route('disciplines'), {
      only: ['disciplines'],
    })
  }

  /**
   * Save the discipline
   * @param {*} e 
   */
  const postDiscipline = (e) => {
    e.preventDefault();
    if(activeDiscipline?.id) {
        post(route('discipline.update', {discipline: activeDiscipline}), {
            onSuccess: () => {
                toast.success('Discipline updated successfully');
                setShowCreateDiscipline(false);
                setActiveDiscipline({ name: '', code: '', description: '' });
                refreshData();
            },
            onError: () => {
                toast.error('An error occurred, please contact your administrator');
            },
        });
    } else {
      post(route('discipline.create'), {
        onSuccess: () => {
          toast.success('Discipline created successfully!');
          setActiveDiscipline({ name: '', code: '', description: '' });
          setShowCreateDiscipline(false);
          refreshData();
        },
        onError: () => {
            toast.error('An error occurred, please contact your administrator for assistance');
        }
      })
    }
  }

  const deleteDiscipline = (id) => {
    axios.delete(route('discipline.destroy', {discipline: id})).then((response) => {
        if(response?.status == 200) {
            toast.success('Discipline deleted successfully');
            reset();
            refreshData();
        } else {
            toast.error('Unable to delete the discipline. Please check you have access or contact your administrator');
        }
    })
  }

  return (
    <AuthenticatedLayout>
    <Head title="Disciplines" />
      <>
        <div className="py-12">
          <div className="w-full mx-auto sm:px-6 lg:px-8">
            <div className="overflow-hidden sm:rounded-lg dark:bg-gray-800">
              {disciplines && (
                <TableView
                  data={disciplines}
                  columns={disciplineColumns}
                  customStyles={customStyles}
                  className='rounded-lg'
                />
              )}
            </div>
          </div>
        </div>

        {/* Lets users add a new setting */}
        <FloatingButton className="bg-gray-800" onClick={
            () => {setShowCreateDiscipline(true)}
        }/>
      </>

      {/* Create a new setting modal */}
      <Modal show={showCreateDiscipline} onClose={closeModal}>
        <div className='grid pb-1'>
          <FormGen
            config={formObj}
            className='grid grid-cols-2 gap-1 px-4 py-2 dark:bg-gray-800 dark:text-gray-200'
            valuesCallback={updateFormData}
            values={activeDiscipline}
            errors={errors}
            reset={reset}
          />
        </div>
      </Modal>
    </AuthenticatedLayout>
  );
}