"use client"
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import NotificationsComponent from "@/components/shared/Notifications";
import { motion, useAnimation } from "framer-motion";

import { ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface AnimatedSectionProps {
  children: ReactNode;
  direction?: "left" | "right";
}
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

const WebinarPage = () => {
  return (
    <div>
      <Navbar />

      <section className="py-20 bg-[#82CAFF]">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center mb-12 text-[#003366]">
              Stay Updated
            </h2>
          </AnimatedSection>
          <AnimatedSection>
            <NotificationsComponent />
          </AnimatedSection>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default WebinarPage;
