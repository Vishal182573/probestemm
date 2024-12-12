import { Footer } from '@/components/shared/Footer';
import NavbarWithBg from '@/components/shared/NavbarWithbg';
import React from 'react';

const ProbeStemPolicyModal: React.FC = () => {
  const policyCategories = [
    {
      title: 'User Verification',
      description: 'Probe STEM prioritizes platform integrity through careful verification of user profiles.',
      details: [
        'Faculty member and industry details are verified before profile approval',
        "Students' credentials are not formally verified",
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
      title: 'Community Guidelines',
      description: 'Maintaining professionalism and respect within the community.',
      details: [
        'Engage with fellow users courteously and constructively',
        'Avoid discriminatory, offensive, or inappropriate language and behavior',
        'Acknowledge and credit others’ work appropriately'
      ]
    },
    {
      title: 'Content Policies',
      description: 'Ensuring uploaded content aligns with Probe STEM’s mission.',
      details: [
        'All content must foster innovation and collaboration in STEM',
        'Prohibited content includes plagiarized materials, misinformation, and unrelated political or religious propaganda',
        'Probe STEM reserves the right to review, edit, or delete content violating its policies'
      ]
    },
    {
      title: 'Collaboration Policies',
      description: 'Encouraging fair and inclusive collaboration practices.',
      details: [
        'Encourage open and inclusive discussions',
        'Credit all contributors in collaborative projects fairly',
        'Resolve conflicts amicably; report unresolved disputes to the Probe STEM team'
      ]
    },
    {
      title: 'User Conduct',
      description: 'Outlining expectations for responsible platform usage.',
      details: [
        'Refrain from spamming, trolling, or promoting non-STEM-related services',
        'Use the platform responsibly to build meaningful connections and collaborations',
        'Probe STEM reserves the right to suspend or ban users for repeated violations'
      ]
    },
    {
      title: 'Research Integrity',
      description: 'Adherence to ethical research practices is mandatory.',
      details: [
        'Transparency, honesty, and accountability in research are required',
        'All shared research must comply with academic and industrial standards'
      ]
    },
    {
      title: 'Feedback and Reporting',
      description: 'Encouraging users to contribute to the platform’s improvement.',
      details: [
        'Provide feedback for platform improvement',
        'Report policy violations or inappropriate behavior via probestem2024@gmail.com'
      ]
    },
    {
      title: 'Disclaimer',
      description: 'Responsibilities and limitations of Probe STEM’s role.',
      details: [
        'Probe STEM is a facilitator and does not guarantee the accuracy or success of projects',
        'Users are responsible for their own collaborations and content'
      ]
    }
  ];

  return (
    <div className="bg-white flex-col items-center justify-center">
      <NavbarWithBg />
      <div className="bg-white rounded-xl w-full shadow-xl my-7">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#472014]">Probe STEM Platform Policies</h2>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <p className="text-gray-700 mb-4">
            Effective from 30th November, 2024: By using Probe STEM, you agree to our User Agreement and Professional Privacy Policies, which govern your platform interactions.
          </p>
          <p className="text-gray-700 mb-4">
          Probe STEM takes reasonable precautions to ensure the security and integrity of data hosted on its platform. However, in the event of a cybercrime or data breach, Probe STEM shall not be held responsible for any loss, theft, or corruption of user data. Users are advised to maintain backups of their work and implement their own security measures to safeguard against potential risks.
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
              Probe STEM is dedicated to fostering collaboration between students, faculty, and industry experts through innovation and research.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProbeStemPolicyModal;
