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

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const response = await axios.get(`${API_URL}/webinars`);
        setWebinars(response.data);

        // Initialize the first set of visible webinars
        setVisibleWebinars(response.data.slice(0, 4));
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch webinars:", error);
        setIsLoading(false);
      }
    };

    fetchWebinars();
  }, []);

  useEffect(() => {
    if (webinars.length === 0 || isLoading) return;

    const intervalId = setInterval(() => {
      setVisibleWebinars((currentVisible) => {
        if (currentVisible.length === 0) return currentVisible; // Avoid accessing empty array

        const firstWebinar = currentVisible[0];
        const remainingWebinars = currentVisible.slice(1);
        const nextWebinarIndex =
          (webinars.findIndex((w) => w.id === firstWebinar.id) + 4) % webinars.length;
        const nextWebinar = webinars[nextWebinarIndex];

        return [...remainingWebinars, nextWebinar];
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [webinars, isLoading]);

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full overflow-hidden bg-white py-12">
      <div className="relative max-w-full">
        <div className="flex gap-4">
          <AnimatePresence initial={false}>
            {visibleWebinars.map((webinar, index) => (
              <motion.div
                key={`${webinar.id}-${index}`}
                className="w-1/4 flex-shrink-0"
                initial={{ x: index === 3 ? "100%" : 0, opacity: index === 3 ? 0 : 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              >
                <Card className="h-[400px] relative overflow-hidden group hover:shadow-xl transition-shadow duration-300 border-[#c1502e]">
                  <div className="absolute inset-0">
                    {webinar.webinarImage ? (
                      <Image
                        src={webinar.webinarImage}
                        alt={webinar.title}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Video className="h-12 w-12 text-[#c1502e]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                  <CardContent className="relative h-full flex flex-col justify-end p-6 text-white">
                    <Badge className="mb-4 bg-[#c1502e] inline-flex">{webinar.status=="APPROVED" ?"UPCOMING":"COMPLETED"}</Badge>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {webinar.title}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {webinar.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-12 text-[#472014] font-caveat">
          Upcoming Webinars
        </h2>
        <WebinarSlider />
      </div>
    </section>
  );
}
