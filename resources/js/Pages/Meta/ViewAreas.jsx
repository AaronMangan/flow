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
import Tooltip from '@/Components/Tooltip';

export default function ViewAreas({ areas }) {
  const [showCreateArea, setShowCreateArea] = useState(false);
  /**
   * Construct a form object.
   */
  const { data, setData, post, processing, reset, errors, clearErrors } = useForm({ name: '', code: '', description: '' });
  const [activeArea, setActiveArea] = useState({ data });
  
  /**
   * Area Table Columns
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
                    setActiveArea(null);
                    setActiveArea({...row, ...{draft: row.draft == 'Yes' ? true : false}})
                    setShowCreateArea(true);
                }}
                className='mr-2'
            >Edit</PrimaryButton>
            <DangerButton
              id={'delete_' + row?.id}
              onClick={(e) => {
                e.preventDefault();
                setActiveArea(null);
                setActiveArea(row);
                deleteArea(row.id);
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
    setActiveArea(null);
    setActiveArea({ name: '', code: '', description: '' })
    setShowCreateArea(false);
  }

  /**
   * Reloads the data without reloading the page.
   */
  const refreshData = () => {
    router.visit(route('areas'), {
      only: ['areas'],
    })
  }

  /**
   * Save the area
   * @param {*} e 
   */
  const postArea = (e) => {
    e.preventDefault();
    if(activeArea?.id) {
        post(route('area.update', {area: activeArea}), {
            onSuccess: () => {
                toast.success('Area updated successfully');
                setShowCreateArea(false);
                setActiveArea(null);
                refreshData();
            },
            onError: () => {
                toast.error('An error occurred, please contact your administrator');
            },
        });
    } else {
      post(route('area.create'), {
        onSuccess: () => {
          toast.success('Area created successfully!');
          setActiveArea(null);
          setShowCreateArea(false);
          refreshData();
        },
        onError: () => {
            toast.error('An error occurred, please contact your administrator for assistance');
        }
      })
    }
  }

  const deleteArea = (id) => {
    axios.delete(route('area.destroy', {area: id})).then((response) => {
        if(response?.status == 200) {
            toast.success('Area deleted successfully');
            reset();
            refreshData();
        } else {
            toast.error('Unable to delete the area. Please check you have access or contact your administrator');
        }
    })
  }

  return (
    <AuthenticatedLayout>
    <Head title="Areas" />
      <>
        <div className="py-12">
          <div className="w-full mx-auto sm:px-6 lg:px-8">
            <div className="overflow-hidden sm:rounded-lg dark:bg-gray-800">
              {areas && (
                <TableView
                  data={areas}
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
            () => {setShowCreateArea(true)}
        }/>
      </>

      {/* Create a new setting modal */}
      <Modal show={showCreateArea} onClose={closeModal}>
        <form onSubmit={(e) => {postArea(e)}} className="p-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {activeArea && activeArea?.id > 0 ? 'Edit ' + activeArea?.name : 'Add New Area'}
          </h2>
          <FormGenerator
            className='w-full'
            config={formObj}
            valuesCallback={updateFormData}
            values={activeArea}
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