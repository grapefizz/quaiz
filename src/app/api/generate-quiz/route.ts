import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI(); // Instantiated using process.env.OPENAI_API_KEY automatically

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to base64 for processing depending on type
    const fileBuffer = await file.arrayBuffer();
    const isImage = file.type.startsWith("image/");
    let contentToAnalyze = "";

    // OpenAI handles images vs text somewhat differently
    if (isImage) {
        const base64Image = Buffer.from(fileBuffer).toString("base64");
        // Convert to data URI
        contentToAnalyze = `data:${file.type};base64,${base64Image}`;
    } else {
        // If it's a lightweight text file, we can just run it as a string
        // Note: For large PDFs, typically you extract text first or use the Assistants API.
        // For simple demo purposes, we will treat it as a string buffer read.
        contentToAnalyze = Buffer.from(fileBuffer).toString("utf-8");
    }
    
    console.log(`Processing file: ${file.name} (${file.type})`);

    const systemPrompt = `
      You are an expert educational assistant. Analyze the provided uploaded material and generate a 10-question multiple-choice quiz based on its contents.
      
      Requirements:
      1. Create exactly 10 questions.
      2. Each question should have exactly 4 plausible options.
      3. Identify the correct answer (using the exact string from the options).
      4. Ensure the questions are challenging but fair based ONLY on the provided material.
    `;

    // Process the file with OpenAI GPT-4o
    const userMessageContent = isImage 
      ? [
          { type: "text", text: "Please create a quiz based on this image." },
          { type: "image_url", image_url: { url: contentToAnalyze } }
        ]
      : `Please create a quiz based on this text document:\n\n${contentToAnalyze.substring(0, 50000)}`; // Trim to avoid arbitrary huge size overload

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Using newest fast, multimodal mini model
        messages: [
            { role: "system", content: systemPrompt },
            // @ts-ignore - OpenAI types are finicky with mixed message arrays for Vision
            { role: "user", content: userMessageContent }
        ],
        temperature: 0.2,
        // Utilize Structured Outputs JSON mode for robust formatting
        response_format: {
             type: "json_schema",
             json_schema: {
                 name: "quiz_format",
                 schema: {
                     type: "object",
                     properties: {
                         questions: {
                             type: "array",
                             items: {
                                 type: "object",
                                 properties: {
                                     question: { type: "string" },
                                     options: { type: "array", items: { type: "string" } },
                                     answer: { type: "string" }
                                 },
                                 required: ["question", "options", "answer"],
                                 additionalProperties: false
                             }
                         }
                     },
                     required: ["questions"],
                     additionalProperties: false
                 },
                 strict: true
             }
        }
    });

    const responseText = response.choices[0].message.content || '{"questions": []}';
    
    // Parse the JSON response
    const quizData = JSON.parse(responseText);

    return NextResponse.json({ questions: quizData.questions });
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    
    // Check if the error is a quota/rate limit error
    const isQuotaError = 
      error?.status === 429 || 
      error?.code === 'insufficient_quota' ||
      error?.message?.toLowerCase().includes('quota') ||
      error?.message?.toLowerCase().includes('billing');

    if (isQuotaError) {
      console.warn("OpenAI Quota Exceeded. Returning mock questions instead.");
      return NextResponse.json({ 
        questions: [
          {
            question: "MOCK: What happens when an API quota is exceeded?",
            options: ["The computer explodes", "The API returns a 429 error", "The internet stops working", "You get free credits automatically"],
            answer: "The API returns a 429 error"
          },
          {
            question: "MOCK: In Next.js, what is the default behavior of components in the App Router?",
            options: ["Server Components", "Client Components", "Static HTML only", "GraphQL Resolvers"],
            answer: "Server Components"
          },
          {
            question: "MOCK: Which hook is used to manage state in React?",
            options: ["useContext", "useReducer", "useState", "useRef"],
            answer: "useState"
          },
          {
            question: "MOCK: How many seconds do you have per question in this quiz?",
            options: ["10", "15", "20", "25"],
            answer: "20"
          },
          {
            question: "MOCK: What is the main benefit of using TypeScript?",
            options: ["It runs faster in the browser", "It adds static typing to JavaScript", "It replaces HTML", "It is built by Apple"],
            answer: "It adds static typing to JavaScript"
          }
        ]
      });
    }

    // Extract explicit error message if from OpenAI API
    const errorMessage = error?.message || error?.toString() || "Failed to generate quiz";
    
    return NextResponse.json(
      { error: `OpenAI API Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
