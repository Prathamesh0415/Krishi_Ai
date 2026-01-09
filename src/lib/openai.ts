import  { OpenAI } from "openai"
import { SYSTEM_PROMPT } from "./systemPrompt" 

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function askLLM(messages: any[]) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      { role: "assistant", content: SYSTEM_PROMPT },
      ...messages,
    ],
  })
  return response.choices[0].message.content
}
  