import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TableView from '@/Components/TableView';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head } from '@inertiajs/react';
import { EyeIcon, TrashIcon, UserIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { truncateText, processMessages } from "../../Utils/helpers";
import Tooltip from '@/Components/Tooltip';
import FloatingButton from '@/Components/FloatingButton';
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import axios from 'axios';

export default function IncomingTransmittalIndex () {
    return (
        <div>
            <h2>Coming Soon!</h2>
        </div>
    );
}