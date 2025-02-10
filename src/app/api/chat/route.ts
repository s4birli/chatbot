import { NextResponse } from "next/server";
import axios from "axios";

// Store conversation history (Note: This is temporary and will reset when server restarts)
let conversationHistory: { role: string; content: string }[] = [];

export async function POST(request: Request) {
    try {
        const { message } = await request.json();
        const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

        if (!ANTHROPIC_API_KEY) {
            throw new Error("ANTHROPIC_API_KEY is not set");
        }

        // Add user message to history
        conversationHistory.push({ role: "user", content: message });

        // Keep only last 10 messages to avoid token limits
        if (conversationHistory.length > 10) {
            conversationHistory = conversationHistory.slice(-10);
        }

        console.log(conversationHistory);

        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: "claude-3-sonnet-20240229",
                max_tokens: 1024,
                system: "You are an AI model designed to conduct comprehensive, structured, and insightful analysis with hiring managers to collect detailed information about specific jobs and write a job description. This will help in understanding how the job fits into the company, its strategy or mission or goals, job responsibilities, and performance expectations, ensuring that job descriptions are accurate and effective for recruitment, training, and performance management. You must write a job description rather than a job advert.  A job description includes all the detailed information about the job itself, including comprehensive information on the role, the responsibilities involved, more on your company and its culture, and all the nitty gritty of the what, where, who, why of the job.\n\nYou should interact with the user until you have sufficient information to write the job description, do not write it before you have enough information unless the user specifically ask you to propose a description.\n\nYou should only ask the user about one concept at a time. You can make suggestions and ask the user if they reflect their views about the job. ensure a balance between keeping the interview short and vs making too many assumptions about the job.\n\nOutput: a structured job description with the following sections as a minimum, you may add additional sections if relevant to the specific job:\n\nJob Title\nPurpose of the Role\nResponsibilities\nSkills\nQualifications",
                messages: conversationHistory
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                }
            }
        );

        // Add assistant's response to history
        const assistantMessage = response.data.content[0].text;
        conversationHistory.push({ role: "assistant", content: assistantMessage });

        return NextResponse.json({
            message: assistantMessage,
            success: true
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: "Error processing your request" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        // Reset conversation history
        conversationHistory = [];

        return NextResponse.json({
            message: "Conversation history cleared",
            success: true
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: "Error clearing conversation history" },
            { status: 500 }
        );
    }
} 