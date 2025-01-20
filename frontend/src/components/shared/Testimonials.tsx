"use client"
// Import necessary dependencies
import React from "react";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion"; // For animations
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { TESTI2} from "../../../public";

// Array of testimonial data containing user reviews and information
const testimonials = [
  {
    quote: "I am excited about the opportunity to utilize this platform to connect with colleagues and student researchers, both domestically and internationally. I believe that by working together and sharing our knowledge, we can make a significant impact in addressing the environmental challenges that we face today.",
    author: "Dr. Ali H Omar",
    role: "Senior Scientist,",
    department: "NASA Langley Research Center, USA",
    image: TESTI2,
    rating: 5,
    link:"",
  },
  {
    quote: "Probe STEM is an inspiring platform that opens up incredible opportunities for students like me seeking research projects aligned with their interests. This initiative fosters a sense of purpose in research by encouraging innovations that benefit both the academic community and society at large. Truly a game-changer for anyone dedicated to meaningful research and the exchange of knowledge!",
    author: "Shashank Gupta",
    role: "Integrated Programme in Management,",
    department: "Indian Institute of Management (IIM) Indore, India",
    image: "https://res.cloudinary.com/drwyju0q7/image/upload/v1733576847/xbrthmbt22eqveftqicw.png",
    rating: 5,
    link:"https://probestem.com/student-profile/cm4e56k0k000c6ykllu6hml1a"
  },
  {
    quote: "I'm eager to unite with a global network of researchers, leveraging this platform to pioneer groundbreaking sustainable solutions. As an academician, I have always felt the need for a forum that can actively promote industrial collaborations. In my view, this initiative is a step in the right direction",
    author: "Ankur Suri",
    role: "Teaching Professor,",
    department: "University of Washington Tacoma, USA",
    image: "https://res.cloudinary.com/drwyju0q7/image/upload/v1734676542/ikqe5ygbcni7hqallrvz.jpg",
    rating: 5,
    link:"https://probestem.com/professor-profile/cm486fpm4001lmm36ssnd00jg"
  }
];

const TestimonialsSection = () => {
  return (
    // Main section container with gradient background
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Main content wrapper with z-index for proper layering */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Animated heading using Framer Motion */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16 text-gray-800"
        >
          What our Community Says
        </motion.h2>

        {/* Grid container for testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Map through testimonials array to create individual cards */}
          {testimonials.map((testimonial, index) => (
            // Animated card wrapper with hover effects
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              {/* Clickable link wrapper for the entire card */}
              <a href={testimonial.link} className="block h-full">
                {/* Card component with hover animations */}
                <Card className="h-full bg-white border-none shadow-lg group-hover:shadow-xl transition-all duration-300 ease-in-out transform group-hover:-translate-y-2">
                  <CardContent className="p-6 md:p-8 flex flex-col h-full">
                    {/* Main content area with quote and rating */}
                    <div className="flex-grow">
                      {/* Quote icon decoration */}
                      <div className="relative mb-4">
                        <Quote className="absolute top-0 left-0 h-8 w-8 text-gray-100 -z-10" />
                      </div>

                      {/* Star rating display with animation */}
                      <div className="flex justify-start mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Star className="h-5 w-5 text-[#eb5e17] fill-current" />
                          </motion.div>
                        ))}
                      </div>

                      {/* Testimonial quote text */}
                      <p className="text-gray-700 mb-6 text-base md:text-lg leading-relaxed min-h-[150px]">
                        {testimonial.quote}
                      </p>
                    </div>

                    {/* Author information section */}
                    <div className="mt-auto">
                      <div className="flex items-center pt-6 border-t border-gray-100">
                        {/* Author profile image */}
                        <div className="relative w-10 h-10 md:w-12 md:h-12 mr-4">
                          <Image
                            src={testimonial.image || '/default-avatar.png'}
                            alt={testimonial.author}
                            fill
                            className="rounded-full object-cover bg-gray-100"
                          />
                        </div>
                        {/* Author details (name, role, department) */}
                        <div className="flex-grow">
                          <p className="font-semibold text-gray-800 text-sm md:text-base">
                            {testimonial.author}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600">
                            {testimonial.role}
                          </p>
                          <p className="text-xs text-gray-500">
                            {testimonial.department}
                          </p>
                        </div>
                      </div>
                    </div>
                </CardContent>
              </Card>
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -z-10 blur-2xl opacity-50" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-50 to-transparent rounded-full -z-10 blur-2xl opacity-50" />
    </section>
  );
};

export default TestimonialsSection;