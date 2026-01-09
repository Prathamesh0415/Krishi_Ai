import { diseasePredict } from "@/lib/openai";
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = buffer.toString("base64");

    const result = await diseasePredict(base64Image)
    return NextResponse.json(result);
  } catch (error) {
    console.error("Disease prediction error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}