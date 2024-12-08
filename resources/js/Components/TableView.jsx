import DataTable from 'react-data-table-component';

export default function TableView ({ columns, data, className, customStyles = {}, ...props }) {
    return (
        <div {...props} className={`z-0 p-2 text-gray-900 dark:text-gray-100 ` + className}>
            <DataTable
                columns={columns}
                data={data}
                className='z-0'
                customStyles={customStyles}
            />
        </div>
    );
}