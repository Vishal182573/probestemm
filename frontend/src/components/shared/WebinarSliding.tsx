"use client";
import React, { useState, useEffect } from "react";
import { Video, Calendar, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { API_URL } from "@/constants";
import Image from "next/image";

interface Webinar {
  id: string;
  title: string;
  topic: string;
  place: string;
  date: string;
  status: "APPROVED" | "COMPLETED";
  maxAttendees: number;
  professorId: string;
  webinarImage?: string;
}

const WebinarSlider: React.FC = () => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [visibleWebinars, setVisibleWebinars] = useState<Webinar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(4);

  useEffect(() => {
    const updateDisplayCount = () => {
      if (window.innerWidth < 640) {
        setDisplayCount(1);
      } else if (window.innerWidth < 1024) {
        setDisplayCount(2);
      } else if (window.innerWidth < 1280) {
        setDisplayCount(3);
      } else {
        setDisplayCount(4);
      }
    };

    updateDisplayCount();
    window.addEventListener('resize', updateDisplayCount);
    return () => window.removeEventListener('resize', updateDisplayCount);
  }, []);

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const response = await axios.get(`${API_URL}/webinars`);
        // Filter only upcoming webinars
        const upcomingWebinars = response.data.filter(
          (webinar: Webinar) => webinar.status === "APPROVED"
        );
        setWebinars(upcomingWebinars);
        setVisibleWebinars(upcomingWebinars.slice(0, displayCount));
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch webinars:", error);
        setIsLoading(false);
      }
    };

    fetchWebinars();
  }, [displayCount]);

  useEffect(() => {
    if (webinars.length === 0 || isLoading) return;

    const intervalId = setInterval(() => {
      setVisibleWebinars((currentVisible) => {
        if (currentVisible.length === 0) return currentVisible;

        const firstWebinar = currentVisible[0];
        const remainingWebinars = currentVisible.slice(1);
        const nextWebinarIndex =
          (webinars.findIndex((w) => w.id === firstWebinar.id) + displayCount) % webinars.length;
        const nextWebinar = webinars[nextWebinarIndex];

        return [...remainingWebinars, nextWebinar];
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [webinars, isLoading, displayCount]);

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full overflow-hidden bg-white py-6 md:py-12">
      <div className="relative max-w-full">
        <div className="flex gap-2 md:gap-4">
          <AnimatePresence initial={false}>
            {visibleWebinars.map((webinar, index) => (
              <motion.div
                key={`${webinar.id}-${index}`}
                className={`flex-shrink-0 ${
                  displayCount === 1
                    ? 'w-full'
                    : displayCount === 2
                    ? 'w-1/2'
                    : displayCount === 3
                    ? 'w-1/3'
                    : 'w-1/4'
                }`}
                initial={{ 
                  x: index === displayCount - 1 ? "100%" : 0,
                  opacity: index === displayCount - 1 ? 0 : 1,
                  scale: index === displayCount - 1 ? 0.8 : 1
                }}
                animate={{ 
                  x: 0,
                  opacity: 1,
                  scale: 1
                }}
                exit={{ 
                  x: "-100%",
                  opacity: 0,
                  scale: 0.8
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <Card className="h-[300px] md:h-[400px] relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-[#c1502e]">
                  <div className="absolute inset-0">
                    {webinar.webinarImage ? (
                      <Image
                        src={webinar.webinarImage}
                        alt={webinar.title}
                        layout="fill"
                        objectFit="cover"
                        className="transform group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Video className="h-8 w-8 md:h-12 md:w-12 text-[#c1502e]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  </div>
                  <CardContent className="relative h-full flex flex-col justify-end p-3 md:p-6 text-white">
                    <Badge className="mb-2 md:mb-4 bg-[#c1502e] inline-flex">UPCOMING</Badge>
                    <h3 className="text-base md:text-xl font-semibold mb-2 line-clamp-2">
                      {webinar.title}
                    </h3>
                    <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        {webinar.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        {webinar.place}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default function WebinarSliderSection() {
  return (
    <section className="py-10 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-[#472014] font-caveat">
          Upcoming Webinars
        </h2>
        <WebinarSlider />
      </div>
    </section>
  );
}