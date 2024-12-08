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

export default function Config({ config }) {
    const [createSetting, setCreateSetting] = useState(false);
    
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
    const configColumns = [
        {
            name: 'Name',
            width: '25%',
            selector: row => row.name
        },
        {
            name: 'Values',
            width: 'full',
            selector: row => JSON.stringify(row.values)
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Configuration Settings" />
            <>
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <TableView
                                data={config}
                                columns={configColumns}
                                customStyles={customStyles}
                                className='rounded-lg'
                            />
                        </div>
                    </div>
                </div>

                {/* Lets users add a new setting */}
                <FloatingButton className="bg-gray-800" callback={() => {setCreateSetting(true)}} />
            </>

            {/* Create a new setting modal */}
            <Modal show={createSetting} onClose={closeModal}>
                <form onSubmit={postConfig} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Add New Config
                    </h2>

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
