// Import necessary components and React
import { Footer } from '@/components/shared/Footer';
import NavbarWithBg from '@/components/shared/NavbarWithbg';
import React from 'react';

// Define the main Terms and Conditions component as a functional component
const TermsAndConditionModal: React.FC = () => {
  // Define an array of terms and conditions objects
  // Each object contains a title and an array of details
  const termsAndConditions = [
    {
      title: 'Acceptance of Terms',
      details: [
        'By accessing or using Probe STEM, you agree to comply with these Terms and Conditions, which govern your use of the platform.',
        'If you do not agree, you may not use the platform.'
      ]
    },
    {
      title: 'Eligibility',
      details: [
        'Users must be 18 years or older or have parental/guardian consent to join.',
        'Registration requires accurate and up-to-date information.'
      ]
    },
    {
      title: 'User Responsibilities',
      details: [
        'You are responsible for the content you share, ensuring it is accurate, lawful, and aligns with Probe STEM’s mission.',
        'Protect your login credentials. Probe STEM is not liable for unauthorized access resulting from any cybercrime.'
      ]
    },
    {
      title: 'Prohibited Activities',
      details: [
        'Uploading plagiarized, illegal, defamatory, or offensive material.',
        'Engaging in fraudulent activities, spamming, or unauthorized advertising.',
        'Using the platform to infringe on intellectual property rights.'
      ]
    },
    {
      title: 'Intellectual Property',
      details: [
        'Users retain ownership of their content but grant Probe STEM a non-exclusive, worldwide, royalty-free license to use, display, and share it within the platform.',
        'Probe STEM’s logo, name, and platform design are proprietary and must not be used without prior permission.'
      ]
    },
    {
      title: 'Content Review and Removal',
      details: [
        'Probe STEM reserves the right to review, edit, or remove content that violates these terms or does not align with its mission.',
        'Deleted content cannot be restored once removed.'
      ]
    },
    {
      title: 'Privacy',
      details: [
        'User data will be handled in accordance with the Probe STEM Privacy Policy, ensuring confidentiality and secure processing.'
      ]
    },
    {
      title: 'Disclaimer of Warranties',
      details: [
        'Probe STEM provides the platform “as is” without warranties of any kind, including accuracy, reliability, or availability.',
        'Users bear the risk of using the platform for research or collaborations.'
      ]
    },
    {
      title: 'Limitation of Liability',
      details: [
        'Probe STEM is not liable for direct, indirect, incidental, or consequential damages resulting from the use or inability to use the platform.',
        'Users are responsible for the outcomes of their collaborations.'
      ]
    },
    {
      title: 'Termination',
      details: [
        'Probe STEM may suspend or terminate accounts for violating these terms without prior notice.',
        'Users may deactivate their accounts at any time, though previously shared content may remain on the platform.'
      ]
    },
    {
      title: 'Changes to Terms',
      details: [
        'Probe STEM reserves the right to update these terms at any time. Continued use of the platform after changes indicates acceptance of the revised terms.'
      ]
    }
  ];

  return (
    // Main container with white background
    <div className="bg-white flex-col items-center justify-center">
      {/* Navigation bar component with background */}
      <NavbarWithBg />
      
      {/* Terms and conditions content container with shadow and rounded corners */}
      <div className="bg-white rounded-xl w-full shadow-xl my-7">
        {/* Header section with title */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#472014]">Probe STEM Terms and Conditions</h2>
        </div>

        {/* Main content section */}
        <div className="p-6 space-y-6">
          {/* Effective date and introduction text */}
          <p className="text-gray-700 mb-4">
            Effective from 30th November, 2024: By accessing or using Probe STEM, you agree to our Terms and Conditions, which govern your interactions with the platform.
          </p>

          {/* Map through terms and conditions array to create individual sections */}
          {termsAndConditions.map((term, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              {/* Section title */}
              <h3 className="text-xl font-semibold text-[#472014] mb-3">{term.title}</h3>
              {/* List of details for each section */}
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {term.details.map((detail, detailIndex) => (
                  <li key={detailIndex}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}

          {/* Platform mission section with different styling */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">Platform Mission</h3>
            <p className="text-blue-700">
              Probe STEM is dedicated to fostering collaboration between students, faculty, and industry experts through innovation and research.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer component */}
      <Footer />
    </div>
  );
};

// Export the component as default
export default TermsAndConditionModal;