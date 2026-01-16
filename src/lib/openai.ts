import  { OpenAI } from "openai"
import { SYSTEM_PROMPT } from "./systemPrompt" 
import { DISEASE_PROMPT } from "./systemPrompt"

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export async function diseasePredict(image: string){
    const dataUrl = `data:image/jpeg;base64,${image}`;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
            {
                role: "user",
                content: [
                { type: "text", text: DISEASE_PROMPT },
                {
                    type: "image_url",
                    image_url: { url: dataUrl },
                },
                ],
            },
            ],
            response_format: {
            type: "json_schema",
            json_schema: {
                name: "disease_analysis",
                strict: true,
                schema: {
                type: "object",
                properties: {
                    disease: { type: "string" },
                    confidence: { type: "string" },
                    description: { type: "string" },
                    advice: { type: "array", items: { type: "string" } }
                },
                required: ["disease", "confidence", "description", "advice"],
                additionalProperties: false
                }
            }
            }
        });


  //console.log(response.choices[0].message.content)

    const outputText = response.choices[0].message.content ?? "could'nt detect disease";

    let result;
    try {
      result = JSON.parse(outputText);
    } catch {
      result = {
        disease: "Unknown",
        confidence: "low",
        description: "Could not confidently identify the disease.",
        advice: ["Consult a local agriculture expert."],
      };
    }

    return result
}
  