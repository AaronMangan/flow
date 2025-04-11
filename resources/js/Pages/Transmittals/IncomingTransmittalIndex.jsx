import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TableView from '@/Components/TableView';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, usePage } from '@inertiajs/react';
import { EyeIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { truncateText, processMessages } from "../../Utils/helpers";
import Tooltip from '@/Components/Tooltip';
import FloatingButton from '@/Components/FloatingButton';
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import axios from 'axios';
import { useConfirm } from '../../Utils/useConfirm';

export default function TransmittalIndex({ transmittals, messages }) {
    const user = usePage().props.auth.user;
    const confirm = useConfirm();

    /**
     * View the incoming transmittal.
     * @param {any} id The id of the transmittal.
     * @returns {void} Redirects the user to the view transmittal page.
     */
    const viewTransmittal = (id) => {
        router.visit(route('transmittals.incoming.view', {transmittal: id}))
    };

    const acknowledgeTx = async (id) => {
        const confirmed = await confirm({
            title: "Acknowledge Transmittal?",
            message: "Acknowledge this transmittal as received and correct?",
            titleClass: "text-xl font-bold",
            messageClass: "my-4 text-gray-600",
            confirmClass: "bg-[#942af7] text-white px-4 rounded py-2"
        });
    
        if (confirmed) {
            axios.post(route('api.transmittal.acknowledge', {transmittal: id}), {}).then(res => {console.log(res)}).catch(ex => {console.error(ex)})
        } else {
            console.log("User cancelled....");
        }
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
                        <div>
                            <SecondaryButton
                                id={'edit_' + row?.id}
                                onClick={(e) => viewTransmittal(row?.id)}
                                className='mr-2'
                            >
                                <EyeIcon className="w-3 h-3 mr-2"/>View
                            </SecondaryButton>
                        </div>
                        {row?.id && (!row?.acknowledgement_at || row?.acknowledged_at === null) && user?.has_signature && (
                            <div>
                                <Tooltip text='Quick acknowledge this transmittal, using the signature in your profile. This option is only available if you have a signature'>
                                    <PrimaryButton
                                        onClick={(e) => acknowledgeTx(row?.id)}
                                    >
                                        <PencilSquareIcon className='w-3 h-3 mr-2' />Acknowledge
                                    </PrimaryButton>
                                </Tooltip>
                            </div>
                        )}
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

    useEffect(() => {
        // console.log(user?.has_signature)
    }, []);

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
