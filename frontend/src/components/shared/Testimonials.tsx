"use client"
import React from "react";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { TESTI1, TESTI2, TESTI3 } from "../../../public";

const testimonials = [
  {
    quote: "I am excited about the opportunity to utilize this platform to connect with colleagues and student researchers, both domestically and internationally. I believe that by working together and sharing our knowledge, we can make a significant impact in addressing the environmental challenges that we face today.",
    author: "Dr. Ali H Omar",
    role: "Senior Scientist, NASA, USA",
    image: TESTI2,
    rating: 5,
    link:"",
  },
  {
    quote: "I’m eager to unite with a global network of researchers, leveraging this platform to pioneer groundbreaking sustainable solutions. As an academician, I have always felt the need for a forum that can actively promote industrial collaborations. In my view, this initiative is a step in the right direction",
    author: "Ankur Suri",
    role: "Teaching Professor, University of Washington Tacoma, USA",
    image: TESTI3,
    rating: 5,
    link:"https://probestem.com/professor-profile/cm486fpm4001lmm36ssnd00jg"
  },
  {
    quote: "The talent we've recruited through Probe STEM has been exceptional. It's our go-to platform for finding innovators.",
    author: "Emily R.",
    role: "Tech Startup Founder",
    image: TESTI1,
    rating: 5,
    link:""
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-bold text-center mb-16 text-gray-800"
        >
          What our Community Says
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <a href={testimonial.link}>
              <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <Quote className="absolute top-0 left-0 h-10 w-10 text-gray-200 -z-10" />
                  </div>

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

                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {testimonial.quote}
                  </p>

                  <div className="flex items-center mt-8 pt-6 border-t border-gray-100">
                    <div className="relative w-12 h-12 mr-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -z-10 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-50 to-transparent rounded-full -z-10 blur-2xl" />
      </div>
    </section>
  );
};

export default TestimonialsSection;