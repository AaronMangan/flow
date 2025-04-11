import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from '@/Components/Modal';

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [options, setOptions] = useState(null);
  const [promiseHandlers, setPromiseHandlers] = useState({});

  const confirm = useCallback(({ 
    title = "Confirm",
    message = "Are you sure?",
    confirmClass = "px-4 py-2 text-white bg-green-800 rounded",
    cancelClass = "px-4 py-2 bg-gray-200 rounded",
    parentClass = "px-4 py-4",
    titleClass = "text-xl font-bold text-gray-200",
    messageClass = "my-4"
  }) => {
    return new Promise((resolve, reject) => {
      setOptions({ title, message, confirmClass, cancelClass, parentClass, titleClass, messageClass });
      setPromiseHandlers({ resolve, reject });
    });
  }, []);

  const handleClose = () => {
    setOptions(null);
    setPromiseHandlers({});
  };

  const handleConfirm = () => {
    promiseHandlers.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promiseHandlers.resolve(false);
    handleClose();
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {options && (
        <Modal show={true} onClose={handleCancel}>
          <div className={options.parentClass}>
            <h2 className={options.titleClass}>{options.title}</h2>
            <p className={options.messageClass}>{options.message}</p>
            
            {/* Button Container */}
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={handleCancel} className={options.cancelClass}>Cancel</button>
              <button onClick={handleConfirm} className={options.confirmClass}>Confirm</button>
            </div>
          </div>
        </Modal>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used within ConfirmProvider");
  return context.confirm;
};
