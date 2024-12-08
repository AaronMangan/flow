import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataView from '@/Components/DataView';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);

export default function Dashboard({ auth, data }) {
  const [pageData, setPageData] = useState(data);

  // useEffect(() => {

  // }, [data]);
  return (
    <AuthenticatedLayout>
      <Head title={'View History'} />
      <div className="w-full max-w-4xl mx-auto my-4 overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="px-8 py-6 text-white bg-gray-800">
          <h2 className="text-2xl font-semibold">Activity Details</h2>
          <p className="text-sm">Detailed view of the changes made to this object.</p>
        </div>
        <div className="px-6 py-8 space-y-6">

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 text-white bg-gray-800 rounded-full">
              <span className="text-xl font-semibold">{pageData?.user?.name[0]}</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{pageData?.user?.name || 'System'}</h3>
              <p className="text-sm text-gray-500">{pageData.event}</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">{dayjs(pageData?.updated_at).fromNow()}</p>
        </div>

        <div className="p-4 rounded-md shadow-md bg-gray-50">
          <p className="font-semibold text-gray-800">Change Summary:</p>
          <DataView data={JSON.parse(pageData.data)} />
        </div>

        {/* Detailed Log Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-8 h-8 text-white bg-gray-800 rounded-full">
              <span className="text-xs font-semibold">1</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Object Name</p>
              <p className="text-lg font-medium text-gray-800">{pageData.model_name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-8 h-8 text-white bg-gray-800 rounded-full">
              <span className="text-xs font-semibold">2</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Event</p>
              <p className="text-lg font-medium text-gray-600">{pageData?.event || 'modified'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-8 h-8 text-white bg-gray-800 rounded-full">
              <span className="text-xs font-semibold">3</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Change Timestamp</p>
              <p className="text-lg font-medium text-gray-600">{dayjs(pageData.created_at).format('DD/MM/YYYY h:m:s a')}</p>
            </div>
          </div>

          {/* <!-- Optional: Change Description/Notes --> */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-8 h-8 text-white bg-gray-800 rounded-full">
              <span className="text-xs font-semibold">4</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Change Description</p>
              <p className="text-lg text-gray-600">{pageData?.note}</p>
            </div>
          </div>
        </div>

        {/* <!-- Action Button (Restore or Undo Change) --> */}
        <div className="mt-8">
          <button className="px-4 py-2 text-white transition-all transform bg-gray-800 rounded-lg shadow-md hover:bg-indigo-700 hover:scale-105">
            Restore to Previous Value
          </button>
        </div>

      </div>

    </div>
    </AuthenticatedLayout>
  );
}