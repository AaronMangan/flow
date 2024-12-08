export default function Badge({value, className = '', ...props}) {
    const badgeColour = (label) => {
        switch (label.toLowerCase()) {
            case 'active':
                return 'bg-blue-500 text-white'
            case 'inactive':
                return 'bg-gray-300 text-black'
            default:
                return 'bg-purple-600 text-white';
        }
    }
    return (
        <div
            {...props}
            className={
                `block text-sm px-3 py-1 font-bold rounded-xl font-sm dark:text-gray-300 ` +
                badgeColour(value)
            }
        >
            {value ? value : 'N/A'}
        </div>
    );
}