/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin, FaYoutube, FaGoogle } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { LOGO } from "../../../public";
import Link from "next/link";

export const Footer: React.FC = () => {

  return (
    <>
      <footer className="bg-white text-[#472014] border-t-[1px] border-[#472014]">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-caveat text-3xl font-bold text-[#eb5e17] mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center hover:text-[#c1502e] transition-colors">
                  <MdEmail className="mr-3 text-[#eb5e17]" size={20} />
                  <a href="mailto:info@probestem.com">stemprobe@gmail.com</a>
                </li>
                <li className="flex items-center hover:text-[#c1502e] transition-colors">
                  <MdPhone className="mr-3 text-[#eb5e17]" size={20} />
                  <a href="tel:+11234567890">+91 769 604 939 1</a>
                </li>
                <li className="flex items-start">
                  <MdLocationOn className="mr-3 text-[#eb5e17] mt-1" size={20} />
                  <span>Indian Institute of Technology (IIT) Mandi<br/>Himachal Pradesh 175001,<br/>India</span>
                </li>
              </ul>
            </div>

            {/* Quick Links and Pages Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-8">
                {/* Quick Links Column */}
                <div>
                  <h3 className="font-caveat text-3xl font-bold text-[#eb5e17] mb-6">Quick Links</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="students" className="hover:text-[#c1502e] transition-colors block">
                        Student Profiles
                      </a>
                    </li>
                    <li>
                      <a href="businesses" className="hover:text-[#c1502e] transition-colors block">
                        Industry Profiles
                      </a>
                    </li>
                    <li>
                      <a href="professors" className="hover:text-[#c1502e] transition-colors block">
                        Professor Profiles
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Pages Column */}
                <div>
                  <h3 className="font-caveat text-3xl font-bold text-[#eb5e17] mb-6">Pages</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="about" className="hover:text-[#c1502e] transition-colors block">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href="discussions" className="hover:text-[#c1502e] transition-colors block">
                        Discussion Forum
                      </a>
                    </li>
                    <li>
                      <a href="webinars" className="hover:text-[#c1502e] transition-colors block">
                        Webinars
                      </a>
                    </li>
                    <li>
                      <a href="blogs" className="hover:text-[#c1502e] transition-colors block">
                      RESEARCH CORNER
                      </a>
                    </li>
                    <li>
                      <a href="projects" className="hover:text-[#c1502e] transition-colors block">
                        Projects
                      </a>
                    </li>
                    <li>
                      <a href="contact" className="hover:text-[#c1502e] transition-colors block">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Connect With Us */}
            <div className="space-y-4">
              <h3 className="font-caveat text-3xl font-bold text-[#eb5e17] mb-6">Connect With Us</h3>
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
              <p className="text-2xl text-[#eb5e17] text-center lg:text-left">
              Bridging the gap between academia and industry to make research a reality
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
                <Link href={"/privacy-policy"}>
                <button
                  className="text-sm hover:text-[#c1502e] transition-colors"
                  >
                  Privacy Policy
                </button>
                  </Link>
                  <Link href={"/terms-condition"}>
                <button
                  className="text-sm hover:text-[#c1502e] transition-colors"
                  >
                  Terms & Conditions
                </button>
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

// Pl change Ali Omar in what our communitysays to this 
// Dr. Ali H Omar, Senior Scientist and Fellow of the American Meteorological Society.