import { NextResponse } from "next/server";
import axios from "axios";
import connectDB from "@/lib/db";
import { Conversation } from "@/models/Conversation";

// Store conversation history (Note: This is temporary and will reset when server restarts)
let conversationHistory: { role: string; content: string }[] = [];
let currentConversationId: string | null = null;

export async function POST(request: Request) {
    try {
        await connectDB();
        const { message } = await request.json();
        const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
        const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT;

        if (!ANTHROPIC_API_KEY) {
            throw new Error("ANTHROPIC_API_KEY is not set");
        }

        if (!SYSTEM_PROMPT) {
            throw new Error("SYSTEM_PROMPT is not set");
        }

        // Add user message to history
        conversationHistory.push({ role: "user", content: message });

        // Create new conversation if none exists
        if (!currentConversationId) {
            const newConversation = await Conversation.create({
                status: 'active',
                messages: [{ role: 'user', content: message }]
            });
            currentConversationId = newConversation._id;
        } else {
            // Add message to existing conversation
            await Conversation.findByIdAndUpdate(
                currentConversationId,
                {
                    $push: { messages: { role: 'user', content: message } }
                }
            );
        }

        // Keep only last 10 messages to avoid token limits
        if (conversationHistory.length > 10) {
            conversationHistory = conversationHistory.slice(-10);
        }

        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: "claude-3-sonnet-20240229",
                max_tokens: 1024,
                system: SYSTEM_PROMPT,
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

        // Log bot response to MongoDB
        if (currentConversationId) {
            await Conversation.findByIdAndUpdate(
                currentConversationId,
                {
                    $push: { messages: { role: 'bot', content: assistantMessage } }
                }
            );
        }

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
        // Mark current conversation as completed if it exists
        if (currentConversationId) {
            await connectDB();
            await Conversation.findByIdAndUpdate(
                currentConversationId,
                {
                    status: 'completed',
                    endedAt: new Date()
                }
            );
            currentConversationId = null;
        }

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