import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import emailRoutes from "./routes/email";
import uploadRoutes from "./routes/upload";
import sendRoutes from "./routes/send";
import session from "express-session";
import gmailAuthRoutes from './routes/gmailAuth';

dotenv.config();

const app = express();
app.use(cors({
    origin: "http://localhost:3000", // or your deployed frontend domain
    credentials: true
}));
app.use(express.json());
app.use(session({ 
    secret: process.env.SESSION_SECRET || 'default-secret', 
    resave: false, 
    saveUninitialized: true 
}));

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Backend is running!", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/send-email", sendRoutes);
app.use("/", gmailAuthRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
  console.log("Test endpoint: http://localhost:5000/test");
});
