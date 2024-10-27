/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin, FaYoutube, FaGoogle } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { Modal } from "./Modal";
import { LOGO } from "../../../public";

export const Footer: React.FC = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="bg-gradient-to-b from-white to-[#f8f4f1] text-[#472014] border-t-[1px] border-[#472014]">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-caveat text-2xl font-bold text-[#c1502e] mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center hover:text-[#c1502e] transition-colors">
                  <MdEmail className="mr-3 text-[#c1502e]" size={20} />
                  <a href="mailto:info@probestem.com">sarita@iitmandi.ac.in</a>
                </li>
                <li className="flex items-center hover:text-[#c1502e] transition-colors">
                  <MdPhone className="mr-3 text-[#c1502e]" size={20} />
                  <a href="tel:+11234567890">+91 -1905-237928</a>
                </li>
                <li className="flex items-start">
                  <MdLocationOn className="mr-3 text-[#c1502e] mt-1" size={20} />
                  <span>School of Mathematical and Statistical Sciences, Indian Institute of Technology - Mandi<br />Himachal Pradesh 175001, India</span>
                </li>
              </ul>
            </div>

            {/* Quick Links and Pages Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-8">
                {/* Quick Links Column */}
                <div>
                  <h3 className="font-caveat text-2xl font-bold text-[#c1502e] mb-6">Quick Links</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="hover:text-[#c1502e] transition-colors block">
                        Student Profiles
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#c1502e] transition-colors block">
                        Industry Profiles
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#c1502e] transition-colors block">
                        Professor Profiles
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Pages Column */}
                <div>
                  <h3 className="font-caveat text-2xl font-bold text-[#c1502e] mb-6">Pages</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="hover:text-[#c1502e] transition-colors block">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#c1502e] transition-colors block">
                        Discussion Forum
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#c1502e] transition-colors block">
                        Webinars
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#c1502e] transition-colors block">
                        Blogs
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#c1502e] transition-colors block">
                        Projects
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#c1502e] transition-colors block">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Connect With Us */}
            <div className="space-y-4">
              <h3 className="font-caveat text-2xl font-bold text-[#c1502e] mb-6">Connect With Us</h3>
              <div className="grid grid-cols-3 gap-4">
                {[FaTwitter, FaInstagram, FaFacebook, FaLinkedin, FaYoutube, FaGoogle].map(
                  (Icon, index) => (
                    <a
                      key={index}
                      href="#"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-[#f8f4f1] hover:bg-[#c1502e] text-[#472014] hover:text-white transition-all duration-300"
                    >
                      <Icon size={24} />
                    </a>
                  )
                )}
              </div>
            </div>

            {/* Logo Section */}
            <div className="space-y-4 flex flex-col items-center lg:items-start">
              <Image
                src={LOGO}
                alt="Probe STEM Logo"
                width={400}
                height={70}
                className="mb-4"
              />
              <p className="text-lg text-[#f0d80f] text-center lg:text-left">
                Empowering collaborative STEM research and projects.
              </p>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-[#c1502e]/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm">&copy; {new Date().getFullYear()} Probe STEM. All rights reserved.</p>
                <p className="text-xs text-[#472014]/70 mt-1">Designed by clay web design</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-6">
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-sm hover:text-[#c1502e] transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setIsTermsOpen(true)}
                  className="text-sm hover:text-[#c1502e] transition-colors"
                >
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <Modal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        title="Privacy Policy"
      >
        <div className="prose text-black">With effective from 1st November, 2024
By using our services, you agree to abide by our User Agreement. Your use of the services is also governed by our Professional Privacy Policies, which outline the standards of conduct expected while using the platform. Additionally, your personal data is handled in accordance with our Privacy Policy and Cookie Policy, which detail how we collect, use, share, and store your information.

Probe STEM, the online research platform is focused on fostering collaboration between students, faculty, and industry experts. Its policies and guidelines are tailored to reflect the platform mission of bridging academia and industry through innovation and research. 


Below are customized policies for Probe STEM:
1.  User Verification and Project Approval Policy
At Probe STEM, we prioritize the integrity of the platform by carefully verifying user profiles and project submissions. When faculty members are registered as users, their details are verified by our team before their profiles are approved and visible on the website. Similarly, industry projects are subject to review and approval by the admin before they are published, ensuring the relevance and legitimacy of the projects.
However, as the platform grows, it may become increasingly challenging to conduct thorough verifications for all users and projects. Therefore, we encourage all users to exercise due diligence when engaging in collaborations.
Please note:
    • Students’ credentials will not be subject to formal verification.
    • Users are responsible for assessing the credibility of their collaborators and ensuring that proper agreements are in place before entering into partnerships.
This policy emphasizes shared responsibility among all users to maintain the platform trust and reliability.
2. Liability Disclaimer Policy
Probe STEM is a platform designed to facilitate collaboration and innovation in research. While the platform provides a space for academic and industry interactions, it is not responsible for any financial losses incurred by any party due to misrepresentation, fraudulent activities, or any other deceptive practices by users.
Probe STEM disclaims any liability for:
    • Financial losses resulting from fraud, cheating, or false representations made by users.
    • Misuse of research data, intellectual property, or any collaborative efforts that lead to financial damage.
3. Financial Responsibility Policy for Collaborative Projects
Once a project is assigned on Probe STEM, both parties are required to follow their respective institution’s financial regulations, including the proper paperwork and official channels for receiving funds. Probe STEM will not be held responsible for any financial discrepancies, mismanagement of funds, or failures to adhere to institutional norms.
    • All financial transactions and agreements between collaborators must be managed directly through the appropriate institutional procedures, and users are expected to ensure compliance with their organization’s financial policies.
4.  Content Moderation and Guidelines
    • Research Integrity: Users must uphold academic integrity by sharing only original research, properly citing sources, and avoiding plagiarism or falsified data.
    • Professional and Academic Discourse: Discussions should remain respectful and professional, centered on constructive problem-solving and academic collaboration.
    • Collaborative Problem-Solving: Content should contribute to the platform’s mission of collaborative research. Users are encouraged to share ideas, feedback, and innovative approaches openly.
    • Prohibited Content: Discriminatory, offensive, or irrelevant posts, as well as content promoting personal agendas (e.g., self-promotion without academic merit) will not be tolerated. 
5.  Policy on Content Alignment with Mission
Probe STEM is dedicated to fostering innovation through collaboration between students, faculty, and industry experts. To maintain the integrity of this mission, the platform reserves the right to remove any content, including comments, blogs, or research, that does not align with its core objectives.
This includes, but is not limited to:
    • Content that is irrelevant to the research-focused goals of the platform.
    • Posts that promote misinformation, unverified data, or unsupported claims.
    • Submissions that detract from the collaborative spirit of academic and industry partnerships.
The removal of such content ensures that Probe STEM remains a space where productive, research-driven discussions can thrive.

6. Privacy and Data Protection
    • Research Data: Any shared data or findings must comply with data privacy regulations, including those related to proprietary research, industry collaborations, or sensitive information.
    • Personal Information: Protecting user privacy is a priority. Probe STEM will collect only necessary data, and user information will not be shared with third parties without consent.
    • Intellectual Property: Users must respect the intellectual property rights of others, especially when dealing with industry partnerships or unpublished research.
7. Safety and Security
    • Harassment-Free Environment: Probe STEM is committed to creating a safe space for research discussion. Bullying, harassment, or any form of intimidation will result in immediate action.
    • Reporting Mechanism: Users can report unethical behavior, violations of academic integrity, or any form of misconduct at info@probestem.com
 These reports will be handled transparently.
    • Research Security: Industry collaborations may involve confidential information. Users must respect NDAs or similar agreements and avoid sharing restricted content in public forums.
8. Inclusivity and Diversity
    • Equal Access to Opportunities: Probe STEM encourages participation from all backgrounds. It actively seeks to promote diversity by engaging with underrepresented groups in STEM fields.
    • Global Collaboration: The platform is designed to foster international collaboration. Users should be sensitive to cultural differences in communication styles and research approaches.
    • Accessibility: The platform will be accessible to users with disabilities, ensuring an inclusive experience for all contributors.
9. User Behaviour and Accountability
    • Collaboration Etiquette: Users are expected to engage in meaningful collaboration, offering constructive feedback, sharing expertise, and being open to new ideas. Discouraging or dismissive behaviour will not be tolerated.
    • Professional Conduct: Given the focus on bridging academia and industry, professionalism is paramount. Users must maintain a standard of conduct reflecting the values of both academic institutions and industry stakeholders.
    • Consequences: Violations of community guidelines or unethical research behavior will result in account suspension, warnings, or permanent bans.
10. Transparency and Accountability of the Platform
    • Research Ethics Review: Any project shared on Probe STEM should comply with institutional or industry research ethics guidelines. This includes properly managing conflicts of interest or industry-sponsored research.
    • Content Review: Moderators will review flagged content for violations of the platform’s policies. Users may appeal content removal decisions with a structured review process.
    • Feedback Channels: Probe STEM will regularly collect feedback from users to ensure the platform evolves to meet the needs of the academic and industry communities.
11. Advertising and Monetization
    • Educational Sponsorship: Any advertising on the platform will be educational and aligned with the mission of facilitating STEM research and innovation. No misleading or irrelevant ads will be allowed.
    • Sponsored Projects: If a project is funded or sponsored by an industry partner, this relationship must be disclosed, maintaining transparency about funding sources.
    • No Data Exploitation: User data will not be sold or misused for advertising purposes. Any form of monetization involving user data will require clear consent.
12. Legal Compliance
    • Data Protection Laws: The platform will comply with international data protection laws such as GDPR and other relevant regulations in regions where the platform operates.
    • Copyright Compliance: Users are responsible for ensuring that all content uploaded adheres to copyright laws. If any copyrighted content is found, it will be promptly removed.
    • Dispute Resolution: Disputes regarding research ownership, plagiarism, or misconduct will be handled through a formal review process with the platform ethics committee.
13. Cookie Policy
When you use our services, we collect information such as the URLs of the sites you visit before and after, the time of your visit, and details about your device and network (e.g., IP address, browser, operating system). If you access the services from a mobile device, we may also receive location data based on your phone settings, and we will request your permission before using GPS to determine your precise location.
All users are encouraged to conduct due diligence when entering into partnerships or agreements with others on the platform. 


These guidelines are aligned with the mission of Probe STEM, emphasizing collaboration, research integrity, and professional growth, while creating a safe and inclusive environment for all participants in academia and industry.
        </div>
      </Modal>

      <Modal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        title="Terms of Service"
      >
        <div className="prose text-black"> ex
        </div>
      </Modal>
    </>
  );
};