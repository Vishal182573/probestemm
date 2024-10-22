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

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-caveat text-2xl font-bold text-[#c1502e] mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-[#c1502e] transition-colors">
                    Student Profiles
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c1502e] transition-colors">
                    Industry Profiles
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c1502e] transition-colors">
                    Professor Profiles
                  </a>
                </li>
              </ul>
            </div>

            {/* Pages */}
            <div className="space-y-4">
              <h3 className="font-caveat text-2xl font-bold text-[#c1502e] mb-6">Pages</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-[#c1502e] transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c1502e] transition-colors">
                    Discussion Forum
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c1502e] transition-colors">
                    Webinars
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c1502e] transition-colors">
                    Blogs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c1502e] transition-colors">
                    Projects
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c1502e] transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Logo Section */}
            <div className="space-y-4 flex flex-col items-center lg:items-start">
              <Image
                src={LOGO}
                alt="Probe STEM Logo"
                width={200}
                height={60}
                className="mb-4"
              />
              <p className="text-sm text-center lg:text-left">
                Empowering the next generation of innovators through collaborative STEM research and education.
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
        <div className="prose text-black">
        </div>
      </Modal>

      <Modal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        title="Terms of Service"
      >
        <div className="prose text-black">
          {/* Terms of service content */}
        </div>
      </Modal>
    </>
  );
};