import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ArrowRight, GraduationCap, Users, Briefcase } from "lucide-react";

const GetStartedPage = () => {
  const profiles = [
    {
      title: "Join as Teacher",
      icon: <GraduationCap className="h-16 w-16 text-white" />,
      description:
        "Empower the next generation of innovators with cutting-edge tools and global reach.",
      color: "from-purple-500 to-indigo-500",
      link: "/teacher-profile",
    },
    {
      title: "Join as Student",
      icon: <Users className="h-16 w-16 text-white" />,
      description:
        "Embark on a personalized learning journey and connect with a global community of peers.",
      color: "from-pink-500 to-rose-500",
      link: "/student-profile",
    },
    {
      title: "Business Profile",
      icon: <Briefcase className="h-16 w-16 text-white" />,
      description:
        "Partner with us to access top talent and drive innovation in your industry.",
      color: "from-blue-500 to-cyan-500",
      link: "/business-profile",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Navbar />
      <main className="flex-grow py-20 px-4">
        <motion.h1
          className="text-5xl font-bold text-center mb-12 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Get Started with Probe Stemm
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {profiles.map((profile, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center text-center relative z-10">
                <div
                  className={`p-4 rounded-full bg-gradient-to-br ${profile.color} mb-6`}
                >
                  {profile.icon}
                </div>
                <h2 className="text-2xl font-bold mb-4">{profile.title}</h2>
                <p className="text-gray-600 mb-6">{profile.description}</p>
                <Link href={profile.link}>
                  <Button
                    className={`bg-gradient-to-r ${profile.color} text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105`}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${profile.color} opacity-10`}
              ></div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GetStartedPage;
