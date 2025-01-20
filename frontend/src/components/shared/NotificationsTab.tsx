// NotificationsTab.tsx
"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the structure for a Notification object
// This interface specifies all possible properties a notification can have
interface Notification {
  id: string;
  type: "COMMENT" | "LIKE" | "DISLIKE"; // Specific types of notifications supported
  content: string;                       // The actual notification message
  createdAt: string;                     // Timestamp of when notification was created
  isRead: boolean;                       // Track if notification has been read
  professorId: string;                   // ID of the professor associated with notification
  blogId?: string;                       // Optional: Associated blog ID
  webinarId?: string;                    // Optional: Associated webinar ID
  discussionId?: string;                 // Optional: Associated discussion ID
  projectId?: string;                    // Optional: Associated project ID
}

// Define props interface for the NotificationsTab component
interface NotificationsTabProps {
  id: string;                            // User ID
  notifications: Notification[];         // Array of notifications to display
  handleMarkAsRead: (notificationId: string) => void; // Function to mark notification as read
  unreadCount: number;                   // Count of unread notifications
}

// Main NotificationsTab component definition
const NotificationsTab: React.FC<NotificationsTabProps> = ({
  id,
  notifications,
  handleMarkAsRead,
}) => {
  return (
    // TabsContent wrapper for the notifications panel
    <TabsContent value="notifications">
      {/* Only show notifications if the current user matches the stored userId */}
      {id === localStorage.getItem("userId") && (
        // Main card container for notifications
        <Card className="border-2 border-[#eb5e17]/20 bg-white shadow-md">
          {/* Card header section with title and bell icon */}
          <CardHeader className="border-b border-[#eb5e17]/10">
            <CardTitle className="flex items-center text-2xl font-bold text-[#472014]">
              <Bell className="mr-3 h-6 w-6 text-[#eb5e17]" />
              Notifications
            </CardTitle>
          </CardHeader>
          
          {/* Card content section containing the list of notifications */}
          <CardContent className="p-6">
            {/* Conditional rendering based on notifications existence */}
            {notifications.length > 0 ? (
              // List of notifications when they exist
              <ul className="space-y-6">
                {/* Map through each notification to create list items */}
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-[#eb5e17]/20 hover:bg-gray-50"
                  >
                    {/* Notification content and date section */}
                    <div className="space-y-2">
                      {/* Notification message with conditional styling based on read status */}
                      <p
                        className={`${
                          notification.isRead
                            ? "text-gray-600"
                            : "font-semibold"
                        }`}
                      >
                        <span className="text-[#472014] text-xl font-bold leading-snug line-clamp-2">
                          {notification.content}
                        </span>
                      </p>
                      {/* Formatted date display */}
                      <p className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    {/* Conditional rendering of Mark as Read button for unread notifications */}
                    {!notification.isRead && (
                      <Button
                        onClick={() => handleMarkAsRead(notification.id)}
                        size="sm"
                        className="ml-4 bg-[#eb5e17] text-white transition-colors hover:bg-[#472014]"
                      >
                        Mark as Read
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              // Display message when no notifications exist
              <p className="text-center py-8 text-gray-500">
                No notifications yet.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
};

export default NotificationsTab;
