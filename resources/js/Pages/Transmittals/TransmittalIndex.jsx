import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TableView from '@/Components/TableView';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head } from '@inertiajs/react';
import { EyeIcon } from '@heroicons/react/24/solid';
import { truncateText } from "../../Utils/helpers";
import Tooltip from '@/Components/Tooltip';
import FloatingButton from '@/Components/FloatingButton';
import { router } from '@inertiajs/react';

export default function TransmittalIndex({ transmittals }) {
    /**
     * Route to the create transmittal page.
     */
    const createTransmittal = () => {
        // router.visit(route('transmittals.create'), {
        //     replace: true,
        //     preserveState: false
        // })
        router.get(route('transmittals.create'))
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
            selector: row => row?.to || 'N/A',
            width: '15pc',
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
            // center: true
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
                    </>
                );
            },
            // right: 'true',
        }
    ];
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
