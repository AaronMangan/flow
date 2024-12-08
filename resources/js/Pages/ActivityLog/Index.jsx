import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from 'react-data-table-component';
import dayjs from 'dayjs';
import { Inertia } from '@inertiajs/inertia';
import FilterBar from '@/Components/FilterBar';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Dashboard({ history, filters }) {
  const { data, current_page, last_page } = history;
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValues, setFilterValues] = useState({});
  const [hasMounted, setHasMounted] = useState(false);
  
  const columns = [
    {
      id: 'id',
      name: '#',
      selector: row => row.id,
      width: '5pc'
    },
    {
      id: 'name',
      name: 'Object',
      selector: row => row.model_name,
    },
    {
      id: 'object_id',
      name: 'Object Id',
      selector: row => row.model_id,
      width: '8pc'
    },
    {
      id: 'event',
      name: 'Event',
      selector: row => row.event,
      width: 'auto'
    },
    {
      id: 'data',
      name: 'Changes',
      selector: row => row?.data?.length > 250 ? row?.data?.slice(0, 250) + '...' : row?.data || 'created',
      width: '40pc'
    },
    {
      id: 'user_id',
      name: 'Made By',
      selector: row => row?.user?.name || 'N/A',
      width: '10pc'
    },
    {
      id: 'created_at',
      name: 'When',
      selector: row => {
        return dayjs(row.created_at).format('DD/MM/YYYY hh:mm:ss a')
      }
    }
  ];
  
  /**
   * Sets the values from the filter element.
   * @param {*} values 
   */
  const valuesCallback = (values) => {
    if(hasMounted && filterValues !== values) {
        handlePageChange(currentPage, values);
    }
  }

  const filterOptions = [
    {
        id: 'model',
        type: 'select',
        label: 'Model',
        endpoint: '/api/filters/models',
        className: 'w-[200px]',
        default: 'all'
    },
    {
        id: 'search',
        type: 'text',
        label: 'Search',
        className: 'w-[300px]',
        placeholder: 'Enter search'
    },
  ];

  const handlePageChange = (page, values = null) => {
    Inertia.get(`/activity-log?page=${page}`, values || filterValues, { preserveState: true });
  };

  useEffect(() => {
    if (hasMounted) {
        // Add any mounted activities here.
    } else {
        // Set the mounted flag to true after the initial render
        setHasMounted(true);
    }
  }, [currentPage, filterValues]);

  return (
    <AuthenticatedLayout>
      <Head title="Activity Log" />
      <>
        <div className="py-12">
          <div className="mx-auto max-w-8xl sm:px-6 lg:px-8">
            <FilterBar valuesCallback={valuesCallback} config={filterOptions} values={filters} className="inline-flex my-2" />
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
              <div className="p-6 text-gray-900 dark:text-gray-100">
                <DataTable
                  columns={columns}
                  data={data}
                  className='z-0'
                  onRowClicked={(row) => {
                    Inertia.get(`/activity-log/${row.id}/view`, {}, { preserveState: true });
                  }}
                />
              </div>
              {/* Pagination controls */}
              <div className="flex justify-center p-2 mt-4">
                <PrimaryButton
                  onClick={() => handlePageChange(current_page - 1)}
                  disabled={current_page === 1}
                  className="px-4 py-2 text-gray-700 bg-gray-300 rounded-l-md hover:bg-gray-400 disabled:opacity-50"
                >Previous</PrimaryButton>
                                  
                {/* Page numbers */}
                <span className="flex items-center px-4 py-2">{current_page} of {last_page}</span>
                <PrimaryButton
                    onClick={() => handlePageChange(current_page + 1, filterValues)}
                    disabled={current_page === last_page}
                    className="px-4 py-2 text-gray-700 bg-gray-300 rounded-r-md hover:bg-gray-400 disabled:opacity-50"
                >Next</PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </>
    </AuthenticatedLayout>
  );
}