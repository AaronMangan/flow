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
      selector: row => row.code,
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
                    setActiveDiscipline(null);
                    setActiveDiscipline({...row, ...{draft: row.draft == 'Yes' ? true : false}})
                    setShowCreateDiscipline(true);
                }}
                className='mr-2'
            >Edit</PrimaryButton>
            <DangerButton
              id={'delete_' + row?.id}
              onClick={(e) => {
                e.preventDefault();
                setActiveDiscipline(null);
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
    setActiveDiscipline(null);
    setActiveDiscipline({ name: '', code: '', description: '' })
    setShowCreateDiscipline(false);
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
                setActiveDiscipline(null);
            },
            onError: () => {
                toast.error('An error occurred, please contact your administrator');
            },
        });
    } else {
      post(route('discipline.create'), {
        onSuccess: () => {
          toast.success('Discipline created successfully!');
          setActiveDiscipline(null);
          setShowCreateDiscipline(false);
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
            router.visit(route('disciplines'), {
              only: ['disciplines'],
            })
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
        <form onSubmit={(e) => {postDiscipline(e)}} className="p-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Add New Discipline
          </h2>
          <FormGenerator
            className='w-full'
            config={formObj}
            valuesCallback={updateFormData}
            values={activeDiscipline}
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