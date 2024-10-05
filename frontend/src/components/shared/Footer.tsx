import React from "react";
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-600 py-8 shadow-md bottom-0 text-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-3 text-blue-600">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MdEmail className="mr-2 text-blue-500" size={16} />
                info@probestem.com
              </li>
              <li className="flex items-center">
                <MdPhone className="mr-2 text-blue-500" size={16} />
                +1 123-456-7890
              </li>
              <li className="flex items-start">
                <MdLocationOn className="mr-2 mt-1 text-blue-500" size={16} />
                <span>123 Education St., Science City, 12345</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-blue-600">Quick Links</h3>
            <ul className="space-y-2">
              {["About Us", "Webinars", "Blogs", "Questionnaire", "Projects"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-blue-500 transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-blue-600">Connect With Us</h3>
            <div className="flex space-x-3">
              {[FaTwitter, FaInstagram, FaFacebook, FaLinkedin].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    <Icon size={24} />
                  </a>
                )
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-blue-600">Our Logo</h3>
            <div className="text-gray-500">logo here</div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 text-xs">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p>Copyright © 2024 Probe STEM. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-4">
              {["Privacy Policy", "Terms of Use", "Legal", "Site Map"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="hover:text-blue-500 transition-colors duration-200"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};