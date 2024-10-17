"use client"
import React, { useState, useEffect, ReactNode } from "react";
import Link from "next/link"
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components//shared/Footer";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Briefcase,
  UserCircle,
  GraduationCap,
  ChevronDown,
  Star,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import NotificationsComponent from "@/components/shared/Notifications";
import ContactForm from "@/components/shared/Feedback";
import FeaturedQuestionsSection from "@/components/shared/FeaturedQuestionSection";

interface AnimatedSectionProps {
  children: ReactNode;
  direction?: "left" | "right";
}

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <NotificationsSection />
        <FeaturedQuestionsSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

const images = ["/c1.png", "/c2.png", "/c3.png"];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-[#c1502e] to-[#686256] opacity-80 z-10" />
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-[150px] font-extrabold mb-6 text-[#472014] font-caveat"
        >
          Connecting <span className="">Minds</span>{" "}
          <span className="bg-clip-text ">Globally</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl md:text-4xl mb-10 text-black max-w-5xl mx-auto "
        >
          <span className=" text-[#472014] font-bold">Probe STEM:</span> fostering dynamic collaboration among students, faculty, and industry experts to drive innovation
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Link href="/login">
            <Button
              size="lg"
              className="bg-[#c1502e] hover:bg-[#003d82] text-white font-bold py-4 px-8 rounded-full transition-all duration-300 text-lg shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Get Started
              <Rocket className="ml-2 h-6 w-6" />
            </Button>
          </Link>
          <Link href="/about">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-white hover:text-[#0056b3] text-lg w-full sm:w-auto"
            >
              Learn More
            </Button>
          </Link>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <ChevronDown className="text-white h-10 w-6" />
      </motion.div>
    </section>
  );
};

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  direction = "left",
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, x: 0 },
        hidden: { opacity: 0, x: direction === "left" ? -50 : 50 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <UserCircle className="h-16 w-16 text-[#472014]" />,
      title: "Student Profile",
      description:
        "Showcase your academic journey, research highlights, and achievements. Connect with professors and industry partners for exciting opportunities.",
      benefits: [
        "Personalized learning dashboard",
        "Project collaboration tools",
        "Research publication tracking",
      ],
    },
    {
      icon: <GraduationCap className="h-16 w-16 text-[#472014]" />,
      title: "Professor Profile",
      description:
        "Manage your academic portfolio, showcase research projects, and connect with talented students and industry partners.",
      benefits: [
        "Webinar hosting platform",
        "Research project management",
        "Student talent pool access",
      ],
    },
    {
      icon: <Briefcase className="h-16 w-16 text-[#472014]" />,
      title: "Industry Profile",
      description:
        "Discover top talent, collaborate on cutting-edge research projects, and stay at the forefront of innovation in your industry.",
      benefits: [
        "AI-powered talent matching",
        "Research collaboration tools",
        "Industry-academia networking",
      ],
    },
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <AnimatedSection>
        <h2 className="text-5xl font-bold text-center mb-16 text-[#472014] font-caveat">
          Why Choose Probe STEM?
        </h2>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <AnimatedSection
            key={index}
            direction={index % 2 === 0 ? "left" : "right"}
          >
            <motion.div
              className="p-8 rounded-xl shadow-xl h-full flex flex-col bg-[#c1502e]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center text-center flex-grow text-[#c1502e]">
                {feature.icon}

                <h3 className="text-4xl font-semibold mt-6 mb-4 text-[#472014] font-caveat">
                  {feature.title}
                </h3>
                <p className="text-[#472014] text-lg mb-6">
                  {feature.description}
                </p>
                <ul className="text-left w-full">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center mb-2">
                      <Star className="h-5 w-5 text-[#472014] mr-2 " />
                      <span className="text-[#472014]">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
};

const NotificationsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-5xl font-bold text-center mb-12 text-[#472014] font-caveat">
            Stay Updated
          </h2>
        </AnimatedSection>
        <AnimatedSection>
          <NotificationsComponent />
        </AnimatedSection>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "\"Probe STEM transformed my learning experience. The interactive projects and global network are unparalleled.",
      author: "Sarah K., Computer Science Student\"",
      rating: 5,
    },
    {
      quote:
        "As an educator, Probe STEM provides me with cutting-edge tools to engage my students like never before.",
      author: "Dr. James L., University Professor",
      rating: 5,
    },
    {
      quote:
        "The talent we've recruited through Probe STEM has been exceptional. It's our go-to platform for finding innovators.",
      author: "Emily R., Tech Startup Founder",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <AnimatedSection>
        <h2 className="text-5xl font-bold text-center mb-16 text-[#472014] font-caveat">
          What Our Community Says
        </h2>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <AnimatedSection
            key={index}
            direction={index % 2 === 0 ? "left" : "right"}
          >
            <motion.div
              className="bg-[#c1502e] p-8 rounded-xl shadow-xl font-caveat text-xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star className="h-6 w-6 text-[#472014] fill-current" />
                  </motion.div>
                ))}
              </div>
              <p className="text-[#472014] italic mb-6 ">
                {testimonial.quote}
              </p>
              <p className="text-[#472014] font-semibold text-right">
                {testimonial.author}
              </p>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
};

const FAQSection = () => {
  const faqItems = [
    {
      question: "What is Probe STEM?",
      answer:
        "Probe STEM is an online research platform designed to facilitate and enhance collaborative efforts across a diverse array of disciplines in Science, Technology, Engineering, and Mathematics (STEM). The platform provides resources that enable students, educators, and professionals to connect, share knowledge, and work together on research projects, fostering innovation and interdisciplinary collaboration.",
    },
    {
      question: "Who can join Probe STEM?",
      answer:
        "Probe STEM is open to a wide range of participants, including: 1) Researchers: Professionals and academicians working in STEM fields. 2) Educators: Teachers looking to collaborate on educational projects. 3) Students: Those wishing to participate in research projects, gain mentorship, and build professional networks. 4) Industry Professionals: Research industries interested in finding research mentorship or collaborating with academic researchers. 5) Institutions and Organizations: Academic institutions, research organizations, and companies that want to promote collaborative research, support innovation, and connect with a broader network of experts.",
    },
    {
      question: "How to use Probe STEM?",
      answer:
        "Probe STEM provides these essential features: 1) Mentorship Connection: Allows students to connect with mentors for direct interaction and guidance. 2) Discussion forum: Promotes in-depth discussions and Q&A sessions on various topics. 3) Global Research Showcase: Offers a platform for researchers and students to present their work globally. 4) Webinars and online courses: Scheduling research talks or online courses managed by the admin. 5) Industry Collaborations: Links industry partners with professors seeking to advance their research projects.",
    },
    {
      question: "Is there any cost to use Probe STEM?",
      answer: "Probe STEM is completely free to use.",
    },
    {
      question: "How can I find a project?",
      answer:
        "For students: Connect with the relevant faculty when they post a project. For faculty: Apply for projects through the online form available under the Industrial Collaboration section when a project is posted by the industry.",
    },
    {
      question: "How can I get a project?",
      answer:
        "For students: The faculty has the discretion to decide whether to take you on for a project. For faculty: Industry will do the direct recruitment through Probe STEM.",
    },
    {
      question: "How is Probe STEM useful to me?",
      answer:
        "Probe STEM is useful if: 1) You're a student with a research idea you'd like to discuss with an experienced researcher. 2) You're a faculty member seeking a consultancy project with industry partners. 3) You're an institution looking for a platform to showcase your research findings. If you're looking for research interaction in any capacity, Probe STEM is the right place for you.",
    },
  ];

  return (
    <section className="py-12 bg-white w-full">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-5xl font-bold text-center mb-8 text-[#472014] font-caveat">
            Frequently Asked Questions
          </h2>
        </AnimatedSection>
        <div className="max-w-6xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AnimatedSection
                key={index}
                direction={index % 2 === 0 ? "left" : "right"}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="mb-4 border border-[#c1502e] rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold p-4 bg-[#c1502e] hover:bg-[#c05f41] transition-all duration-300 text-[#472014]">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#472014] p-4 bg-[#686256]">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </AnimatedSection>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
