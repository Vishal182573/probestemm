/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaGoogle,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { LOGO } from "../../../public";
import Link from "next/link";

const socialLinks = {
  twitter: "https://x.com/StemProbe",
  instagram: "https://www.instagram.com/probestem?igsh=MW9sOTdoMHdwY2xmZw%3D%3D",
  facebook: "https://www.facebook.com/profile.php?id=61573531766943",
  linkedin: "https://www.linkedin.com/in/probe-stem-36b7bb345/",
  youtube: "https://www.youtube.com/channel/UCOxc4PcOaUUY3eN18gcvYpw",
  google: "mailto:probestem2024@gmail.com",
};

export const Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-white text-[#472014] border-t-[1px] border-[#472014]">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Section 1: Contact Information */}
            <div className="space-y-4">
              <h3 className="font-caveat text-3xl font-bold text-[#eb5e17] mb-6">
                Contact Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center hover:text-[#c1502e] transition-colors">
                  <MdEmail className="mr-3 text-[#eb5e17]" size={20} />
                  <a href="mailto:info@probestem.com">probestem2024@gmail.com</a>
                </li>
                <li className="flex items-center hover:text-[#c1502e] transition-colors">
                  <MdPhone className="mr-3 text-[#eb5e17]" size={20} />
                  <a href="tel:+11234567890">+91 769 604 939 1</a>
                </li>
                <li className="flex items-start">
                  <MdLocationOn
                    className="mr-3 text-[#eb5e17] mt-1"
                    size={20}
                  />
                  <span>
                    Indian Institute of Technology (IIT) Mandi
                    <br />
                    Himachal Pradesh 175001,
                    <br />
                    India
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 2: Quick Links and Pages */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-8">
                {/* Quick Links subsection */}
                <div>
                  <h3 className="font-caveat text-3xl font-bold text-[#eb5e17] mb-6">
                    Quick Links
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="students"
                        className="hover:text-[#c1502e] transition-colors block"
                      >
                        Student Profiles
                      </a>
                    </li>
                    <li>
                      <a
                        href="businesses"
                        className="hover:text-[#c1502e] transition-colors block"
                      >
                        Industry Profiles
                      </a>
                    </li>
                    <li>
                      <a
                        href="professors"
                        className="hover:text-[#c1502e] transition-colors block"
                      >
                        Professor Profiles
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Pages subsection */}
                <div>
                  <h3 className="font-caveat text-3xl font-bold text-[#eb5e17] mb-6">
                    Pages
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="about"
                        className="hover:text-[#c1502e] transition-colors block"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="discussions"
                        className="hover:text-[#c1502e] transition-colors block"
                      >
                        Discussion Forum
                      </a>
                    </li>
                    <li>
                      <a
                        href="webinars"
                        className="hover:text-[#c1502e] transition-colors block"
                      >
                        Webinars
                      </a>
                    </li>
                    <li>
                      <a
                        href="blogs"
                        className="hover:text-[#c1502e] transition-colors block"
                      >
                        RESEARCH CORNER
                      </a>
                    </li>
                    <li>
                      <a
                        href="projects/professor"
                        className="hover:text-[#c1502e] transition-colors block"
                      >
                        Projects
                      </a>
                    </li>
                    <li>
                      <a
                        href="contact"
                        className="hover:text-[#c1502e] transition-colors block"
                      >
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: Social Media Connect */}
            <div className="space-y-4">
              <h3 className="font-caveat text-3xl font-bold text-[#eb5e17] mb-6">
                Connect With Us
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { Icon: FaTwitter, link: socialLinks.twitter },
                  { Icon: FaInstagram, link: socialLinks.instagram },
                  { Icon: FaFacebook, link: socialLinks.facebook },
                  { Icon: FaLinkedin, link: socialLinks.linkedin },
                  { Icon: FaYoutube, link: socialLinks.youtube },
                  { Icon: FaGoogle, link: socialLinks.google },
                ].map(({ Icon, link }, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-[#f8f4f1] hover:bg-[#c1502e] text-[#472014] hover:text-white transition-all duration-300"
                  >
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>

            {/* Section 4: Logo and Tagline */}
            <div className="space-y-4 flex flex-col items-center lg:items-start">
              <Image
                src={LOGO}
                alt="Probe STEM Logo"
                width={400}
                height={70}
                className="mb-4"
              />
              <p className="text-2xl text-[#eb5e17] text-center lg:text-left">
                Bridging the gap between academia and industry to ensure
                practical impacts and actionable solutions
              </p>
            </div>
          </div>

          {/* Footer Bottom Section */}
          <div className="border-t border-[#c1502e]/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm">
                  &copy; {new Date().getFullYear()} Probe STEM. All rights
                  reserved.
                </p>
                <p className="text-xs text-[#472014]/70 mt-1">
                  Designed by clay web design
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-6">
                <Link href={"/privacy-policy"}>
                  <button className="text-sm hover:text-[#c1502e] transition-colors">
                    Privacy Policy
                  </button>
                </Link>
                <Link href={"/terms-condition"}>
                  <button className="text-sm hover:text-[#c1502e] transition-colors">
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
