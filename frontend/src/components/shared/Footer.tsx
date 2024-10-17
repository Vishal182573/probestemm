"use client";
import React from "react";
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin, FaYoutube, FaGithub } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn, MdSchool, MdScience, MdBusiness } from "react-icons/md";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

export const Footer: React.FC = () => {
  // const handleSubscribe = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Add subscription logic here
  // };

  return (
    <footer className="bg-gradient-to-b from-white to-[#f8f4f1] text-[#472014] border-t-[1px] border-[#472014]">
      {/* Newsletter Section */}
      {/* <div className="bg-gradient-to-r from-[#c1502e] to-[#686256] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <h3 className="font-caveat text-3xl font-bold mb-2">Stay Connected with Probe STEM</h3>
              <p className="text-white/90">Subscribe to our newsletter for latest updates and opportunities</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/90 border-none w-full md:w-80"
                required
              />
              <Button type="submit" className="bg-[#472014] hover:bg-[#2d1409] text-white whitespace-nowrap">
                Subscribe Now
              </Button>
            </form>
          </div>
        </div>
      </div> */}

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-caveat text-2xl font-bold text-[#c1502e] mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center hover:text-[#c1502e] transition-colors">
                <MdEmail className="mr-3 text-[#c1502e]" size={20} />
                <a href="mailto:info@probestem.com">info@probestem.com</a>
              </li>
              <li className="flex items-center hover:text-[#c1502e] transition-colors">
                <MdPhone className="mr-3 text-[#c1502e]" size={20} />
                <a href="tel:+11234567890">+1 123-456-7890</a>
              </li>
              <li className="flex items-start">
                <MdLocationOn className="mr-3 text-[#c1502e] mt-1" size={20} />
                <span>123 Education St., Science City,<br />Innovation Hub, 12345</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-caveat text-2xl font-bold text-[#c1502e] mb-6">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-[#c1502e] transition-colors flex items-center">
                    <MdSchool className="mr-2" />
                    Academic Programs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c1502e] transition-colors flex items-center">
                    <MdScience className="mr-2" />
                    Research Projects
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c1502e] transition-colors flex items-center">
                    <MdBusiness className="mr-2" />
                    Industry Partners
                  </a>
                </li>
              </ul>
              <ul className="space-y-3">
                {["Webinars", "Resources", "Careers", "Support"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-[#c1502e] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Connect With Us */}
          <div className="space-y-4">
            <h3 className="font-caveat text-2xl font-bold text-[#c1502e] mb-6">Connect With Us</h3>
            <div className="grid grid-cols-3 gap-4">
              {[FaTwitter, FaInstagram, FaFacebook, FaLinkedin, FaYoutube, FaGithub].map(
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
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Working Hours</h4>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Weekend: By Appointment</p>
            </div>
          </div>

          {/* About & Recognition */}
          <div className="space-y-4">
            <h3 className="font-caveat text-2xl font-bold text-[#c1502e] mb-6">Recognition</h3>
            <div className="space-y-4">
              <div className="bg-[#f8f4f1] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Certifications</h4>
                <p className="text-sm">ISO 9001:2015 Certified</p>
                <p className="text-sm">Educational Excellence Award 2024</p>
              </div>
              <div className="bg-[#f8f4f1] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Partnerships</h4>
                <p className="text-sm">Member of Global STEM Alliance</p>
                <p className="text-sm">UNESCO Associated Schools Network</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-[#c1502e]/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm">&copy; {new Date().getFullYear()} Probe STEM. All rights reserved.</p>
              <p className="text-xs text-[#472014]/70 mt-1">Empowering minds, Advancing science, Building futures</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility", "Site Map"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-sm hover:text-[#c1502e] transition-colors"
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