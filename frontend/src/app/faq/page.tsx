"use client"
import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2 } from 'lucide-react';
import Head from 'next/head';
import NavbarWithBg from '@/components/shared/NavbarWithbg';
import { Footer } from '@/components/shared/Footer';

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
        const response = await fetch('/api/faqs');
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
      <NavbarWithBg/>
      <Head>
        <title>FAQ - Probe STEM</title>
        <meta name="description" content="Frequently Asked Questions about Probe STEM" />
      </Head>

      <main className="min-h-screen py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">
            Frequently Asked Questions
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white"
                >
                  <AccordionTrigger className="text-left text-lg font-medium p-4 hover:bg-gray-50 transition-all duration-300 text-gray-700">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 p-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}