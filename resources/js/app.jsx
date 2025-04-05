import '../css/app.css';
import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { ConfirmProvider } from './Utils/useConfirm';

const appName = import.meta.env.VITE_APP_NAME || 'Flow';

createInertiaApp({
    title: (title) => `${title || appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <ConfirmProvider><App {...props} /></ConfirmProvider>);
            return;
        }

        createRoot(el).render(
            <ConfirmProvider>
                <App {...props} />
            </ConfirmProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
