"use client";
import React, { useState, useEffect } from "react";
import { Video } from "lucide-react";
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

interface Webinar {
  id: string;
  title: string;
  topic: string;
  place: string;
  date: string;
  status: "APPROVED" | "COMPLETED";
  maxAttendees: number;
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
        const response = await axios.get("http://localhost:5000/api/webinars");
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

  // const formatDate = (dateString: string) => {
  //   const options: Intl.DateTimeFormatOptions = {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   };
  //   return new Date(dateString).toLocaleDateString("en-US", options);
  // };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-[#82CAFF] border-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-blue-800">
          Webinars
        </CardTitle>
        <Badge variant="secondary" className="bg-blue-500 text-white">
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
            <SelectTrigger className="w-[180px] bg-white text-blue-800">
              <SelectValue placeholder="Filter webinars" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Webinars</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
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
              className="text-center text-blue-600"
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
                  <Card className="bg-white border-blue-200">
                    <CardContent className="flex items-center p-4">
                      <Video className="h-6 w-6 text-blue-500 mr-4" />
                      <div>
                        <h3 className="text-lg font-semibold text-blue-700">
                          {webinar.title}
                        </h3>
                        <p className="text-sm text-blue-500">
                          Topic: {webinar.topic}
                        </p>

                        <p className="text-sm text-blue-500">
                          Place: {webinar.place}
                        </p>

                        <Badge
                          variant="outline"
                          className={`mt-2 ${
                            webinar.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {webinar.status}
                        </Badge>
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
                className="mx-1 bg-blue-500 text-white hover:bg-blue-600"
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
