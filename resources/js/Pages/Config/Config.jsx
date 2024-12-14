import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import TableView from '@/Components/TableView';
import FloatingButton from '@/Components/FloatingButton';
import Modal from '@/Components/Modal';
import { toast } from 'react-toastify';
import Select from 'react-select';
import axios from 'axios';
import { useUser } from '@/Flow/useUser';

export default function Config({ auth, config }) {
    const { userHasRole } = useUser(auth?.user);
    const [createSetting, setCreateSetting] = useState(false);
    const [organisations, setOrganisations] = useState([]);

    /**
     * 
     */
    const getOrganisations = () => {
        axios.get(route('api.organisations')).then(response => {
            // 
            if(response.status == 200) {
                setOrganisations([]);
                setOrganisations(response?.data?.map(org => {
                  return {value: org?.id, label: org?.name}
                }));
                setData({...data, ...{organisation_id: auth?.user?.organisation_id}})
            }
        }).catch(error => {
            console.error(error);
        });
    }
    
    // Closes the modal
    const closeModal = () => {
        setCreateSetting(false);
        clearErrors();
        reset();
    };

    // Form Data.
    const {
        data,
        setData,
        post,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        name: '',
        values: '',
        organisation_id: auth?.user?.organisation_id || null
    });

    const postConfig = (e) => {
        e.preventDefault();
        post(route('config.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Config was saved successfully!");
                closeModal();
            },
            onError: () => null,
            onFinish: () => reset(),
        });
    };

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
     * Column definitions for the 
     */
    const configColumns = () => {
        
        return !userHasRole('super') ? [
            {
                name: 'Name',
                width: '25%',
                selector: row => row.name
            },
            {
                name: 'Values',
                selector: row => JSON.stringify(row.values)
            },
        ] : [
            {
                name: 'Name',
                width: '25%',
                selector: row => row.name
            },
            {
                name: 'Organisation',
                width: '25%',
                selector: row => row?.organisation?.name || 'Unknown'
            },
            {
                name: 'Values',
                selector: row => JSON.stringify(row.values)
            },
        ]
    };

    useEffect(() => {
    //   if(userHasRole('super')) {
        getOrganisations();
    //   }
    }, [userHasRole('super')]);

    return (
        <AuthenticatedLayout>
            <Head title="Configuration Settings" />
            <>
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <TableView
                                data={config}
                                columns={configColumns()}
                                customStyles={customStyles}
                                className='rounded-lg'
                            />
                        </div>
                    </div>
                </div>

                {/* Lets users add a new setting */}
                <FloatingButton className="bg-gray-800" onClick={() => {setCreateSetting(true)}} />
            </>

            {/* Create a new setting modal */}
            <Modal show={createSetting} onClose={closeModal}>
                <form onSubmit={postConfig} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Add New Config
                    </h2>

                    {/* Organisation (if super) */}
                    {auth && userHasRole('super') && (
                        <div className="mt-6">
                          <InputLabel
                            htmlFor="organisation_id"
                            value="Organisation"
                            className=""
                          />
                          <Select
                            id='organisation_id'
                            name='organisation_id'
                            options={organisations}
                            onChange={(e) => {
                                setData({...data, organisation_id: e.value})
                            }}
                            placeholder='Please select an Organisation'
                            menuPlacement='top'
                            value={organisations.find(o => o.value == data.organisation_id || auth?.user?.organisation_id)}
                            className='border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600'
                          />
                          {errors && errors.status_id && <InputError
                            message={errors.status_id}
                            className="mt-2"
                          />}
                        </div>
                    )}
                    
                    {/* User name field */}
                    <div className="mt-6">
                        <InputLabel
                            htmlFor="name"
                            value="Name"
                            className=""
                        />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) =>
                                setData('name', e.target.value)
                            }
                            className="block w-full mt-1"
                            isFocused
                            placeholder="Setting Name"
                        />
                        {errors && errors.name && <InputError
                            message={errors.name}
                            className="mt-2"
                        />}
                    </div>

                    {/* Values (JSON) */}
                    <div className="mt-6">
                        <InputLabel
                            htmlFor="values"
                            value="values"
                            className=""
                        />
                        <TextArea
                            id="values"
                            type="textarea"
                            name="values"
                            value={data.values}
                            onChange={(e) =>
                                setData('values', e.target.value)
                            }
                            className="block w-full mt-1"
                            isFocused
                            rows={5}
                            placeholder='{"key": "value", "key":"value"}'
                        />
                        {errors && errors.values && <InputError
                            message={errors.values}
                            className="mt-2"
                        />}
                    </div>

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
