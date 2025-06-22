import express, { RequestHandler } from "express";
import multer from "multer";
import { parseExcelFile } from "../utils/parseExcel";
import { extractTextFromPDF } from "../utils/extractResumeText";
import { generateAndSendEmail } from "../services/emailService";

declare module 'express-serve-static-core' {
  interface Request {
    files?: { [fieldname: string]: Express.Multer.File[] };
  }
}

const upload = multer({ dest: "uploads/" });
const router = express.Router();

const uploadHandler: RequestHandler = async (req, res) => {
  try {
    const excelPath = req.files?.["excel"]?.[0].path;
    const resumePath = req.files?.["resume"]?.[0].path;

    if (!excelPath || !resumePath) {
      res.status(400).json({ error: "Missing required files" });
      return;
    }

    const resumeText = await extractTextFromPDF(resumePath);
    const recipients = parseExcelFile(excelPath);

    const user = {
      fullName: "John Doe", // Optional: Replace with Firebase user or frontend user data
      email: "johndoe@example.com",
      resumeText,
    };

    const results = await Promise.all(recipients.map((row: any) =>
      generateAndSendEmail({ user, row })
    ));

    res.status(200).json({ success: true, results });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Something went wrong during upload." });
  }
};

router.post("/upload", upload.fields([
  { name: "excel", maxCount: 1 },
  { name: "resume", maxCount: 1 }
]), uploadHandler);

export default router;
