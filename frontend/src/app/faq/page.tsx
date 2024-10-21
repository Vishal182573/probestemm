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

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(`${API_URL}/faqs`);
        const data = await response.json();
        setFaqs(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <>
      <NavbarWithBg />
      <Head>
        <title>FAQ - Probe STEM</title>
        <meta name="description" content="Frequently Asked Questions about Probe STEM" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-50 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start gap-12 relative z-10">
            {/* FAQ Content */}
            <div className="flex-1 w-full lg:w-3/5">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold text-center lg:text-left mb-8 text-gray-800"
              >
                Frequently Asked <span className="text-[#c1502e]">Questions</span>
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-4xl"
              >
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <AccordionItem
                        value={`item-${index}`}
                        className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
                      >
                        <AccordionTrigger className="text-left text-lg font-medium px-6 py-4 hover:bg-gray-50 transition-all duration-300 text-gray-700">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 px-6 py-4 bg-gray-50 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </motion.div>
            </div>

            {/* Image/GIF Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="hidden lg:block flex-1 w-full lg:w-2/5 sticky top-24"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <Image
                  src="https://media.tenor.com/8tr_CU6730MAAAAM/web-dev-website-development.gif"  // Add your GIF file in the public folder
                  alt="FAQ Illustration"
                  fill
                  className="object-contain rounded-2xl shadow-xl"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl filter blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}