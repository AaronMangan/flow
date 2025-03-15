import { useState, useEffect } from "react";
import { TrashIcon, PlusIcon, CubeTransparentIcon, EyeIcon } from '@heroicons/react/24/solid'
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";
import Modal from "./Modal";
import TextInput from "./TextInput";
import axios from 'axios';
import { toast } from 'react-toastify';
import TableView from "./TableView";
import Checkbox from "./Checkbox";
import PrimaryButton from "./PrimaryButton";

const ButtonList = ({ className }) => {
    const [showAddDocument, setShowAddDocument] = useState(false);
    const [documentList, setDocumentList] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState([]);

    let debounceTimer;
    const [search, setSearch] = useState('');

    const debounceSearch = () => {
        clearTimeout(debounceTimer);

        // Set a new timeout
        debounceTimer = setTimeout(() => {
            axios.get(route('api.document-list', {search: search})).then(res => {
                setDocumentList(res?.data?.data)
            }).catch(err => {
                toast.error('An error occurred loading documents, please try again...')
            });
        }, 500);
    }

    /**
     * Closes the modal
     */
    const closeModal = () => {
        setShowAddDocument(false);
    }

    // Function to add a new item
    const addItem = () => {
        const newItem = {
            id: Date.now(),
            title: `Item ${items.length + 1}`,
            description: "Newly added item",
        };
        setItems([...items, newItem]);
    };
    
    const selectAllColumns = (value) => {
        // Checkbox is checked.
        if (value) {
            setSelectedDocuments(null)
            setSelectedDocuments([])
            setSelectedDocuments(documentList.map(doc => {
                return doc?.id
            }));
        } else {
            setSelectedDocuments(null)
            setSelectedDocuments([])
        }
    }

    const selectSingleDocument = (e, id) => {
        if (e) {
            setSelectedDocuments([...selectedDocuments, id])
        } else {
            setSelectedDocuments(selectedDocuments.filter(x => x != id))
        }
    }

    /**
     * Columns for the add document list.
     */
    const columns = [
        {
            name: (<div className="px-2"><Checkbox onChange={(e) => {
                selectAllColumns(e.target.checked)
            }} className="px-1" /></div>),
            cell: (row) => {return (<div className="px-2"><Checkbox onChange={(e) => selectSingleDocument(e.target.checked, row?.id)} checked={selectedDocuments.includes(row?.id)} className="px-1" /></div>)},
            width: '75px'
        },
        {
          name: 'Document Number',
          selector: row => row?.document_number,
          sortable: true,
          left: true
        },
        {
          name: 'Document Title',
          selector: row => row.name,
          width: '75%',
          sortable: true,
          left: true
        },
    ];

    // Function to remove an item
    const removeItem = (id) => {
        const filteredIds = selectedDocuments.filter((i) => i !== id);
        setSelectedDocuments(null)
        setSelectedDocuments(filteredIds)
        const filtered = documentList.filter((doc) => doc.id !== id);
        setDocumentList(null);
        setDocumentList(filtered);
    };

    useEffect(() => {
        debounceSearch()
    }, [search]);

    return (
        <div className="w-full py-4 mx-auto bg-white">
            {/* Add Button */}
            <SecondaryButton onClick={() => setShowAddDocument(true)} className="flex items-center mb-4">
                <PlusIcon className="w-4 h-4 mr-2" />Add
            </SecondaryButton>
            {/* Description List */}
            <dl className={`space-y-4 ` + className}>
                {selectedDocuments && selectedDocuments.length > 0 && selectedDocuments.map((item) => {
                    const docData = documentList?.find(x => x.id === item)
                    return (
                        <div key={docData?.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                            <div className="w-full">
                                {/* <dl className="grid grid-cols-1 gap-1">
                                    <div className="grid w-full grid-cols-2">
                                        <dt className="font-semibold">{docData?.document_number || ''}</dt>
                                        <dd className="text-sm text-right text-gray-500"><span className="font-semibold">Revision: </span>{docData?.revision?.code}</dd>
                                    </div>
                                    <dd className="text-sm text-gray-600">{docData?.name || ''}</dd>
                                </dl> */}
                                <div className="px-2">
                                    <div className="flex items-center justify-start">
                                        <span className="pr-1 font-semibold">{docData?.document_number || 'N/A'}</span>
                                        <span className="font-semibold">{' - Rev: ' + docData?.revision?.code || 'N/A'}</span>
                                    </div>

                                    {/* Name Below */}
                                    <div className="mt-1 text-sm text-gray-600">
                                        {docData?.name || 'No Name Available'}
                                    </div>
                                </div>
                            </div>
                            <PrimaryButton
                                size="icon"
                                variant="secondary"
                                onClick={() => alert('To Be Completed')}
                                className=""
                            >
                                <EyeIcon className="w-4 h-4 text-white"/>
                            </PrimaryButton>
                            <DangerButton
                                variant="destructive"
                                size="icon"
                                onClick={() => removeItem(docData?.id)}
                                className="ml-2"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </DangerButton>
                        </div>
                    )
                })}
                {(!selectedDocuments || selectedDocuments.length <= 0) && (
                    <div className="flex items-center justify-center p-3 bg-white rounded-lg">
                        <CubeTransparentIcon className="w-4 h-4 mr-2 text-center text-gray-500" />
                        <div className="text-center text-gray-500">No Items</div>
                    </div>
                )}
            </dl>
            <Modal show={showAddDocument} onClose={closeModal} maxWidth={'5xl'} >
                <div className='w-full px-4 py-4 overflow-y'>
                    <TextInput
                        type="text"
                        id="search"
                        placeholder="Enter search term..."
                        name="search"
                        value={search}
                        className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        onChange={(e) => {
                            // debounceSearch(e.target.value)
                            setSearch(e.target.value)
                        }}
                    />
                </div>
                <div className='w-full px-4 py-4 overflow-y'>
                    <TableView
                        columns={columns}
                        data={documentList}
                    />
                </div>
                <div className='w-full px-4 py-4 overflow-y'>
                    <PrimaryButton><PlusIcon className="w-4 h-4 mr-2" />Add</PrimaryButton>
                </div>
            </Modal>
        </div>
    );
};

export default ButtonList;
