import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function PublicLayout({ children, footerText = '' }) {
    return (
        <>
            <div className="flex flex-col items-center w-full min-h-screen px-4 pt-4 bg-gray-100 sm:justify-start sm:pt-0 dark:bg-gray-900">
                <div className='pt-6'>
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 text-gray-500 fill-current" />
                    </Link>
                </div>
    
                <div className="w-full py-4 mx-2 mt-6 overflow-hidden bg-white rounded-md shadow-md dark:bg-gray-800">
                    {children}
                </div>
                <div className='py-2 font-light text-gray-600'>
                    <small>
                        <em>{footerText || ''}</em>
                    </small>
                </div>
            </div>
        </>
    );
}
