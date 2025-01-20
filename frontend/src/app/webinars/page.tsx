"use client"; // Marks this as a client-side component in Next.js

// Import necessary components and utilities
import Banner from "@/components/shared/Banner";
import { Footer } from "@/components/shared/Footer";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import NotificationsComponent from "@/components/shared/Notifications";
import { motion, useAnimation } from "framer-motion"; // Animation utilities from Framer Motion

import { ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { WEBINAR } from "../../../public";
// import FeaturesDemo from "@/components/shared/TextImageComponent";
// import ContactForm from "@/components/shared/Feedback";

// Type definition for AnimatedSection props
interface AnimatedSectionProps {
  children: ReactNode;
  direction?: "left" | "right";
}

// AnimatedSection component: Wraps children with animation effects
const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  direction = "left",
}) => {
  // Initialize animation controls
  const controls = useAnimation();
  // Setup intersection observer to detect when element is in view
  const [ref, inView] = useInView({
    triggerOnce: true, // Animation triggers only once
    threshold: 0.1, // Triggers when 10% of element is visible
  });

  // Effect to start animation when element comes into view
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Return animated container using Framer Motion
  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, x: 0 }, // Visible state: fully opaque, no offset
        hidden: { opacity: 0, x: direction === "left" ? -50 : 50 }, // Hidden state: transparent, offset based on direction
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// Main Webinar Page component
const WebinarPage = () => {
  return (
    <div>
      {/* Navigation bar with background */}
      <NavbarWithBg/>
      
      {/* Hero banner section */}
      <Banner imageSrc={WEBINAR} altText="webinar-banner-img" 
    title="Stay ahead of the Curve"
    subtitle="Attend virtual seminars and discussions"/>
      
      {/* Main content section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Animated heading */}
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center mb-12 font-caveat text-[#472014]">
              Stay Updated
            </h2>
          </AnimatedSection>
          
          {/* Animated notifications component */}
          <AnimatedSection>
            <NotificationsComponent />
          </AnimatedSection>
        </div>
      </section>
      
      {/* Footer section */}
      <Footer />
    </div>
  );
};

export default WebinarPage;
