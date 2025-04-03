import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TableView from '@/Components/TableView';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head } from '@inertiajs/react';
import { EyeIcon, TrashIcon, UserIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { truncateText, processMessages } from "../../Utils/helpers";
import Tooltip from '@/Components/Tooltip';
import FloatingButton from '@/Components/FloatingButton';
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import axios from 'axios';

export default function TransmittalIndex({ transmittals, messages }) {
    /**
     * Route to the create transmittal page.
     */
    const createTransmittal = () => {
        router.get(route('transmittal.create'))
    }

    /**
     * Validates & Sends the transmittal to its selected recipients.
     */
    const sendTransmittal = (e, id) => {
        e.preventDefault();
        axios.post(route('transmittal.send', {transmittal: id})).then(res => {
            if(res?.data && res?.data?.messages) {
                processMessages(res?.data?.messages)
            }
        }).catch(ex => {
            toast.error('An error occurred when resending the transmittal, please check the details and try again or contact your administrator for support');
            console.error(ex)}
        )
    }

    const deleteTx = (e, row) => {
        e.preventdefault();
        // The transmittal has already been sent, so it cannot be deleted.
        if(row?.sent_at && (row?.sent_at != null || typeof row?.sent_at != 'undefined')) {
            toast.warning('Transmittals that have been sent cannot be deleted, please contact your administrator for assistance');
            return;
        } else {
            // If it hasn't been issued yet, it can be deleted.
            toast.error('TODO: Delete unsent transmittals');
        }
    }

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
    const transmittalColumns = [
        {
            name: '#',
            selector: row => row.id,
            width: '5pc'
        },
        {
            name: 'To',
            selector: row => row?.to?.map((x, index) => {
                return (
                    <div key={'badge_' + row?.id + '_' + index + '_parent'} className="p-1 m-1">
                        <span key={'badge_' + row?.id + '_' + index} className='px-2 py-1 mx-auto mt-2 text-xs font-semibold text-white bg-blue-500 rounded-lg'>{x}</span>
                    </div>
                )
            }) || 'N/A',
            width: '15pc',
            wrap: true
        },
        {
            name: 'Status',
            cell: (row) => {
                return (
                    <span>
                        <Tooltip text={row?.status?.description || row?.status?.name}>{row?.status?.name}</Tooltip>
                    </span>
                );
            },
            width: '15%'
        },
        {
            name: '# Items',
            cell: (row) => {
                return (
                    <span>{row?.documents?.length || 0}</span>
                );
            },
            width: '10pc',
        },
        {
            name: 'Details',
            cell: (row) => {
                return (
                    <span><Tooltip text={row?.details}>{truncateText(row?.details, 100)}</Tooltip></span>
                );
            }
        },
        {
            name: 'Actions',
            cell: (row) => {
                return (
                    <>
                        <SecondaryButton
                            id={'edit_' + row?.id}
                            onClick={(e) => {
                                alert('To Be Done!');
                            }}
                            className='mr-2'
                        >
                            <EyeIcon className="w-3 h-3 mr-2"/>View
                        </SecondaryButton>
                        {row?.sent_at === null && (
                            <>
                                <div>
                                    <PrimaryButton
                                        id={'send_' + row?.id}
                                        onClick={(e) => {
                                            sendTransmittal(e, row?.id);
                                        }}
                                        className='mr-2'
                                    >
                                        <PaperAirplaneIcon className="w-3 h-3 mr-2"/>Send
                                    </PrimaryButton>
                                </div>
                            </>
                        )}
                        {row?.sent_at !== null && (
                            <div>
                                <Tooltip text='Re-issue the transmittal with the exact documents and revisions'>
                                    <DangerButton
                                        id={'send_' + row?.id}
                                        onClick={(e) => {
                                            sendTransmittal(e, row?.id);
                                        }}
                                        className='mr-2'
                                    >
                                        <PaperAirplaneIcon className="w-3 h-3 mr-2"/>Resend
                                    </DangerButton>
                                </Tooltip>
                            </div>
                        )}
                        <div>
                            <Tooltip text='Issued transmittals cannot be deleted. Please contact your administrator if you need assistance'>
                                <DangerButton
                                    disabled={(row?.sent_at != null) ? true : false}
                                    id={'send_' + row?.id}
                                    onClick={(e) => {
                                        deleteTx(e, row)
                                    }}
                                    className='mr-2'
                                >
                                    <TrashIcon className="w-3 h-3 mr-2"/> Delete
                                </DangerButton>
                            </Tooltip>
                        </div>
                    </>
                );
            },
        }
    ];

    useEffect(() => {
        if(messages && messages?.success) {
            toast.success(messages?.success)
        }

        if(messages && messages?.warning) {
            toast.warning(messages?.warning)
        }

        if(messages && messages?.error) {
            toast.error(messages?.error)
        }
    }, [messages]);
    return (
        <AuthenticatedLayout>
            <Head title="Transmittal Index" />
            <>
                <div className="py-12">
                    <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                        {/* <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            
                        </div> */}
                        <div className="w-full p-6 text-gray-900 dark:text-gray-100">
                            <TableView
                                data={transmittals}
                                columns={transmittalColumns}
                                customStyles={customStyles}
                                className='rounded-lg'
                            />
                        </div>
                    </div>
                    
                    {/* Lets users create a new transmittal */}
                    <FloatingButton className="bg-gray-800" onClick={() => {
                        createTransmittal();
                    }}/>
                </div>
            </>
        </AuthenticatedLayout>
    );
}
