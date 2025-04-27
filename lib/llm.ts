import { ChatOpenAI } from "@langchain/openai";
import { config as dotenvConfig } from "dotenv";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { v4 as uuidv4 } from "uuid";

// Load environment variables dari file .env
dotenvConfig();
const llm_key = process.env.MODELSTUDIO_API_KEY;

const llm = new ChatOpenAI({
    model: "qwen-turbo",
    apiKey: llm_key,
    temperature: 0.7,
    configuration: {
        baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    },
    streaming: true
});



// Map untuk menyimpan riwayat pesan berdasarkan thread ID
const threadMessages = new Map<string, (HumanMessage | AIMessage)[]>();

// Export a function that can be used by other modules
export const invokeChat = async (messages: { role: string, content: string }[], threadId: string = uuidv4()) => {
    // Initialize thread if it doesn't exist
    if (!threadMessages.has(threadId)) {
        threadMessages.set(threadId, []);
    }
    
    const messageHistory = threadMessages.get(threadId)!;
    
    // Add user message to history
    const userMessage = new HumanMessage({ content: messages[messages.length - 1].content });
    messageHistory.push(userMessage);
    
    // Create config object with thread ID
    const config = { configurable: { thread_id: threadId } };
    
    // Get AI response
    const response = await llm.invoke(messageHistory, config);
    
    // Add AI response to history
    messageHistory.push(response);
    
    // Update message history in the map
    threadMessages.set(threadId, messageHistory);
    
    // Return all messages in the conversation
    return { messages: messageHistory };
};

// Add streaming function for frontend
export async function* streamChat(messages: { role: string, content: string }[], threadId: string) {
    if (!threadMessages.has(threadId)) {
        threadMessages.set(threadId, []);
    }
    const history = threadMessages.get(threadId)!;
    const last = messages[messages.length - 1];
    history.push(new HumanMessage({ content: last.content }));
    const config = { configurable: { thread_id: threadId } };
    const stream = await llm.stream(history, config);
    let responseContent = "";
    for await (const chunk of stream) {
        const content = typeof chunk.content === 'string' ? chunk.content : JSON.stringify(chunk.content);
        responseContent += content;
        yield content;
    }
    history.push(new AIMessage({ content: responseContent }));
    threadMessages.set(threadId, history);
}

export default llm;