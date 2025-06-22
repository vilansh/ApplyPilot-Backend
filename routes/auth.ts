import express, { RequestHandler } from "express"
import { addUserToWeaviate } from "../services/weaviateService"

const router = express.Router()

const googleLoginHandler: RequestHandler = async (req, res) => {
  const { name, email, photo } = req.body
  if (!name || !email) {
    res.status(400).json({ error: "Missing user info" })
    return
  }

  try {
    await addUserToWeaviate(name, email)
    res.status(200).json({ message: "User stored in Weaviate" })
  } catch (err) {
    console.error("Weaviate error:", err)
    res.status(500).json({ error: "Failed to store user in Weaviate" })
  }
}

router.post("/google-login", googleLoginHandler)

export default router
