/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Video,
  Calendar,
  MapPin,
  User,
  ArrowRight,
  Download,
  Link as LinkIcon,
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
import { format } from 'date-fns';



// Define the Webinar interface to type-check the webinar data structure
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
  meetingLink?: string;
}

// Main NotificationsComponent - Displays a list of webinars with filtering and pagination
const NotificationsComponent: React.FC = () => {
  // Initialize router for navigation
  const router = useRouter();

  // State management
  const [webinars, setWebinars] = useState<Webinar[]>([]); // Stores all webinars
  const [filteredWebinars, setFilteredWebinars] = useState<Webinar[]>([]); // Stores filtered webinars based on status
  const [filter, setFilter] = useState<"APPROVED" | "COMPLETED" | "ALL">("ALL"); // Current filter selection
  const [currentPage, setCurrentPage] = useState(1); // Current page number for pagination
  const [webinarsPerPage] = useState(5); // Number of webinars to display per page

  // Fetch webinars from API on component mount
  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/webinars`);
        setWebinars(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch webinars:", error);
      }
    };

    fetchWebinars();
  }, []);

  // Filter webinars whenever the filter or webinars list changes
  useEffect(() => {
    const filtered =
      filter === "ALL"
        ? webinars
        : webinars.filter((webinar) => webinar.status === filter);
    setFilteredWebinars(filtered);
    setCurrentPage(1);
  }, [filter, webinars]);

  // Pagination logic
  const indexOfLastWebinar = currentPage * webinarsPerPage;
  const indexOfFirstWebinar = indexOfLastWebinar - webinarsPerPage;
  const currentWebinars = filteredWebinars.slice(
    indexOfFirstWebinar,
    indexOfLastWebinar
  );

  // Function to handle page changes
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Card className="max-w-7xl mx-auto bg-white shadow-lg border-[#eb5e17]">
      {/* Header section with title and total count */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-4xl font-bold text-[#472014] font-caveat">
          Webinars
        </CardTitle>
        <Badge variant="secondary" className="bg-[#eb5e17] text-white">
          {filteredWebinars.length} Total
        </Badge>
      </CardHeader>
      <CardContent>
        {/* Filter dropdown section */}
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

        {/* Animated list of webinars with empty state handling */}
        <AnimatePresence>
          {currentWebinars.length === 0 ? (
            // Empty state message
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-[#472014] py-8"
            >
              No webinars found
            </motion.p>
          ) : (
            // List of webinar cards
            <ul className="space-y-6">
              {currentWebinars.map((webinar) => (
                // Individual webinar card with animation
                <motion.li
                  key={webinar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white border-[#eb5e17] overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-0">
                      {/* Webinar card layout with image and details */}
                      <div className="flex flex-col md:flex-row">
                        {/* Webinar image section */}
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

                        {/* Webinar details section */}
                        <div className="w-full md:w-2/3 p-6">
                          {/* Title and status badge */}
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-semibold text-[#472014]">
                              {webinar.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`ml-2 ${webinar.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : "bg-[#eb5e17] text-white"
                                }`}
                            >
                              {webinar.status === "APPROVED"
                                ? "UPCOMING"
                                : webinar.status}
                            </Badge>
                          </div>

                          {/* Webinar metadata (date, place, attendees) */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-[#686256]">
                              <Calendar className="h-4 w-4 mr-2 text-[#eb5e17]" />
                              {format(new Date(webinar.date), 'MMM dd, yyyy h:mm a')}
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

                          {/* Topic and action buttons section */}
                          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            {/* Topic information and action buttons with tooltips */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              {/* Topic section */}
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-700">Topic</p>
                                <p className="text-base text-gray-600">{webinar.topic}</p>
                              </div>

                              {/* Action buttons group */}
                              <div className="flex items-center gap-3">
                                <TooltipProvider>
                                  {/* Professor Profile Button */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link href={`/professor-profile/${webinar.professorId}`}>
                                        <Button
                                          variant="outline"
                                          className="bg-[#eb5e17] hover:bg-[#d45415] text-white group flex items-center gap-2 transition-colors duration-200"
                                        >
                                          View Professor
                                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                                        </Button>
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View professor full profile</p>
                                    </TooltipContent>
                                  </Tooltip>

                                  {/* Meeting Link Button - Only shown if link exists */}
                                  {webinar.meetingLink && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          onClick={() => window.open(webinar.meetingLink, "_blank")}
                                          variant="outline"
                                          className="bg-[#eb5e17] hover:bg-[#d45415] text-white group flex items-center gap-2 transition-colors duration-200"
                                        >
                                          Meet Link
                                          <LinkIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Join the webinar meeting</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}

                                  {/* Download Button */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        onClick={() => window.open(webinar.webinarDocument, "_blank")}
                                        variant="outline"
                                        className="bg-[#eb5e17] hover:bg-[#d45415] text-white group flex items-center gap-2 p-2 transition-colors duration-200"
                                      >
                                        <Download className="h-4 w-4 group-hover:translate-y-1 transition-transform duration-200" />
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
                      </div>
                    </CardContent>
                  </Card>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>

        {/* Pagination controls */}
        <div className="flex justify-center mt-8">
          {Array.from(
            { length: Math.ceil(filteredWebinars.length / webinarsPerPage) },
            (_, i) => (
              <Button
                key={i}
                onClick={() => paginate(i + 1)}
                variant={currentPage === i + 1 ? "default" : "outline"}
                className={`mx-1 ${currentPage === i + 1
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