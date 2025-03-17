import { useEffect, useRef, useState } from "react";
import { TrashIcon, PlusIcon, CubeTransparentIcon, EyeIcon } from "@heroicons/react/24/solid";
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";
import Modal from "./Modal";
import TextInput from "./TextInput";
import axios from "axios";
import { toast } from "react-toastify";
import TableView from "./TableView";
import Checkbox from "./Checkbox";
import PrimaryButton from "./PrimaryButton";

const ButtonList = ({ id, className, valuesCallback, value }) => {
    const [showAddDocument, setShowAddDocument] = useState(false);
    const [documentList, setDocumentList] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState(value || []);
    const [search, setSearch] = useState("");

    const debounceTimer = useRef(null);

    // Debounced Search
    useEffect(() => {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            axios
                .get(route("api.document-list", { search }))
                .then((res) => setDocumentList(res?.data?.data))
                .catch(() => toast.error("An error occurred loading documents"));
        }, 500);
    }, [search]);

    // Update Parent When Selection Changes
    useEffect(() => {
        valuesCallback({ [id]: selectedDocuments });
    }, [selectedDocuments]);

    // Select All Documents
    const selectAllColumns = (checked) => {
        if (checked) {
            setSelectedDocuments(documentList.map((doc) => doc.id));
        } else {
            setSelectedDocuments([]);
        }
    };

    // Select Individual Document
    const selectSingleDocument = (checked, docId) => {
        setSelectedDocuments((prev) =>
            checked ? [...prev, docId] : prev.filter((id) => id !== docId)
        );
    };

    // Remove Item
    const removeItem = (docId) => {
        setSelectedDocuments((prev) => prev.filter((id) => id !== docId));
    };

    // Table Columns
    const columns = [
        {
            name: (
                <div className="px-2">
                    <Checkbox
                        onChange={(e) => selectAllColumns(e.target.checked)}
                        checked={selectedDocuments.length === documentList.length}
                        className="px-1"
                    />
                </div>
            ),
            cell: (row) => (
                <div className="px-2">
                    <Checkbox
                        onChange={(e) => selectSingleDocument(e.target.checked, row.id)}
                        checked={selectedDocuments.includes(row.id)}
                        className="px-1"
                    />
                </div>
            ),
            width: "75px",
        },
        {
            name: "Document Number",
            selector: (row) => row.document_number,
            sortable: true,
        },
        {
            name: "Document Title",
            selector: (row) => row.name,
            sortable: true,
            width: "75%",
        },
    ];

    useEffect(() => {
        if (value?.length && value !== selectedDocuments) {
            setSelectedDocuments(value);
        }
    }, [value])

    return (
        <div className="w-full py-4 bg-white">
            {/* Add Button */}
            <SecondaryButton onClick={() => setShowAddDocument(true)} className="flex items-center mb-4">
                <PlusIcon className="w-4 h-4 mr-2" /> Add
            </SecondaryButton>

            {/* Document List */}
            <div className={`space-y-4 ${className}`}>
                {selectedDocuments.length > 0 ? (
                    selectedDocuments.map((docId) => {
                        const docData = documentList.find((doc) => doc.id === docId);
                        return (
                            <div key={docData?.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                                <div className="w-full">
                                    <div className="px-2">
                                        <div className="flex items-center">
                                            <span className="pr-1 font-semibold">{docData?.document_number || "N/A"}</span>
                                            <span className="font-semibold">{" - Rev: " + (docData?.revision?.code || "N/A")}</span>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-600">{docData?.name || "No Name Available"}</div>
                                    </div>
                                </div>
                                <PrimaryButton size="icon" variant="secondary" onClick={() => alert("To Be Completed")}>
                                    <EyeIcon className="w-4 h-4 text-white" />
                                </PrimaryButton>
                                <DangerButton variant="destructive" size="icon" onClick={() => removeItem(docData?.id)} className="ml-2">
                                    <TrashIcon className="w-4 h-4" />
                                </DangerButton>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex items-center justify-center p-3 bg-white rounded-lg">
                        <CubeTransparentIcon className="w-4 h-4 mr-2 text-gray-500" />
                        <div className="text-gray-500">No Items</div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal show={showAddDocument} onClose={() => setShowAddDocument(false)} maxWidth="5xl">
                <div className="w-full px-4 py-4">
                    <TextInput
                        type="text"
                        id="search"
                        placeholder="Enter search term..."
                        value={search}
                        className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-full px-4 py-4">
                    <TableView columns={columns} data={documentList} />
                </div>
                <div className="w-full px-4 py-4">
                    <PrimaryButton>
                        <PlusIcon className="w-4 h-4 mr-2" /> Add
                    </PrimaryButton>
                </div>
            </Modal>
        </div>
    );
};

export default ButtonList;
