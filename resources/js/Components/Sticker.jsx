export default function Sticker({type, value, className = '', ...props}) {
    const badgeColour = (type) => {
        switch (type) {
            case 'secondary':
                return 'bg-gray-500 text-white'
            case 'info':
                return 'bg-blue-300 text-black'
            case 'warning':
                return 'bg-yellow-300 text-black'
            case 'success':
                return 'bg-green-700 text-white'
            case 'danger':
                return 'bg-red-300 text-black'
            default:
                return 'bg-purple-600 text-white';
        }
    }
    return (
        <div
            {...props}
            className={
                `block text-sm px-3 uppercase py-1 font-bold rounded-xl font-sm dark:text-gray-300 ` +
                badgeColour(type)
            }
        >
            {value ? value : 'N/A'}
        </div>
    );
}