import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import SignaturePad from '@/Components/SignaturePad';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { router } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status, userSignature }) {
    const [signature, setSignature] = useState(userSignature || null);
    /**
     * Sends the signature to the server.
     * @param {*} data 
     */
    const saveCallback = (data) => {
        axios.post(route('api.save-signature'), {signature: signature || data}).then(response => {
            if (response?.data && response?.data?.status && response?.data?.status === 'success') {
                toast.success(response?.data?.message || 'Success');
            } else {
                toast.error(response?.data?.message || 'An error occurred, please try again or contact your administrator');
            }
        }).catch(ex => {
            console.error(ex.message);
        })

    }

    /**
     * Callback to set the data for the signature.
     * @param {*} data 
     */
    const signatureCallback = (data) => {
        setSignature(data);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-4 bg-white shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 bg-white shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4 bg-white shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <DeleteUserForm className="max-w-xl" />
                    </div>

                    {/* Signature Collection */}
                    <div className="bg-white shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <SignaturePad
                            signatureCallback={signatureCallback}
                            onSave={(e) => saveCallback(signature)}
                            blurb="Add your signature here which is added to transmittals and correspondence"
                            value={signature}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
