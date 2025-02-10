import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['user', 'bot']
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const conversationSchema = new mongoose.Schema({
    startedAt: {
        type: Date,
        default: Date.now
    },
    endedAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    messages: [messageSchema]
});

// If the model already exists, use it; otherwise, create a new one
export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema); 