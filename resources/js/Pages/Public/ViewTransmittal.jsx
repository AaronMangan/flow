import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import dayjs from 'dayjs';

export default function ViewTransmittal({ transmittal, expiry_days = 14 }) {
    return (
        <PublicLayout footerText={'Transmittals only remain valid for ' + expiry_days + ' days from the sent date. If you require retransmission, please contact the sender.'}>
            <Head title="View Transmittal" />
            <>
                <div className="w-full px-3 pt-6">
                    <div className="w-full mx-auto sm:px-6 lg:px-8">
                        <div className="w-full overflow-hidden bg-white">
                            <div className='py-2'>
                                <p className="pb-4 text-xl font-bold">
                                    Transmittal: {transmittal?.id.toString().padStart(6, '0')}
                                    <br/><small className='text-xs font-normal text-gray-600'><span className='mr-1 font-semibold'>Reason:</span>{transmittal?.reason || 'Issued For Information'}</small>
                                    <br/><small className='text-xs font-normal text-gray-600'><span className='mr-1 font-semibold'>Issued:</span>{dayjs(transmittal?.sent_at).format('DD/MM/YYYY')}</small>
                                </p>
                                <p className='pt-3 text-gray-700'><em>{transmittal?.details}</em></p>
                            </div>
                            { transmittal && transmittal.documents && (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                                        <thead>
                                            <tr className="bg-gray-100 border-b">
                                                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border-r">#</th>
                                                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border-r">Rev.</th>
                                                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border-r">Title</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transmittal?.documents?.map((item, rowIndex) => (
                                                <tr key={rowIndex} className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-gray-700 border-r">{item?.document_number}</td>
                                                    <td key={item.document_number} className="px-4 py-3 text-gray-600 border-r">{item?.revision?.code || item.revision_id}</td>
                                                    <td key={'name_of_' + item?.id || rowIndex} className="px-4 py-3 text-gray-600">{item.name}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        </table>
                                    </div>

                                    <div className='flex inline-flex items-center justify-between w-full px-3 py-3 my-3'>
                                        <SecondaryButton className="mr-2">Download</SecondaryButton>
                                        <PrimaryButton>Acknowledge & Download</PrimaryButton>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </>
        </PublicLayout>
    );
}
