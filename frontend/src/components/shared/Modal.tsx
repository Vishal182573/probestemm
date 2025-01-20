// components/shared/Modal.tsx
import { X } from 'lucide-react';

// Define the type interface for Modal component props
interface ModalProps {
  isOpen: boolean;      // Controls the visibility of the modal
  onClose: () => void;  // Function to handle modal closing
  title: string;        // Title text to display in modal header
  children: React.ReactNode; // Content to be rendered inside the modal
}

// Modal component definition using React.FC (Function Component) with ModalProps type
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Early return if modal is not open
  if (!isOpen) return null;

  return (
    // Main container with overlay positioning
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent backdrop with blur effect
          Clicking on it will close the modal */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal container with styling and size constraints
          Uses white background, rounded corners, and scrollable content */}
      <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto">
        {/* Modal header section with title and close button
            Contains border bottom for visual separation */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-[#472014]">{title}</h2>
          {/* Close button with hover effect
              Uses X icon from lucide-react */}
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-[#472014]" />
          </button>
        </div>
        
        {/* Modal content section with padding
            Renders the children props passed to the component */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};