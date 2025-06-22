import express, { RequestHandler } from "express";
import { google } from "googleapis";

declare module 'express-session' {
  interface SessionData {
    tokens: any;
  }
}

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

// Step 1: Redirect user to Google's OAuth screen
const authGoogleHandler: RequestHandler = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  res.redirect(url);
};

// Step 2: Handle the OAuth callback and save tokens
const authCallbackHandler: RequestHandler = async (req, res) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code as string);
  oauth2Client.setCredentials(tokens);

  // Save tokens to session or database (here: session)
  req.session.tokens = tokens;

  res.send("Gmail connected successfully! You can now send emails.");
};

router.get("/auth/google", authGoogleHandler);
router.get("/auth/callback", authCallbackHandler);

export default router;
