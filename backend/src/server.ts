import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from 'socket.io';
import { FRONTEND_URL } from "./constants";
import { AdminJS } from "adminjs";
import type { AdminJSOptions, BrandingOptions, ActionResponse } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { Database, Resource, getModelByName } from "@adminjs/prisma";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createServer } from 'http';
import { createNotification } from "./controllers/notificationController";


// Route imports
import authRoutes from "./routes/authRoutes";
import studentsRoutes from "./routes/studentRoutes";
import professorRoutes from "./routes/professorRoutes";
import discussionRoutes from "./routes/discussionsRoutes";
import blogsRoutes from "./routes/blogsRoutes";
import webinarRoutes from "./routes/webinarRoutes";
import projectRoutes from "./routes/projectsRoutes";
import businessRoutes from "./routes/businessRoutes";
import superAdminRoutes from "./routes/superadminRoutes";
import imageUploadRoutes from "./routes/uploadImageRoutes";
import contactRoutes from "./routes/contactRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import faqRoutes from "./routes/faqRoutes";
import userRoutes from "./routes/userRoutes";
import patentRoutes from "./routes/patentRoutes";
import emailRoutes from "./routes/emailRoutes";
import chatRoutes from "./routes/chatRoutes"

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Socket.IO Configuration
const io = new Server(httpServer, {
  path: '/api/socket.io', // Add this line
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'] // Add this line to ensure fallback
});

// Store connected users
const connectedUsers = new Map();

// Socket.IO middleware for authentication
io.use((socket, next) => {
  const userId = socket.handshake.auth.userId;
  const userType = socket.handshake.auth.userType;
  
  if (!userId) {
    return next(new Error('Authentication error'));
  }
  
  socket.data.userId = userId;
  socket.data.userType = userType;
  next();
});

// Add a Map to track online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  const userId = socket.data.userId;
  connectedUsers.set(userId, socket.id);

  // console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);

  // Join a room specific to the user
  socket.join(userId);

  // Handle sending messages
socket.on('sendMessage', async (messageData) => {
  const { chatRoomId, senderId, receiverId } = messageData;
  
  // Append createdAt field with the current date and time
  messageData.createdAt = new Date().toISOString(); // ISO string for a standard date-time format
  
  // Get receiver's socket ID
  const receiverSocketId = connectedUsers.get(receiverId);
  
  if (receiverSocketId) {
    // Emit to specific user
    io.to(receiverSocketId).emit('receiveMessage', messageData);
  }
  
  // Also emit to sender for consistency
  socket.emit('receiveMessage', messageData);
});


  // Handle typing status with improved targeting
  socket.on('typing', ({ userId, chatRoomId, isTyping }) => {
    socket.broadcast.to(chatRoomId).emit('userTyping', { 
      userId, 
      chatRoomId, 
      isTyping 
    });
  });

  // Handle user coming online
  socket.on('userOnline', ({ userId }) => {
    onlineUsers.set(userId, true);
    // Broadcast to all connected clients that this user is online
    io.emit('userStatusUpdate', { userId, isOnline: true });
  });

  // Handle user going offline
  socket.on('userOffline', ({ userId }) => {
    onlineUsers.delete(userId);
    // Broadcast to all connected clients that this user is offline
    io.emit('userStatusUpdate', { userId, isOnline: false });
  });

  socket.on('disconnect', () => {
    const userId = socket.data.userId;
    connectedUsers.delete(userId);
    onlineUsers.delete(userId);
    // Broadcast offline status when user disconnects
    io.emit('userStatusUpdate', { userId, isOnline: false });
  });

  // When a new user connects, send them the current online users
  const onlineUsersArray = Array.from(onlineUsers.keys());
  socket.emit('initialOnlineUsers', 
    onlineUsersArray.reduce((acc, userId) => {
      acc[userId] = true;
      return acc;
    }, {})
  );
});

// Register Prisma Adapter
AdminJS.registerAdapter({ Database, Resource });

// Define types for request
interface CustomRequest {
  payload: {
    password?: string;
    [key: string]: any;
  };
}

// AdminJS Configuration
const setupAdminPanel = async () => {
  const adminOptions: AdminJSOptions = {
    resources: [
      {
        resource: { model: getModelByName("Student"), client: prisma },
        options: {
          properties: {
            password: {
              isVisible: {
                list: false,
                filter: false,
                show: false,
                edit: true,
              },
            },
            // researchHighlights: {
            //   isVisible: { list: false, filter: true, show: true, edit: true },
            //   type: "reference",
            // },
            // education: {
            //   isVisible: { list: false, filter: true, show: true, edit: true },
            //   type: "reference",
            // },
            // achievements: {
            //   isVisible: { list: false, filter: true, show: true, edit: true },
            //   type: "reference",
            // },
          },
          actions: {
            new: {
              before: async (request: CustomRequest) => {
                if (request.payload.password) {
                  request.payload.password = await bcrypt.hash(
                    request.payload.password,
                    10
                  );
                }
                return request;
              },
            },
            edit: {
              before: async (request: CustomRequest) => {
                if (request.payload.password) {
                  request.payload.password = await bcrypt.hash(
                    request.payload.password,
                    10
                  );
                }
                return request;
              },
            },
          },
        },
      },
      {
        resource: { model: getModelByName("Professor"), client: prisma },
        options: {
          properties: {
            password: {
              isVisible: {
                list: false,
                filter: false,
                show: false,
                edit: true,
              },
            },
            // researchInterests: {
            //   isVisible: { list: false, filter: true, show: true, edit: true },
            //   type: "reference",
            // },
            // positions: {
            //   isVisible: { list: false, filter: true, show: true, edit: true },
            //   type: "reference",
            // },
            // tags: {
            //   isVisible: { list: false, filter: true, show: true, edit: true },
            //   type: "reference",
            // },
            // achievements: {
            //   isVisible: { list: false, filter: true, show: true, edit: true },
            //   type: "reference",
            // },
          },
          actions: {
            new: {
              before: async (request: CustomRequest) => {
                if (request.payload.password) {
                  request.payload.password = await bcrypt.hash(
                    request.payload.password,
                    10
                  );
                }
                return request;
              },
            },
            edit: {
              before: async (request: CustomRequest) => {
                if (request.payload.password) {
                  request.payload.password = await bcrypt.hash(
                    request.payload.password,
                    10
                  );
                }
                return request;
              },
            },
          },
        },
      },
      {
        resource: { model: getModelByName("Business"), client: prisma },
        options: {
          properties: {
            password: {
              isVisible: {
                list: false,
                filter: false,
                show: false,
                edit: true,
              },
            },
            // projects: {
            //   isVisible: { list: false, filter: true, show: true, edit: true },
            //   type: "reference",
            // },
          },
          actions: {
            new: {
              before: async (request: CustomRequest) => {
                if (request.payload.password) {
                  request.payload.password = await bcrypt.hash(
                    request.payload.password,
                    10
                  );
                }
                return request;
              },
            },
            edit: {
              before: async (request: CustomRequest) => {
                if (request.payload.password) {
                  request.payload.password = await bcrypt.hash(
                    request.payload.password,
                    10
                  );
                }
                return request;
              },
            },
          },
        },
      },
      {
        resource: { model: getModelByName("Discussion"), client: prisma },
        options: {
          properties: {
            answers: {
              isVisible: { list: false, filter: true, show: true, edit: false },
              type: "reference",
            },
            votes: {
              isVisible: { list: false, filter: true, show: true, edit: false },
              type: "reference",
            },
            notifications: {
              isVisible: { list: false, filter: true, show: true, edit: false },
              type: "reference",
            },
          },
        },
      },
      {
        resource: { model: getModelByName("Answer"), client: prisma },
      },
      {
        resource: { model: getModelByName("Blog"), client: prisma },
        options: {
          properties: {
            comments: {
              isVisible: { list: false, filter: true, show: true, edit: false },
              type: "reference",
            },
            blogLikes: {
              isVisible: { list: false, filter: true, show: true, edit: false },
              type: "reference",
            },
            notifications: {
              isVisible: { list: false, filter: true, show: true, edit: false },
              type: "reference",
            },
          },
        },
      },
      {
        resource: { model: getModelByName("Comment"), client: prisma },
      },
      {
        resource: { model: getModelByName("BlogLike"), client: prisma },
      },
      {
        resource: { model: getModelByName("Project"), client: prisma },
        options: {
          properties: {
            professorApplications: {
              isVisible: { list: false, filter: true, show: true, edit: false },
              type: "reference",
            },
            studentApplications: {
              isVisible: { list: false, filter: true, show: true, edit: false },
              type: "reference",
            },
            businessApplications: {
              isVisible: { list: false, filter: true, show: true, edit: false },
              type: "reference",
            },
            notifications: {
              isVisible: { list: false, filter: true, show: true, edit: false },
              type: "reference",
            },
          },
        },
      },
      {
        resource: {
          model: getModelByName("ProfessorApplication"),
          client: prisma,
        },
      },
      {
        resource: {
          model: getModelByName("StudentApplication"),
          client: prisma,
        },
      },
      {
        resource: {
          model: getModelByName("BusinessApplication"),
          client: prisma,
        },
      },
      {
        resource: { model: getModelByName("Webinar"), client: prisma },
        options: {
          properties: {
            notifications: {
              isVisible: { list: false, filter: true, show: true, edit: false },
              type: "reference",
            },
          },
          actions: {
            edit: {
              after: async (response: ActionResponse) => {
                // Check if webinar status was changed to APPROVED
                if (response.record.params.status === 'APPROVED') {
                  try {
                    // Get all students
                    const students = await prisma.student.findMany({
                      select: { id: true }
                    });

                    // Get all professors
                    const professors = await prisma.professor.findMany({
                      select: { id: true }
                    });

                    const webinarTitle = response.record.params.title;
                    const webinarId = response.record.params.id;
                    const notificationContent = `New webinar : ${webinarTitle}`;
                    const redirectionLink = `/webinars`;

                    // Send notifications to all students
                    for (const student of students) {
                      await createNotification(
                        'WEBINAR_STATUS',
                        notificationContent,
                        student.id,
                        'student',
                        redirectionLink,
                        webinarId,
                        'webinar'
                      );
                    }

                    // Send notifications to all professors
                    for (const professor of professors) {
                      await createNotification(
                        'WEBINAR_STATUS',
                        notificationContent,
                        professor.id,
                        'professor',
                        redirectionLink,
                        webinarId,
                        'webinar'
                      );
                    }
                  } catch (error) {
                    console.error('Error sending webinar approval notifications:', error);
                  }
                }
                return response;
              },
            },
          },
        },
      },
      {
        resource: { model: getModelByName("SuperAdmin"), client: prisma },
        options: {
          properties: {
            password: {
              isVisible: {
                list: false,
                filter: false,
                show: false,
                edit: true,
              },
            },
            managedStudents: {
              isVisible: { list: false, filter: true, show: true, edit: true },
              type: "reference",
            },
            managedProfessors: {
              isVisible: { list: false, filter: true, show: true, edit: true },
              type: "reference",
            },
            managedBusinesses: {
              isVisible: { list: false, filter: true, show: true, edit: true },
              type: "reference",
            },
          },
          actions: {
            new: {
              before: async (request: CustomRequest) => {
                if (request.payload.password) {
                  request.payload.password = await bcrypt.hash(
                    request.payload.password,
                    10
                  );
                }
                return request;
              },
            },
            edit: {
              before: async (request: CustomRequest) => {
                if (request.payload.password) {
                  request.payload.password = await bcrypt.hash(
                    request.payload.password,
                    10
                  );
                }
                return request;
              },
            },
          },
        },
      },
      {
        resource: { model: getModelByName("FAQ"), client: prisma },
      },
      {
        resource: { model: getModelByName("Patent"), client: prisma },
        options: {
          properties: {
            notifications: {
              isVisible: { list: false, filter: true, show: true, edit: false },
              type: "reference",
            },
          },
        },
      },
      {
        resource: { model: getModelByName("Contact"), client: prisma },
        options: {
          actions: {
            edit: false,
            delete: false,
            new: false,
          },
        },
      },
      {
        resource: { model: getModelByName("Notification"), client: prisma },
        options: {
          actions: {
            edit: false,
            new: false,
          },
        },
      },
      {
        resource: {
          model: getModelByName("EmailVerification"),
          client: prisma,
        },
        options: {
          actions: {
            edit: false,
            new: false,
          },
        },
      },
      {
        resource: {
          model: getModelByName("ResearchHighlight"),
          client: prisma,
        },
      },
      {
        resource: { model: getModelByName("Education"), client: prisma },
      },
      // {
      //   resource: { model: getModelByName("Achievement"), client: prisma },
      // },
      {
        resource: { model: getModelByName("ResearchInterest"), client: prisma },
      },
      {
        resource: { model: getModelByName("ProfessorTag"), client: prisma },
      },
      {
        resource: { model: getModelByName("Position"), client: prisma },
      },
      {
        resource: { model: getModelByName("UserAccess"), client: prisma },
      },
    ],
    branding: {
      companyName: "Probe STEM Admin",
      logo: "https://your-logo-url.png",
      favicon: "https://your-favicon-url.ico",
      theme: {
        colors: {
          primary100: "#4361ee",
          primary80: "#4895ef",
          primary60: "#4cc9f0",
          primary40: "#7209b7",
          primary20: "#b5179e",
          
          grey100: "#1b1b1b",
          grey80: "#2d2d2d",
          grey60: "#505050",
          grey40: "#8c8c8c",
          grey20: "#e6e6e6",
          
          filterBg: "#f8f9fa",
          accent: "#3a0ca3",
          hoverBg: "#f1f3f5",

          successLight: "#d4edda",
          success: "#28a745",
          errorLight: "#f8d7da",
          error: "#dc3545",
          warningLight: "#fff3cd",
          warning: "#ffc107",
          infoLight: "#d1ecf1",
          info: "#17a2b8",
        },
        borders: {
          default: "2px",
          input: "1px",
          filterInput: "1px",
          table: "1px",
        },
        fontSizes: {
          xs: "12px",
          sm: "14px",
          default: "16px",
          lg: "18px",
          xl: "20px",
          h1: "36px",
          h2: "28px",
          h3: "24px",
          h4: "20px",
          h5: "16px",
        },
        font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" as any,
        shadows: {
          login: "0 15px 24px 0 rgba(0, 0, 0, 0.1)",
          cardHover: "0 4px 12px 0 rgba(0, 0, 0, 0.1)",
          drawer: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
          card: "0 1px 6px 0 rgba(0, 0, 0, 0.1)",
        },
      },
      assets: {
        styles: [
          "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
        ],
      }
    } as BrandingOptions,
    dashboard: {
      handler: async () => {
        return { some: "data" }
      },
    },
    rootPath: "/api/admin",
  };

  const admin = new AdminJS(adminOptions);

  // Build and use the router
  const adminRouter = AdminJSExpress.buildRouter(admin);
  return { admin, adminRouter };
};

// CORS configuration
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Set up AdminJS
const startApp = async () => {
  const { admin, adminRouter } = await setupAdminPanel();

  // Mount AdminJS
  app.use(admin.options.rootPath, adminRouter);

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/students", studentsRoutes);
  app.use("/api/professors", professorRoutes);
  app.use("/api/discussion", discussionRoutes);
  app.use("/api/blogs", blogsRoutes);
  app.use("/api/project", projectRoutes);
  app.use("/api/webinars", webinarRoutes);
  app.use("/api/businesss", businessRoutes);
  app.use("/api/super-admin", superAdminRoutes);
  app.use("/api/image", imageUploadRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/faqs", faqRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/patents", patentRoutes);
  app.use("/api/email", emailRoutes);
  app.use("/api/chat",chatRoutes);

  // Default route
  app.get("/", (req, res) => {
    res.send("Server is running");
  });

  // Start server using httpServer instead of app.listen
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket.IO server is running on port ${PORT}`);
    console.log(
      `AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`
    );
  });
};

// Initialize the application
startApp().catch((error) => {
  console.error("Failed to start the application:", error);
});

export default app;

export { io };
