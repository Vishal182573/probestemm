import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from 'socket.io';
import { FRONTEND_URL } from "./constants";
import { AdminJS } from "adminjs";
import type { AdminJSOptions, BrandingOptions } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { Database, Resource, getModelByName } from "@adminjs/prisma";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createServer } from 'http';


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
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
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

  socket.on('disconnect', () => {
    connectedUsers.delete(userId);
  });
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
      companyName: "Probe STEM Admin Panel",
      logo: undefined,
      favicon: undefined,
      theme: {
        colors: {
          primary100: "#FF0000",
          primary80: "#FF1A1A",
          primary60: "#FF3333",
          primary40: "#FF4D4D",
          primary20: "#FF6666",
          grey100: "#151515",
          grey80: "#333333",
          grey60: "#4d4d4d",
          grey40: "#666666",
          grey20: "#dddddd",
          filterBg: "#333333",
          accent: "#151515",
          hoverBg: "#151515",
        },
      },
    } as BrandingOptions,
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
