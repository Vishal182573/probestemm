import { Footer } from '@/components/shared/Footer';
import NavbarWithBg from '@/components/shared/NavbarWithbg';
import React from 'react';

const ProbeStemPolicyModal: React.FC = () => {
  const policyCategories = [
    {
      title: 'User Verification and Project Approval',
      description: 'Probe STEM prioritizes platform integrity through careful verification of user profiles and project submissions.',
      details: [
        'Faculty member details are verified before profile approval',
        'Industry projects undergo admin review before publication',
        'Students\' credentials are not formally verified',
        'Users are responsible for assessing collaborator credibility'
      ]
    },
    {
      title: 'Liability Disclaimer',
      description: 'The platform disclaims responsibility for financial losses or misuse of research resources.',
      details: [
        'No liability for financial losses from fraud or misrepresentation',
        'Not responsible for misuse of research data or intellectual property',
        'Users must conduct due diligence in collaborations'
      ]
    },
    {
      title: 'Content and Collaboration Guidelines',
      description: 'Maintaining high standards of academic integrity and professional discourse.',
      details: [
        'Only original, properly cited research allowed',
        'Respectful and professional communication',
        'Constructive problem-solving encouraged',
        'Discriminatory or offensive content prohibited'
      ]
    },
    {
      title: 'Privacy and Data Protection',
      description: 'Committed to protecting user data and intellectual property.',
      details: [
        'Compliance with international data protection laws (GDPR)',
        'Minimal data collection',
        'No third-party data sharing without consent',
        'Respect for intellectual property rights'
      ]
    },
    {
      title: 'Inclusivity and Diversity',
      description: 'Fostering a global, accessible platform for STEM collaboration.',
      details: [
        'Equal access to opportunities',
        'Promotion of diversity in STEM',
        'Sensitivity to cultural differences',
        'Accessibility for users with disabilities'
      ]
    }
  ];

  return (
    <div className="bg-white flex-col items-center justify-center">
        <NavbarWithBg/>
      <div className="bg-white rounded-xl w-full shadow-xl my-7">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#472014]">Probe STEM Platform Policies</h2>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <p className="text-gray-700 mb-4">
            Effective from 1st November, 2024: By using Probe STEM, you agree to our User Agreement 
            and Professional Privacy Policies, which govern your platform interactions.
          </p>

          {policyCategories.map((category, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-[#472014] mb-3">{category.title}</h3>
              <p className="text-gray-600 mb-3">{category.description}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {category.details.map((detail, detailIndex) => (
                  <li key={detailIndex}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">Platform Mission</h3>
            <p className="text-blue-700">
              Probe STEM is dedicated to fostering collaboration between students, 
              faculty, and industry experts through innovation and research.
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ProbeStemPolicyModal;