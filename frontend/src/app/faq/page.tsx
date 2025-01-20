"use client"

import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2 } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import NavbarWithBg from '@/components/shared/NavbarWithbg';
import { Footer } from '@/components/shared/Footer';
import { API_URL } from '@/constants';
import { motion } from 'framer-motion';
import { FAQPAGE } from '../../../public';

// Define the TypeScript interface for FAQ items
interface FAQ {
  question: string;
  answer: string;
}

export default function FAQPage() {
  // State management for FAQ data and loading status
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch FAQ data when component mounts
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        // Make API call to fetch FAQ data
        const response = await fetch(`${API_URL}/faqs`);
        const data = await response.json();
        setFaqs(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        // Set loading to false regardless of success/failure
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []); // Empty dependency array means this effect runs once on mount

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <>
      {/* Navigation bar with background */}
      <NavbarWithBg />

      {/* SEO metadata */}
      <Head>
        <title>FAQ - Probe STEM</title>
        <meta name="description" content="Frequently Asked Questions about Probe STEM" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24 relative overflow-hidden">
        {/* Decorative background elements with gradient blobs */}
        <div className="absolute top-0 left-0 w-full h-full opacity-50 pointer-events-none">
          {/* Top-left decorative blob */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
          {/* Bottom-right decorative blob */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4">
          {/* Main content wrapper with responsive layout */}
          <div className="flex flex-col lg:flex-row items-start gap-12 relative z-10">
            {/* FAQ Section - Takes 3/5 of the width on large screens */}
            <div className="flex-1 w-full lg:w-3/5">
              {/* Animated heading with highlighted text */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold text-center lg:text-left mb-8 text-gray-800"
              >
                Frequently Asked <span className="text-[#f0d80f]">Questions</span>
              </motion.h1>

              {/* FAQ Accordion Container */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-4xl"
              >
                {/* Accordion component that allows single item expansion */}
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {/* Map through FAQ items and render each as an accordion item */}
                  {faqs.map((faq, index) => (
                    // Animated container for each FAQ item
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      {/* Individual accordion item with styling */}
                      <AccordionItem
                        value={`item-${index}`}
                        className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
                      >
                        {/* Question trigger with hover effects */}
                        <AccordionTrigger className="text-left text-lg font-medium px-6 py-4 hover:bg-gray-50 transition-all duration-300 text-gray-700">
                          {faq.question}
                        </AccordionTrigger>
                        {/* Answer content with styling */}
                        <AccordionContent className="text-gray-600 px-6 py-4 bg-gray-50 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </motion.div>
            </div>

            {/* Illustration Section - Takes 2/5 of the width on large screens */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="hidden lg:block flex-1 w-full lg:w-2/5 sticky top-24"
            >
              {/* Image container with aspect ratio preservation */}
              <div className="relative aspect-square max-w-md mx-auto">
                <Image
                  src={FAQPAGE}
                  alt="FAQ Illustration"
                  fill
                  className="object-contain rounded-2xl shadow-xl"
                  priority
                />
              </div>
              {/* Decorative gradient background for the image */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl filter blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </main>
      {/* Footer component */}
      <Footer />
    </>
  );
}