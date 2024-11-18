"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { API_URL } from "@/constants";
import { FAQ } from "../../../public";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(`${API_URL}/faqs`);
        const data = await response.json();
        setFaqs(data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <motion.section
      className="py-12 w-full bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-50 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start gap-12 relative z-10">
          <div className="flex-1 w-full lg:w-3/5">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-center lg:text-left mb-8 text-gray-800"
            >
              Frequently Asked Questions
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.length>0 && faqs.slice(0, 4).map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                  >
                    <AccordionItem
                      value={`item-${index}`}
                      className="border border-[#eb5e17] rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
                    >
                      <AccordionTrigger className="text-left text-lg font-medium px-6 py-4 hover:bg-gray-50 transition-all duration-300 text-gray-700">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 px-6 py-4 bg-gray-50 leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>

              <motion.div
                variants={itemVariants}
                className="mt-8 text-center lg:text-left"
              >
                <div
                >
                  <Button
                    onClick={() => router.push("/faq")}
                    className="w-full sm:w-auto bg-[#5e17eb] hover:bg-[#8c5fe7] text-white text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-colors duration-300"
                  >
                    View More FAQs
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden lg:block flex-1 w-full lg:w-24 sticky top-24"
          >
            <div className="relative aspect-square h-96 w-max-md mx-auto">
              <Image
                src={FAQ}
                alt="FAQ Illustration"
                fill
                className="object-cover rounded-2xl shadow-xl w-36"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl filter blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default FAQSection;