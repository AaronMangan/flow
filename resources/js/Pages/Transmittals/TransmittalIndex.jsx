import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TableView from '@/Components/TableView';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head } from '@inertiajs/react';
import { EyeIcon } from '@heroicons/react/24/solid';
import { truncateText, formatDate, debounce } from "../../Utils/helpers";
import Tooltip from '@/Components/Tooltip';

export default function TransmittalIndex({ transmittals }) {
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
            selector: row => row?.status?.name || 'Unknown',
        },
        {
            name: '# Items',
            cell: (row) => {
                return (
                    <span>{row?.documents?.length || 0}</span>
                );
            }
        },
        {
            name: 'Details',
            cell: (row) => {
                return (
                    <span><Tooltip text={row?.details}>{truncateText(row?.details, 20)}</Tooltip></span>
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
        }
    ];
    return (
        <AuthenticatedLayout>
            <Head title="Transmittal Index" />
            <>
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {/* <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            
                        </div> */}
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <TableView
                                data={transmittals}
                                columns={transmittalColumns}
                                customStyles={customStyles}
                                className='rounded-lg'
                            />
                        </div>
                    </div>
                </div>
            </>
        </AuthenticatedLayout>
    );
}
