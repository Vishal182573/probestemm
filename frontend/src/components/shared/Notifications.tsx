import React, { useState, useEffect } from "react";
import {
  Video,
  Calendar,
  MapPin,
  User,
  ArrowRight,
  Download,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/constants";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  webinarDocument?: string;
}

const NotificationsComponent: React.FC = () => {
  const router = useRouter();
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [filteredWebinars, setFilteredWebinars] = useState<Webinar[]>([]);
  const [filter, setFilter] = useState<"APPROVED" | "COMPLETED" | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [webinarsPerPage] = useState(5);

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
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
    <Card className="max-w-7xl mx-auto bg-white shadow-lg border-[#eb5e17]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-4xl font-bold text-[#472014] font-caveat">
          Webinars
        </CardTitle>
        <Badge variant="secondary" className="bg-[#eb5e17] text-white">
          {filteredWebinars.length} Total
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Select
            onValueChange={(value: "APPROVED" | "COMPLETED" | "ALL") =>
              setFilter(value)
            }
          >
            <SelectTrigger className="w-[180px] bg-white text-[#472014] border-[#eb5e17]">
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
              className="text-center text-[#472014] py-8"
            >
              No webinars found
            </motion.p>
          ) : (
            <ul className="space-y-6">
              {currentWebinars.map((webinar) => (
                <motion.li
                  key={webinar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white border-[#eb5e17] overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <Video className="h-12 w-12 text-[#eb5e17]" />
                            </div>
                          )}
                        </div>
                        <div className="w-full md:w-2/3 p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-semibold text-[#472014]">
                              {webinar.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`ml-2 ${
                                webinar.status === "APPROVED"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-[#eb5e17] text-white"
                              }`}
                            >
                              {webinar.status === "APPROVED"
                                ? "UPCOMING"
                                : webinar.status}
                            </Badge>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-[#686256]">
                              <Calendar className="h-4 w-4 mr-2 text-[#eb5e17]" />
                              {webinar.date}
                            </div>
                            <div className="flex items-center text-sm text-[#686256]">
                              <MapPin className="h-4 w-4 mr-2 text-[#eb5e17]" />
                              {webinar.place}
                            </div>
                            <div className="flex items-center text-sm text-[#686256]">
                              <User className="h-4 w-4 mr-2 text-[#eb5e17]" />
                              Max Attendees: {webinar.maxAttendees}
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-[#472014]">
                                  Topic
                                </p>
                                <p className="text-sm text-[#686256]">
                                  {webinar.topic}
                                </p>
                              </div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link
                                      href={`/professor-profile/${webinar.professorId}`}
                                    >
                                      <Button
                                        variant="outline"
                                        className="bg-[#5e17eb] text-white group flex items-center gap-2"
                                      >
                                        View Professor
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                                      </Button>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      View professor full profile and other
                                      webinars
                                    </p>
                                  </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => {
                                        window.open(
                                          webinar.webinarDocument,
                                          "_blank"
                                        );
                                      }}
                                      variant="outline"
                                      className="bg-[#eb5e17] text-white hover:bg-[#472014] group flex items-center gap-2"
                                    >
                                      <Download className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Download to view the webinar document</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
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

        <div className="flex justify-center mt-8">
          {Array.from(
            { length: Math.ceil(filteredWebinars.length / webinarsPerPage) },
            (_, i) => (
              <Button
                key={i}
                onClick={() => paginate(i + 1)}
                variant={currentPage === i + 1 ? "default" : "outline"}
                className={`mx-1 ${
                  currentPage === i + 1
                    ? "bg-[#eb5e17] text-white"
                    : "text-[#eb5e17] hover:bg-[#eb5e17] hover:text-white"
                }`}
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
