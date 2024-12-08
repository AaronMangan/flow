import { useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Nav/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const success = usePage().props.success || null;
    useEffect(() => {
        // 
    }, []);
    return (
        <div className={`flex min-h-screen bg-gray-100 w-full min-w-screen dark:bg-gray-900 transition-all`}>
            {/* Sidebar */}
            <Sidebar
                className={`transition-all flex-col`}
                user={user}
            />

            {/* Main content */}
            <main className={`flex-1 pl-10 w-full mx-auto transition-all duration-300 ease-in-out`}>
                {children}
            </main>

            <ToastContainer 
                position="top-right"
                autoClose={5000}  // Duration in ms before auto-dismiss
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}
