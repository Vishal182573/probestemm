"use client";
import Banner from "@/components/shared/Banner";
import { Footer } from "@/components/shared/Footer";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import NotificationsComponent from "@/components/shared/Notifications";
import { motion, useAnimation } from "framer-motion";

import { ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { WEBINAR } from "../../../public";
// import FeaturesDemo from "@/components/shared/TextImageComponent";
// import ContactForm from "@/components/shared/Feedback";

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
      <NavbarWithBg/>
      <Banner imageSrc={WEBINAR} altText="webinar-banner-img" 
    title="Stay ahead of the Curve"
    subtitle="Attend virtual seminars and discussions"/>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center mb-12 font-caveat text-[#472014]">
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
