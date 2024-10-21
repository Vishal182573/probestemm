"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface faqItem{
    question:string,
    answer:string,
}

interface faqprops{
    faqItems:[faqItem]
}

const FAQSection = () => {
  const [faqs, setFaqs] = useState<faqprops>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <section className="py-12 w-full">
        
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-800">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.slice(0, 4).map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="text-left text-lg font-medium p-4 hover:bg-gray-50 transition-all duration-300 text-gray-700">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 p-4 bg-white">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-8 text-center">
            <Button
              onClick={() => router.push('/faq')}
              variant="outline"
              className="px-6 py-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-full transition-all duration-300"
            >
              View More FAQs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;