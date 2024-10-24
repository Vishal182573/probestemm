"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_URL } from "@/constants";
import Image from "next/image";
import { CONTACT } from "../../../public";

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    subject: "",
    phoneNumber: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/contact`, formData);
      setSubmitStatus("success");
      setFormData({
        email: "",
        fullName: "",
        subject: "",
        phoneNumber: "",
        message: "",
      });
    } catch {
      setSubmitStatus("error");
    }
    setIsSubmitting(false);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden border border-[#c1502e]"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-[#c1502e] p-8 text-white flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4 text-white font-caveat">
                Contact Us
              </h2>
              <h3 className="text-4xl font-extrabold mb-6 text-white">
                Want to give feedback/
                <br />
                Suggestions?
              </h3>
              <p className="text-lg mb-8 text-white">
                Send a mail directly to Us!
              </p>
              <div className="relative w-64 h-64 mx-auto">
                <motion.div
                  className="rounded-full border-4 border-white overflow-hidden"
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    duration: 0.6,
                  }}
                >
                  <Image 
                  src={CONTACT}
                  alt="Contact illustration"
                  className="object-cover rounded-full"/>
                  </motion.div>
              </div>
            </div>
            <div className="md:w-1/2 p-8 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email Address"
                    className="w-full bg-white border-[#c1502e] text-[#472014] placeholder-[#686256] focus:border-[#472014] focus:ring-[#472014]"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full bg-white border-[#c1502e] text-[#472014] placeholder-[#686256] focus:border-[#472014] focus:ring-[#472014]"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full bg-white border-[#c1502e] text-[#472014] placeholder-[#686256] focus:border-[#472014] focus:ring-[#472014]"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full bg-white border-[#c1502e] text-[#472014] placeholder-[#686256] focus:border-[#472014] focus:ring-[#472014]"
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message Here"
                    className="w-full h-32 bg-white border-[#c1502e] text-[#472014] placeholder-[#686256] focus:border-[#472014] focus:ring-[#472014]"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#c1502e] hover:bg-[#472014] text-white font-bold py-3 rounded-lg transition duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
                {submitStatus === "success" && (
                  <p className="text-green-600 text-center">
                    Message sent successfully!
                  </p>
                )}
                {submitStatus === "error" && (
                  <p className="text-red-600 text-center">
                    Failed to send message. Please try again.
                  </p>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;