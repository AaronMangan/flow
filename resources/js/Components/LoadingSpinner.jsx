import React from 'react';

const LoadingSpinner = ({ text, emoji = '🚀' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Spinner */}
      <div
        className="w-16 h-16 border-4 border-teal-600 border-solid rounded-full border-t-transparent animate-spin"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      
      {/* Text below spinner */}
      <div className="mt-4 text-xl font-semibold text-teal-600">
        {text || 'Hang on while we load your form! '}
        {emoji && (<span role="img" aria-label="loading" className="mr-2"> {emoji}</span>)}
      </div>
    </div>
  );
};

export default LoadingSpinner;
