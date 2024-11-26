// NotificationsTab.tsx
"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "COMMENT" | "LIKE" | "DISLIKE";
  content: string;
  createdAt: string;
  isRead: boolean;
  professorId: string;
  blogId?: string;
  webinarId?: string;
  discussionId?: string;
  projectId?: string;
}

interface NotificationsTabProps {
  id: string;
  notifications: Notification[];
  handleMarkAsRead: (notificationId: string) => void;
  unreadCount: number;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({
  id,
  notifications,
  handleMarkAsRead,
}) => {
  return (
    <TabsContent value="notifications">
      {id === localStorage.getItem("userId") && (
        <Card className="border-2 border-[#eb5e17]/20 bg-white shadow-md">
          <CardHeader className="border-b border-[#eb5e17]/10">
            <CardTitle className="flex items-center text-2xl font-bold text-[#472014]">
              <Bell className="mr-3 h-6 w-6 text-[#eb5e17]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {notifications.length > 0 ? (
              <ul className="space-y-6">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-[#eb5e17]/20 hover:bg-gray-50"
                  >
                    <div className="space-y-2">
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
