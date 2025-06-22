import weaviate from "weaviate-ts-client"
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf"
import { config } from "dotenv"

config()

const client = weaviate.client({
  scheme: "https",
  host: process.env.WEAVIATE_URL!.replace("https://", ""),
  headers: {
    "Authorization": `Bearer ${process.env.WEAVIATE_API_KEY}`,
  },
})

const embedder = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HF_TOKEN,
  model: "sentence-transformers/all-MiniLM-L6-v2",
})

const ensureSchema = async () => {
  const schemaRes = await client.schema.getter().do()
  const exists = schemaRes.classes?.some((cls: any) => cls.class === "User") || false
  if (!exists) {
    await client.schema.classCreator().withClass({
      class: "User",
      vectorizer: "none",
      properties: [
        { name: "name", dataType: ["text"] },
        { name: "email", dataType: ["text"] },
      ],
    }).do()
    console.log("✅ Weaviate schema created")
  }
}

export const addUserToWeaviate = async (name: string, email: string) => {
  await ensureSchema()

  const vector = await embedder.embedQuery(`${name} ${email}`)

  await client.data
    .creator()
    .withClassName("User")
    .withProperties({ name, email })
    .withVector(vector)
    .do()
}
