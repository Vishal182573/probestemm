import React, { useEffect, useRef, useState } from 'react'

const DescriptionModal = ({ description, onClose }: { description?: string, onClose: () => void }) => {
    if (!description) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Technical Description</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-800">{description}</p>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="text-sm px-3 py-1 bg-[#eb5e17] text-white rounded hover:bg-[#472014] focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
};

export const TechnicalDescription = ({ description }: { description?: string }) => {
    // Create a ref to check the actual height of the text
    const [showViewMore, setShowViewMore] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);
    
    // Check if text is overflowing after component mounts
    useEffect(() => {
        if (textRef.current) {
        const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight);
        const paragraphHeight = textRef.current.clientHeight;
        // If height is more than a line, show the view more button
        setShowViewMore(paragraphHeight > lineHeight);
        }
    }, [description]);
    
    return (
        <div>
        <p ref={textRef} className="line-clamp-2">
            {description}
        </p>
        {showViewMore && (
            <button 
            onClick={() => setShowModal(true)} 
            className="text-[#eb5e17] text-sm font-medium hover:text-[#472014] mt-1 focus:outline-none"
            >
            View More
            </button>
        )}
        
        {showModal && (
            <DescriptionModal 
            description={description} 
            onClose={() => setShowModal(false)} 
            />
        )}
        </div>
    );
}
