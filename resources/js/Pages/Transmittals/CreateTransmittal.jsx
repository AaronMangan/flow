import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { ExclamationCircleIcon, DocumentTextIcon, TrashIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import FormGen from '@/Components/FormGenerator/FormGen';

export default function CreateTransmittal() {
    const [transmittalStatus, setTransmittalStatus] = useState([]);
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        to: '',
        details: '',
        documents: [],
        transmittal_status: 1,
    });
    /**
     * Submit the form and create the transmittal.
     */
    const submitForm = () => {
        post(route('transmittals.store'), {
            onSuccess:  () => {},
            onError: () => {
                toast.error('An error occurred saving transmittal, please try again')
            }
        });
    }

    /**
     * Set the form values, which will be submitted to the server.
     * @param {*} data 
     */
    const setFormValues = (values) => {
        setData(null)
        setData({ ...data, ...values })
    }

    /**
     * Defines the form object used for the create transmittal form.
     */
    const formObj = {
        id: 'create_transmittal_form',
        title: 'Create Transmittal',
        titleClass: 'text-gray-600 text-xl',
        contents: [
          {
            id: 'to',
            type: 'user_list',
            label: 'To',
            className: 'w-full',
            parentClassName: 'col-span-2 pr-2 w-full',
            placeholder: 'Recipients...'
          },
          {
            id: 'details',
            type: 'textarea',
            label: 'Details',
            className: 'w-full',
            parentClassName: 'col-span-2 pr-2 w-full',
            placeholder: 'Transmittal details'
          },
          {
            id: 'documents',
            type: 'button_list',
            label: 'Documents',
            className: 'w-full',
            parentClassName: 'col-span-2 pr-2 w-full',
            data: [],
            placeholder: 'Add documents to the transmittal'
          },
          {
            id: 'transmittal_status',
            type: 'select',
            label: 'Status',
            className: 'w-full pr-2',
            data: transmittalStatus || [],
            placeholder: 'Select a status'
          },
        ],
        // Buttons for the form!
        buttons: [
          {
            id: 'clear_button',
            label: 'Clear',
            onClick: () => {
              // 
            },
            type: 'danger'
          },
          {
            id: 'save_button',
            label: 'Save',
            onClick: (e) => submitForm(),
            type: 'primary'
          }
        ]
    };

    // Get the transmittal status from settings
    useEffect(() => {
        axios.get(route('metadata', {values: 'transmittal_statuses'})).then(res => {
            setTransmittalStatus(res?.data?.data?.transmittal_statuses?.map(ts => {
                return {label: ts.name, value: ts.id}
            }) || []);
        }).catch(ex => {
            toast.error('An error has occurred, please reload the page or contact your administrator');
        });
    }, []);
    return (
        <AuthenticatedLayout>
            <Head title="Create New Transmittal" />
            <>
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <div className="px-4 py-2">
                                <FormGen
                                    config={formObj}
                                    className='grid grid-cols-2 gap-4 px-2'
                                    valuesCallback={(val) => setFormValues({...data, ...val})}
                                    values={data}
                                    errors={() => {}}
                                    reset={null}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </AuthenticatedLayout>
    );
}
