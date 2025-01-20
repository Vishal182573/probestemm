// Enable client-side functionality in Next.js
"use client"

// Import necessary dependencies
import React from 'react';
import { NextPage } from 'next';
import ContactForm from '@/components/shared/Feedback';
import { Footer } from '@/components/shared/Footer';
import NavbarWithBg from '@/components/shared/NavbarWithbg';

// Define the ContactPage component as a Next.js page component
const ContactPage: NextPage = () => {
  return (
    // Main container div
    <div>
      {/* Navigation bar component with background */}
      <NavbarWithBg/>

      {/* Content container with white background and horizontal auto margins */}
      <div className="mx-auto bg-white">
        {/* Contact form component for user feedback/messages */}
        <ContactForm/>
      </div>

      {/* Footer component displayed at the bottom of the page */}
      <Footer/>
    </div>
  );
};

// Export the ContactPage component as the default export
export default ContactPage;