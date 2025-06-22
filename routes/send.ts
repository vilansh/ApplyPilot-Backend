import express, { RequestHandler } from "express";
import multer from "multer";
import { sendEmailViaGmail } from "../services/sendEmail";
import path from "path";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Test endpoint to debug data
const testHandler: RequestHandler = (req, res) => {
  console.log("🧪 Test endpoint called");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Files:", req.files);
  console.log("File:", req.file);
  
  res.json({
    message: "Test endpoint working",
    receivedBody: req.body,
    receivedFiles: req.files,
    receivedFile: req.file,
    headers: req.headers
  });
};

const sendHandler: RequestHandler = async (req, res) => {
  try {
    console.log("📨 Received request body:", req.body);
    console.log("📨 Received files:", req.file);
    
    const recipient = JSON.parse(req.body.recipient);
    const coverLetter = req.body.generatedText || req.body.coverLetter || req.body.text;
    
    console.log("👤 Recipient:", recipient);
    console.log("📝 Cover Letter:", coverLetter);
    
    if (!req.file) {
      res.status(400).json({ success: false, error: "No file uploaded" });
      return;
    }
    
    if (!coverLetter) {
      res.status(400).json({ 
        success: false, 
        error: "No cover letter text provided. Check 'generatedText' field.",
        receivedFields: Object.keys(req.body)
      });
      return;
    }
    
    // Check if user is authenticated with Gmail
    if (!req.session.tokens) {
      res.status(401).json({ 
        success: false, 
        error: "Gmail not authenticated. Please authenticate first.",
        needsAuth: true
      });
      return;
    }
    
    const resumePath = req.file.path;
    const resumeFilename = req.file.originalname;

    console.log(`📧 Sending email to: ${recipient.email}`);
    console.log(`📄 Resume: ${resumeFilename}`);
    console.log(`📝 Cover letter length: ${coverLetter.length} characters`);

    await sendEmailViaGmail(
      recipient.email,
      "Your Cover Letter from ApplyPilot",
      coverLetter,
      req.session.tokens,
      resumePath,
      resumeFilename
    );

    // Cleanup the uploaded file
    fs.unlinkSync(resumePath);

    console.log(`✅ Email sent successfully to ${recipient.email}`);
    res.status(200).json({ success: true, message: "Email sent!" });
  } catch (err) {
    console.error("❌ Email send error:", err);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.error("Failed to cleanup file:", cleanupErr);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      error: "Email sending failed.",
      details: err instanceof Error ? err.message : "Unknown error"
    });
  }
};

router.get("/test", testHandler);
router.post("/", upload.single("resume"), sendHandler);

export default router;
