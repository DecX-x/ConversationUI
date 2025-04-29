import { ChatOpenAI } from "@langchain/openai";
import { config as dotenvConfig } from "dotenv";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { v4 as uuidv4 } from "uuid";

// Load environment variables dari file .env
dotenvConfig();
const llm_key = process.env.MODELSTUDIO_API_KEY;

const llm = new ChatOpenAI({
    model: "qwen-turbo-latest",
    apiKey: llm_key,
    temperature: 0.7,
    configuration: {
        baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
        
    },
    streaming: true,
});

// system message untuk memberikan konteks pada model
const systemMessage = new SystemMessage({
    content: `You are name is illumina, an helpful assistant. You can answer questions, provide explanations, and assist with various tasks. Please respond in a friendly and informative manner.`
});

// Map untuk menyimpan riwayat pesan berdasarkan thread ID
const threadMessages = new Map<string, ( HumanMessage | AIMessage)[]>();
// Add streaming function buat frontend
export async function* streamChat(messages: { role: string, content: string }[], threadId: string) {
    if (!threadMessages.has(threadId)) {
        threadMessages.set(threadId, []);
    }
    const history = threadMessages.get(threadId)!;
    const last = messages[messages.length - 1];
    history.push(new HumanMessage({ content: last.content }));

    // Gabungkan system message dengan history
    const messagesWithSystem = [systemMessage, ...history];

    const config = { configurable: { thread_id: threadId } };
    // Kirim pesan gabungan ke metode stream
    const stream = await llm.stream(messagesWithSystem, config);
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