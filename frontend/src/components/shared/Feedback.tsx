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
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

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
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-xl overflow-hidden shadow-lg"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Image with transparent border effect */}
            <div className="lg:w-1/2 relative p-4">
              <div className="relative h-full rounded-xl overflow-hidden">
                {/* Transparent border overlay */}
                <div className="absolute inset-0 border-[120px] border-[#eb5e17] opacity-50 z-10" />
                <Image
                  src={CONTACT}
                  alt="Students walking up stairs"
                  className="w-46 h-full object-cover rounded-xl"
                  style={{ objectPosition: 'center center' }}
                />
                <div className="absolute bottom-8 left-8 z-20">
                  <div className="space-y-4">
                    <div className="w-48 h-1 bg-white" />
                    <p className="text-xl text-white font-medium">
                    Your opinion matters
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="lg:w-1/2 p-8">
              <div className="mb-12">
                <h2 className="text-5xl font-bold mb-4 text-black">
                  CONTACT US
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  Want to give Feedback Suggestions ?
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email Address"
                    className="w-full bg-white border-black text-black placeholder-gray-500 focus:border-maroon-600 focus:ring-maroon-600"
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
                    className="w-full bg-white border-black text-black placeholder-gray-500 focus:border-maroon-600 focus:ring-maroon-600"
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
                    className="w-full bg-white border-black text-black placeholder-gray-500 focus:border-maroon-600 focus:ring-maroon-600"
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
                    className="w-full bg-white border-black text-black placeholder-gray-500 focus:border-maroon-600 focus:ring-maroon-600"
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message Here"
                    className="w-full h-32 bg-white border-black text-black placeholder-gray-500 focus:border-maroon-600 focus:ring-maroon-600"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#5e17eb] hover:bg-[#733edb] text-white font-bold py-3 rounded-lg transition duration-300"
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