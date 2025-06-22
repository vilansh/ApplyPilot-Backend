import express, { RequestHandler } from "express"
import { generateLetter } from "../services/aiMailer"

const router = express.Router()

const sendEmailsHandler: RequestHandler = async (req, res) => {
  const { user, rows } = req.body

  let successCount = 0

  for (const row of rows) {
    try {
      const letter = await generateLetter(row)
      // TODO: Implement actual email sending logic here
      console.log("Generated letter for:", row.email, letter)
      successCount++
    } catch (e) {
      console.error("Error for", row.email, e)
    }
  }

  res.json({ successCount })
}

router.post("/send-emails", sendEmailsHandler)

export default router
