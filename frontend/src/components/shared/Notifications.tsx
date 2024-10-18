import React, { useState, useEffect } from "react";
import { Video, Calendar, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_URL } from "@/constants";
import Link from "next/link";
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

const NotificationsComponent: React.FC = () => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [filteredWebinars, setFilteredWebinars] = useState<Webinar[]>([]);
  const [filter, setFilter] = useState<"APPROVED" | "COMPLETED" | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [webinarsPerPage] = useState(5);

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const response = await axios.get(`${API_URL}/webinars`);
        setWebinars(response.data);
      } catch (error) {
        console.error("Failed to fetch webinars:", error);
      }
    };

    fetchWebinars();
  }, []);

  useEffect(() => {
    const filtered =
      filter === "ALL"
        ? webinars
        : webinars.filter((webinar) => webinar.status === filter);
    setFilteredWebinars(filtered);
    setCurrentPage(1);
  }, [filter, webinars]);

  const indexOfLastWebinar = currentPage * webinarsPerPage;
  const indexOfFirstWebinar = indexOfLastWebinar - webinarsPerPage;
  const currentWebinars = filteredWebinars.slice(
    indexOfFirstWebinar,
    indexOfLastWebinar
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Card className="max-w-7xl mx-auto bg-white border-[#c1502e]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-4xl font-bold text-[#472014] font-caveat">
          Webinars
        </CardTitle>
        <Badge variant="secondary" className="bg-[#c1502e] text-white">
          {filteredWebinars.length} Total
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select
            onValueChange={(value: "APPROVED" | "COMPLETED" | "ALL") =>
              setFilter(value)
            }
          >
            <SelectTrigger className="w-[180px] bg-white text-[#472014]">
              <SelectValue placeholder="Filter webinars" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Webinars</SelectItem>
              <SelectItem value="APPROVED">UPCOMING</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AnimatePresence>
          {currentWebinars.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-[#472014]"
            >
              No webinars found
            </motion.p>
          ) : (
            <ul className="space-y-4">
              {currentWebinars.map((webinar) => (
                <motion.li
                  key={webinar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white border-[#c1502e] overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                          {webinar.webinarImage ? (
                            <Image
                              src={webinar.webinarImage}
                              alt={webinar.title}
                              layout="fill"
                              objectFit="cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Video className="h-12 w-12 text-[#c1502e]" />
                            </div>
                          )}
                        </div>
                        <div className="w-full md:w-2/3 p-4">
                          <h3 className="text-xl font-semibold text-[#472014] mb-2">
                            {webinar.title}
                          </h3>
                          <div className="flex items-center text-sm text-[#686256] mb-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            {webinar.date}
                          </div>
                          <div className="flex items-center text-sm text-[#686256] mb-1">
                            <MapPin className="h-4 w-4 mr-2" />
                            {webinar.place}
                          </div>
                          <p className="text-sm text-[#686256] mb-2">
                            Topic: {webinar.topic}
                          </p>
                          <Badge
                            variant="outline"
                            className={`mb-3 ${
                              webinar.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : "bg-[#c1502e] text-white"
                            }`}
                          >
                            {webinar.status === "APPROVED"
                              ? "UPCOMING"
                              : webinar.status}
                          </Badge>
                          <div className="mt-2">
                            <Button
                              variant="outline"
                              className="bg-[#c1502e] text-white hover:bg-[#472014] shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                              <Link
                                href={`/professor-profile/${webinar.professorId}`}
                              >
                                View Professor Profile
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>

        <div className="flex justify-center mt-6">
          {Array.from(
            { length: Math.ceil(filteredWebinars.length / webinarsPerPage) },
            (_, i) => (
              <Button
                key={i}
                onClick={() => paginate(i + 1)}
                variant={currentPage === i + 1 ? "default" : "outline"}
                className="mx-1 bg-[#c1502e] text-white hover:bg-[#472014]"
              >
                {i + 1}
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsComponent;
