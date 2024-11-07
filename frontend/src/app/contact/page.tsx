"use client"
import React from 'react';
import { NextPage } from 'next';
import ContactForm from '@/components/shared/Feedback';
import { Footer } from '@/components/shared/Footer';
import NavbarWithBg from '@/components/shared/NavbarWithbg';

const ContactPage: NextPage = () => {
  return (
    <div>
      <NavbarWithBg/>
      <div className="mx-auto bg-white">
        <ContactForm/>
      </div>
      <Footer/>
    </div>
  );
};

export default ContactPage;